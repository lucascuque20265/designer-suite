import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectForm } from "@/components/admin/project-form";
import { ArrowLeft } from "lucide-react";
import type { ProjectWithMedia } from "@/lib/portfolio";

export const Route = createFileRoute("/_authenticated/admin/$id")({
  head: () => ({ meta: [{ title: "Editar projeto" }, { name: "robots", content: "noindex" }] }),
  component: EditarProjeto,
});

function EditarProjeto() {
  const { id } = Route.useParams();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, category:categories(*), media(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      const p = data as unknown as ProjectWithMedia;
      p.media = (p.media ?? []).sort((a, b) => a.position - b.position);
      return p;
    },
  });

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-10">
        <Link to="/admin" className="section-label inline-flex items-center gap-2 hover:text-primary">
          <ArrowLeft className="h-3 w-3" /> Voltar
        </Link>
        {isLoading || !data ? (
          <p className="mt-6 text-muted-foreground">Carregando...</p>
        ) : (
          <>
            <h1 className="font-display text-5xl mt-4 mb-10">Editar: {data.title}</h1>
            <ProjectForm
              projectId={data.id}
              initialMedia={data.media}
              initial={{
                title: data.title,
                client: data.client ?? "",
                category_id: data.category_id,
                year: data.year ? String(data.year) : "",
                tools: data.tools.join(", "),
                description: data.description ?? "",
                featured: data.featured,
                published: data.published,
              }}
              onSaved={() => refetch()}
            />
          </>
        )}
      </div>
    </div>
  );
}
