import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: Array<{ path: string; changefreq?: string; priority?: string }> = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/trabalhos", changefreq: "weekly", priority: "0.9" },
          { path: "/sobre", changefreq: "monthly", priority: "0.6" },
          { path: "/contato", changefreq: "monthly", priority: "0.6" },
        ];

        try {
          const { data } = await supabase.from("projects").select("slug, updated_at").eq("published", true);
          for (const p of data ?? []) {
            entries.push({ path: `/projeto/${p.slug}`, changefreq: "monthly", priority: "0.8" });
          }
        } catch {
          // no-op — sitemap still serves static routes
        }

        const urls = entries.map((e) => [
          `  <url>`,
          `    <loc>${BASE_URL}${e.path}</loc>`,
          e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
          e.priority ? `    <priority>${e.priority}</priority>` : null,
          `  </url>`,
        ].filter(Boolean).join("\n"));

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
