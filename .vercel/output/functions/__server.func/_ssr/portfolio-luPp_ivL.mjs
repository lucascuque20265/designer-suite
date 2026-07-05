import { t as supabase } from "./client-DyGLHKzc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portfolio-luPp_ivL.js
function slugify(input) {
	return input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "").slice(0, 80);
}
async function fetchCategories() {
	const { data, error } = await supabase.from("categories").select("*").order("name");
	if (error) throw error;
	return data ?? [];
}
async function fetchPublishedProjects() {
	const { data, error } = await supabase.from("projects").select("*, category:categories(*)").eq("published", true).order("sort_order", { ascending: true }).order("created_at", { ascending: false });
	if (error) throw error;
	return data ?? [];
}
async function fetchFeaturedProjects(limit = 6) {
	const { data, error } = await supabase.from("projects").select("*, category:categories(*)").eq("published", true).eq("featured", true).order("sort_order", { ascending: true }).limit(limit);
	if (error) throw error;
	return data ?? [];
}
async function fetchProjectBySlug(slug) {
	const { data, error } = await supabase.from("projects").select("*, category:categories(*), media(*)").eq("slug", slug).maybeSingle();
	if (error) throw error;
	if (!data) return null;
	const project = data;
	project.media = (project.media ?? []).sort((a, b) => a.position - b.position);
	return project;
}
async function fetchAdjacentProjects(slug) {
	const all = await fetchPublishedProjects();
	const idx = all.findIndex((p) => p.slug === slug);
	if (idx === -1) return {
		prev: null,
		next: null
	};
	const prev = idx > 0 ? all[idx - 1] : all[all.length - 1];
	const next = idx < all.length - 1 ? all[idx + 1] : all[0];
	return {
		prev: prev && prev.slug !== slug ? {
			slug: prev.slug,
			title: prev.title
		} : null,
		next: next && next.slug !== slug ? {
			slug: next.slug,
			title: next.title
		} : null
	};
}
//#endregion
export { fetchPublishedProjects as a, fetchProjectBySlug as i, fetchCategories as n, slugify as o, fetchFeaturedProjects as r, fetchAdjacentProjects as t };
