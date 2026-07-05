import { defineEventHandler, readBody, createError } from 'h3';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { randomUUID } from 'crypto';

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as Record<string, any>;
  const headerSecret = (event.node.req.headers['x-transcode-secret'] || event.node.req.headers['authorization']) as string | undefined;
  const serverSecret = process.env.TRANSCODE_SECRET;
  if (serverSecret) {
    if (!headerSecret || headerSecret !== serverSecret) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
    }
  }

  const storage_path = body?.storage_path as string | undefined;
  const media_id = body?.media_id as string | undefined;
  const target_size = Number(body?.target_size || 50 * 1024 * 1024);
  if (!storage_path) throw createError({ statusCode: 400, statusMessage: 'storage_path required' });

  // dynamic import of supabase admin client
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');

  try {
    // mark as processing if we have a media row id
    if (media_id) {
      try { await supabaseAdmin.from('media').update({ transcode_status: 'processing' }).eq('id', media_id); } catch (e) { console.warn('Failed to set processing status', e); }
    }

    const download = await supabaseAdmin.storage.from('portfolio-media').download(storage_path);
    if (download.error) throw download.error;
    const blob = download.data as Blob;
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = path.extname(storage_path) || '.mp4';
    const inputPath = path.join(os.tmpdir(), `${randomUUID()}${ext}`);
    const outputPath = path.join(os.tmpdir(), `${randomUUID()}.mp4`);
    await fs.writeFile(inputPath, buffer);

    const ffmpegModule = await import('ffmpeg-static');
    const execaMod = await import('execa');
    const ffmpegPath = ffmpegModule.default || ffmpegModule;
    const execa = execaMod.execa || execaMod.default || execaMod;

    // probe duration using ffmpeg stderr (avoids ffprobe dependency)
    const probeRes = await execa(ffmpegPath, ['-i', inputPath], { reject: false });
    const stderr = probeRes.stderr || '';
    const m = stderr.match(/Duration:\s(\d+):(\d+):(\d+\.\d+)/);
    let duration = 1;
    if (m) {
      const hh = Number(m[1]);
      const mm = Number(m[2]);
      const ss = Number(m[3]);
      duration = Math.max(1, hh * 3600 + mm * 60 + ss);
    }

    // compute bitrates (kbps)
    const audioKbps = 128;
    const totalKbps = Math.max(300, Math.floor(((target_size * 8) / duration) / 1000 * 0.95));
    let videoKbps = Math.max(200, totalKbps - audioKbps);

    // attempt transcode with decreasing bitrate until fits or attempts exhausted
    let attempts = 0;
    let finalSize = Infinity;
    while (attempts < 4) {
      attempts++;
      try {
        await execa(ffmpegPath, [
          '-y',
          '-i', inputPath,
          '-c:v', 'libx264',
          '-preset', 'medium',
          '-b:v', `${videoKbps}k`,
          '-maxrate', `${videoKbps}k`,
          '-bufsize', `${Math.max(1000, videoKbps * 2)}k`,
          '-c:a', 'aac',
          '-b:a', '128k',
          '-movflags', '+faststart',
          outputPath,
        ], { timeout: 1000 * 60 * 10 });
      } catch (err) {
        // try again with lower bitrate
      }

      try {
        const stat = await fs.stat(outputPath);
        finalSize = stat.size;
        if (finalSize <= target_size) break;
        // reduce bitrate and retry
        videoKbps = Math.max(100, Math.floor(videoKbps * 0.7));
      } catch (err) {
        // file may not exist yet
        videoKbps = Math.max(100, Math.floor(videoKbps * 0.7));
      }
    }

    if (!await exists(outputPath)) throw new Error('Failed to create transcoded file');

    const outBuf = await fs.readFile(outputPath);
    const newPath = storage_path.replace(/(\.[^.]+)?$/, '-opt.mp4');
    const { error: upErr } = await supabaseAdmin.storage.from('portfolio-media').upload(newPath, outBuf, { contentType: 'video/mp4', upsert: true });
    if (upErr) throw upErr;
    const { data: pub } = supabaseAdmin.storage.from('portfolio-media').getPublicUrl(newPath);

    if (media_id) {
      await supabaseAdmin.from('media').update({ url: pub.publicUrl, storage_path: newPath, transcode_status: 'done' }).eq('id', media_id);
    }

    // cleanup
    try { await fs.unlink(inputPath); } catch {};
    try { await fs.unlink(outputPath); } catch {};

    return { ok: true, url: pub.publicUrl, size: outBuf.length };
  } catch (err: any) {
    console.error(err);
    // mark failed if we have media id
    try { if (media_id) await (await import('@/integrations/supabase/client.server')).supabaseAdmin.from('media').update({ transcode_status: 'failed' }).eq('id', media_id); } catch (e) { console.warn('Failed to set failed status', e); }
    throw createError({ statusCode: 500, statusMessage: String(err?.message ?? err) });
  }
});

async function exists(p: string) {
  try { await fs.access(p); return true; } catch { return false; }
}
