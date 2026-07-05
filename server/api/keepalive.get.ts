import { defineEventHandler } from 'h3';

export default defineEventHandler(async () => {
  try {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data, error } = await supabaseAdmin.from('projects').select('id,slug,title,published').order('created_at', { ascending: false }).limit(20);
    if (error) {
      // Log server-side for diagnostics
      // eslint-disable-next-line no-console
      console.error('keepalive supabase error', error);
      return { ok: false, error: error.message ?? String(error) };
    }
    return { ok: true, projects_found: Array.isArray(data) ? data.length : (data ? 1 : 0), projects: data };
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('keepalive handler error', err);
    return { ok: false, error: String(err) };
  }
});
