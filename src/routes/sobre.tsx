import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — Lucas Miranda | Anima Estudio" },
      { name: "description", content: "Trajetória, especialidades e ferramentas de Lucas Miranda, designer gráfico sênior." },
      { property: "og:title", content: "Sobre" },
      { property: "og:description", content: "Designer sênior com trajetória em identidade visual, direção de arte e projetos editoriais." },
      { property: "og:url", content: "/sobre" },
    ],
    links: [{ rel: "canonical", href: "/sobre" }],
  }),
  component: Sobre,
});

const specialties = [
  "Identidade visual e branding",
  "Direção de arte",
  "Videomaker para marcas",
  "Design para campanhas",
  "Edição de Vídeo e Motion Graphics",
  "Design digital e social",
];

const tools = [
  "Adobe Illustrator",
  "Adobe Photoshop",
  "Adobe InDesign",
  "Adobe After Effects",
  "Figma",
  "Nano Banana 2",
  "GPT Image fa2",
  "Midjourney",
  "Veo AI",
  "Runway",
  "Seedance",
  "Kling",
];

function Sobre() {
  return (
    <div className="px-6 md:px-10 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <p className="section-label">[ Sobre ]</p>
        <h1 className="font-display text-6xl md:text-8xl mt-4 leading-[0.95]">
          Design como <span className="text-primary">ofício</span>,
          <br />
          não como fórmula.
        </h1>

        <div className="mt-16 grid gap-16 md:grid-cols-[3fr_2fr]">
          <div className="space-y-6 text-lg leading-relaxed text-foreground/90">
            <p>
              Sou Lucas Miranda, designer gráfico sênior à frente do Anima Estudio.
              Trabalho há mais de uma década desenhando marcas, sistemas visuais,
              campanhas, edição de vídeos e motion graphics que carregam intenção, não decoração.
            </p>
            <p>
              Meu processo une pesquisa, direção de arte e execução obsessiva por detalhe.
              Cada projeto começa por perguntas antes de qualquer traço: o que a marca
              precisa comunicar, para quem, e em que contexto ela vai existir.
            </p>
            <p>
              {/* TODO: personalize esta seção com sua história, clientes marcantes e conquistas. */}
              Já colaborei com marcas de diferentes portes, de projetos independentes a
              equipes internas de grandes empresas, sempre defendendo que boas ideias
              merecem execução impecável.
            </p>
          </div>

          <aside className="space-y-10">
            <div>
              <p className="section-label">[ Especialidades ]</p>
              <ul className="mt-4 space-y-2 text-lg font-display">
                {specialties.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="section-label">[ Ferramentas ]</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {tools.map((t) => (
                  <li key={t} className="text-xs font-mono px-3 py-1 rounded-full border border-border">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <div className="mt-24 border-t border-border pt-10">
          <Link
            to="/contato"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Trabalhe comigo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
