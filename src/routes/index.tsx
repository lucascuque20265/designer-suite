import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchFeaturedProjects } from "@/lib/portfolio";
import { ProjectCard } from "@/components/project-card";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { data: featured } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: () => fetchFeaturedProjects(6),
  });

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center px-6 md:px-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, var(--primary) 0%, transparent 50%), radial-gradient(circle at 80% 70%, var(--primary) 0%, transparent 50%)",
          }}
        />
        <div className="mx-auto max-w-[1400px] w-full relative">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-label"
          >
            [ 00 / Anima Estudio · Design Sênior ]
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-display text-[15vw] md:text-[10rem] leading-[0.9] mt-6 tracking-tight"
          >
            Lucas
            <br />
            Miranda<span className="text-primary">.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 max-w-xl text-lg md:text-xl text-muted-foreground"
          >
            {SITE.tagline} Mais de uma década desenhando marcas, campanhas e narrativas visuais que ficam.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link
              to="/trabalhos"
              className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Ver trabalhos
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
            >
              Falar comigo
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-6 left-6 md:left-10 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
          Role para explorar ↓
        </div>
      </section>

      {/* Featured projects */}
      <section className="px-6 md:px-10 py-24 md:py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="section-label">[ 01 / Projetos em destaque ]</p>
              <h2 className="font-display text-5xl md:text-7xl mt-4">Trabalho selecionado</h2>
            </div>
            <Link to="/trabalhos" className="hidden md:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {!featured?.length ? (
            <div className="border border-dashed border-border rounded-lg p-16 text-center">
              <p className="text-muted-foreground">
                Ainda não há projetos em destaque publicados. Marque projetos como "destaque" no painel para vê-los aqui.
              </p>
            </div>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA strip */}
      <section className="px-6 md:px-10 py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="border-t border-border pt-16 grid gap-10 md:grid-cols-[1fr_auto] items-end">
            <div>
              <p className="section-label">[ 02 / Colaborar ]</p>
              <h2 className="font-display text-5xl md:text-7xl mt-4 leading-[0.95]">
                Tem um projeto que pede
                <br />
                <span className="text-primary">olhar de sênior</span>?
              </h2>
            </div>
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors self-start md:self-end shrink-0"
            >
              Vamos conversar <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
