import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchCategories, fetchPublishedProjects } from "@/lib/portfolio";
import { ProjectCard } from "@/components/project-card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/trabalhos")({
  head: () => ({
    meta: [
      { title: "Trabalhos — Lucas Miranda | Anima Estudio" },
      { name: "description", content: "Portfólio completo de projetos de design gráfico: identidade visual, direção de arte, editorial e mais." },
      { property: "og:title", content: "Trabalhos" },
      { property: "og:description", content: "Grade completa de projetos publicados no portfólio." },
      { property: "og:url", content: "/trabalhos" },
    ],
    links: [{ rel: "canonical", href: "/trabalhos" }],
  }),
  component: Trabalhos,
});

function Trabalhos() {
  const { data: projects } = useQuery({ queryKey: ["projects"], queryFn: fetchPublishedProjects });
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = useMemo(
    () => (filter ? projects?.filter((p) => p.category_id === filter) : projects) ?? [],
    [projects, filter],
  );

  const activeCategories = useMemo(() => {
    if (!categories || !projects) return [];
    const used = new Set(projects.map((p) => p.category_id).filter(Boolean));
    return categories.filter((c) => used.has(c.id));
  }, [categories, projects]);

  return (
    <div className="px-6 md:px-10 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <p className="section-label">[ Trabalhos ]</p>
        <h1 className="font-display text-6xl md:text-8xl mt-4">Portfólio</h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Uma seleção de projetos publicados. Filtre por categoria para navegar mais rápido.
        </p>

        {activeCategories.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter(null)}
              className={cn(
                "px-4 py-2 rounded-full text-sm border transition-colors",
                filter === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground",
              )}
            >
              Todos
            </button>
            {activeCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm border transition-colors",
                  filter === c.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground",
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-full border border-dashed border-border rounded-lg p-16 text-center">
              <p className="text-muted-foreground">Nenhum projeto {filter ? "nessa categoria" : "publicado ainda"}.</p>
            </div>
          ) : (
            filtered.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)
          )}
        </div>
      </div>
    </div>
  );
}
