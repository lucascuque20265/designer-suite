import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as Record<string, any>;
  const projectId = body?.project_id as string | undefined;
  const slug = body?.slug as string | undefined;
  const removeOriginal = !!body?.remove_original;
  const maxWidth = typeof body?.maxWidth === 'number' ? body.maxWidth : 2048;
  const quality = typeof body?.quality === 'number' ? body.quality : 80;

  try {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');

    let pid = projectId;
    if (!pid) {
      if (!slug) throw createError({ statusCode: 400, statusMessage: 'project_id or slug required' });
      const { data: pData, error: pErr } = await supabaseAdmin.from('projects').select('id').eq('slug', slug).limit(1);
      if (pErr) throw pErr;
      if (!pData || (pData as any[]).length === 0) throw createError({ statusCode: 404, statusMessage: `Project not found: ${slug}` });
      pid = (pData as any[])[0].id;
    const { data: medias, error: mErr } = await supabaseAdmin
      .from('media')
      .select('id,storage_path,url,type')
      .eq('project_id', pid)
      .eq('type', 'image');
    if (mErr) throw mErr;

    const results: any[] = [];

    for (const m of (medias ?? [])) {
      try {
        if (!m.storage_path) {
          results.push({ id: m.id, status: 'skipped', reason: 'no storage_path' });
          continue;
        }

        const download = await supabaseAdmin.storage.from('portfolio-media').download(m.storage_path);
        if (download.error) {
          results.push({ id: m.id, status: 'error', error: download.error.message });
          continue;
        }

        // download.data is a Blob in the browser-like environment; convert to Buffer
        const blob = download.data as Blob;
        const arrayBuffer = await (blob as any).arrayBuffer();
        const inputBuf = Buffer.from(arrayBuffer as ArrayBuffer);
        const inputSize = inputBuf.length;

        // dynamic import sharp so build doesn't fail if not installed locally
        let sharp: any;
        try {
          const sharpMod = await import('sharp');
          sharp = sharpMod.default || sharpMod;
        } catch (e) {
          results.push({ id: m.id, status: 'error', error: 'sharp not installed on server runtime' });
          continue;
        }

        let transformer = sharp(inputBuf).rotate();
        transformer = transformer.resize({ width: maxWidth, withoutEnlargement: true });
        const outBuf = await transformer.webp({ quality }).toBuffer();
        const newSize = outBuf.length;
        const newPath = m.storage_path.replace(/(\.[^.]+)?$/, '-opt.webp');

        const { error: upErr } = await supabaseAdmin.storage.from('portfolio-media').upload(newPath, outBuf, { contentType: 'image/webp', upsert: true });
        if (upErr) {
          results.push({ id: m.id, status: 'error', error: upErr.message });
          continue;
        }
        const { data: pub } = supabaseAdmin.storage.from('portfolio-media').getPublicUrl(newPath);

        const { error: updErr } = await supabaseAdmin.from('media').update({ url: pub.publicUrl, storage_path: newPath }).eq('id', m.id);
        if (updErr) {
          results.push({ id: m.id, status: 'error', error: updErr.message });
          continue;
        }

        if (removeOriginal) {
          try {
            const { error: delErr } = await supabaseAdmin.storage.from('portfolio-media').remove([m.storage_path]);
            if (delErr) {
              results.push({ id: m.id, status: 'done', inputSize, newSize, newPath, newUrl: pub.publicUrl, removeOriginal: false, warning: delErr.message });
              continue;
            }
          } catch (err) {
            results.push({ id: m.id, status: 'done', inputSize, newSize, newPath, newUrl: pub.publicUrl, removeOriginal: false, warning: String(err) });
            continue;
          }
        }

        results.push({ id: m.id, status: 'done', inputSize, newSize, newPath, newUrl: pub.publicUrl });
      } catch (err: any) {
        results.push({ id: m.id, status: 'error', error: err?.message ?? String(err) });
      }
    }

    return { ok: true, project_id: pid, processed: results.length, details: results };
  } catch (err: any) {
    throw createError({ statusCode: 500, statusMessage: err?.message ?? String(err) });
  }
});
