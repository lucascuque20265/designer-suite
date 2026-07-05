import { supabase } from "@/integrations/supabase/client";

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Media = {
  id: string;
  project_id: string;
  type: "image" | "video";
  url: string;
  storage_path: string | null;
  position: number;
  is_cover: boolean;
  transcode_status?: 'pending' | 'processing' | 'done' | 'failed' | null;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  client: string | null;
  category_id: string | null;
  year: number | null;
  tools: string[];
  description: string | null;
  cover_url: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: Category | null;
};

export type ProjectWithMedia = Project & { media: Media[] };

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function fetchPublishedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*, category:categories(*)")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as Project[]) ?? [];
}

export async function fetchFeaturedProjects(limit = 6): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*, category:categories(*)")
    .eq("published", true)
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data as unknown as Project[]) ?? [];
}

export async function fetchProjectBySlug(slug: string): Promise<ProjectWithMedia | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*, category:categories(*), media(*)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const project = data as unknown as ProjectWithMedia;
  project.media = (project.media ?? []).sort((a, b) => a.position - b.position);
  return project;
}

export async function fetchAdjacentProjects(slug: string): Promise<{
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}> {
  const all = await fetchPublishedProjects();
  const idx = all.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  const prev = idx > 0 ? all[idx - 1] : all[all.length - 1];
  const next = idx < all.length - 1 ? all[idx + 1] : all[0];
  return {
    prev: prev && prev.slug !== slug ? { slug: prev.slug, title: prev.title } : null,
    next: next && next.slug !== slug ? { slug: next.slug, title: next.title } : null,
  };
}

export function mediaPublicUrl(storagePath: string) {
  const { data } = supabase.storage.from("portfolio-media").getPublicUrl(storagePath);
  return data.publicUrl;
}
