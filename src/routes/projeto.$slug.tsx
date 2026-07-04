import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchAdjacentProjects, fetchProjectBySlug } from "@/lib/portfolio";
import { ProjectCarousel } from "@/components/project-carousel";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/projeto/$slug")({
  loader: async ({ params }) => {
    const project = await fetchProjectBySlug(params.slug);
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Projeto — Lucas Miranda" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.title} — Lucas Miranda`;
    const desc = loaderData.description?.slice(0, 155) ?? `Projeto de design gráfico: ${loaderData.title}.`;
    const image = loaderData.cover_url ?? undefined;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/projeto/${params.slug}` },
        ...(image ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
      ],
      links: [{ rel: "canonical", href: `/projeto/${params.slug}` }],
    };
  },
  component: ProjetoDetalhe,
  errorComponent: () => (
    <div className="min-h-screen grid place-items-center px-6">
      <div className="text-center">
        <p className="section-label">[ Erro ]</p>
        <h1 className="font-display text-5xl mt-4">Não conseguimos abrir o projeto</h1>
        <Link to="/trabalhos" className="text-primary mt-6 inline-block">Ver todos os projetos</Link>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center px-6">
      <div className="text-center">
        <p className="section-label">[ 404 ]</p>
        <h1 className="font-display text-5xl mt-4">Projeto não encontrado</h1>
        <Link to="/trabalhos" className="text-primary mt-6 inline-block">Ver todos os projetos</Link>
      </div>
    </div>
  ),
});

function ProjetoDetalhe() {
  const project = Route.useLoaderData();
  const { slug } = Route.useParams();

  const { data: adj } = useQuery({
    queryKey: ["adjacent", slug],
    queryFn: () => fetchAdjacentProjects(slug),
  });

  return (
    <div className="px-6 md:px-10 py-16 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <Link to="/trabalhos" className="section-label inline-flex items-center gap-2 hover:text-primary transition-colors">
          <ArrowLeft className="h-3 w-3" /> Todos os trabalhos
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-end"
        >
          <div>
            <p className="section-label">
              [ {project.category?.name ?? "Projeto"} · {project.year ?? "—"} ]
            </p>
            <h1 className="font-display text-6xl md:text-8xl mt-4 leading-[0.95]">{project.title}</h1>
          </div>
          {project.client && (
            <div className="text-right">
              <p className="section-label">[ Cliente ]</p>
              <p className="font-display text-2xl mt-2">{project.client}</p>
            </div>
          )}
        </motion.div>

        <div className="mt-12 md:mt-16">
          <ProjectCarousel media={project.media} />
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-[2fr_1fr]">
          <div>
            <p className="section-label">[ Sobre o projeto ]</p>
            <div className="mt-4 text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {project.description || "Sem descrição fornecida."}
            </div>
          </div>
          <div className="space-y-6">
            {project.tools.length > 0 && (
              <div>
                <p className="section-label">[ Ferramentas ]</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.tools.map((t) => (
                    <li key={t} className="text-xs font-mono px-3 py-1 rounded-full border border-border">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {(adj?.prev || adj?.next) && (
          <div className="mt-24 border-t border-border pt-8 flex justify-between gap-6">
            {adj?.prev ? (
              <Link to="/projeto/$slug" params={{ slug: adj.prev.slug }} className="group max-w-xs">
                <p className="section-label group-hover:text-primary transition-colors">
                  <ArrowLeft className="inline h-3 w-3 mr-1" /> Anterior
                </p>
                <p className="font-display text-2xl mt-2 group-hover:text-primary transition-colors">
                  {adj.prev.title}
                </p>
              </Link>
            ) : <div />}
            {adj?.next && (
              <Link to="/projeto/$slug" params={{ slug: adj.next.slug }} className="group max-w-xs text-right">
                <p className="section-label group-hover:text-primary transition-colors">
                  Próximo <ArrowRight className="inline h-3 w-3 ml-1" />
                </p>
                <p className="font-display text-2xl mt-2 group-hover:text-primary transition-colors">
                  {adj.next.title}
                </p>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
