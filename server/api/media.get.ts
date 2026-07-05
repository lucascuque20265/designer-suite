import { defineEventHandler, getQuery, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const q = getQuery(event) as Record<string, any>;
  const project_id = q.project_id || q.projectId;
  if (!project_id) throw createError({ statusCode: 400, statusMessage: 'project_id required' });

  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');

  const { data, error } = await supabaseAdmin
    .from('media')
    .select('id, type, url, storage_path, position, is_cover, transcode_status')
    .eq('project_id', project_id)
    .order('position', { ascending: true });

  if (error) throw createError({ statusCode: 500, statusMessage: error.message });

  return { data };
});
