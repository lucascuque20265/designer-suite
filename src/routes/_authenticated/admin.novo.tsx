import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ProjectForm } from "@/components/admin/project-form";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/novo")({
  head: () => ({ meta: [{ title: "Novo projeto" }, { name: "robots", content: "noindex" }] }),
  component: NovoProjeto,
});

function NovoProjeto() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-10">
        <Link to="/admin" className="section-label inline-flex items-center gap-2 hover:text-primary">
          <ArrowLeft className="h-3 w-3" /> Voltar
        </Link>
        <h1 className="font-display text-5xl mt-4 mb-10">Novo projeto</h1>
        <ProjectForm
          initial={{}}
          onSaved={(p) => navigate({ to: "/admin/$id", params: { id: p.id } })}
        />
      </div>
    </div>
  );
}
