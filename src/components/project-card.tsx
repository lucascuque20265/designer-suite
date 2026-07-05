import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { Project } from "@/lib/portfolio";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cover = project.cover_url;
  const medias = project.media ?? [];
  const isVideo = cover?.match(/\.(mp4|webm|mov)(\?|$)/i);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, draggable: false, containScroll: "keepSnaps" });

  useEffect(() => {
    if (!emblaApi || medias.length <= 1) return;
    const id = window.setInterval(() => {
      try {
        emblaApi.scrollNext();
      } catch (e) {
        // ignore
      }
    }, 2800);
    return () => window.clearInterval(id);
  }, [emblaApi, medias.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
    >
      <Link
        to="/projeto/$slug"
        params={{ slug: project.slug }}
        className="group block"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface">
          {medias.length > 1 ? (
            <div ref={emblaRef} className="absolute inset-0 overflow-hidden">
              <div className="flex h-full">
                {medias.map((m) => (
                  <div key={m.id} className="min-w-full h-full relative">
                    {m.type === "video" ? (
                      <video
                        src={m.url}
                        muted
                        loop
                        playsInline
                        autoPlay
                        preload="metadata"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={m.url}
                        alt={project.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover auto-zoom"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            cover ? (
              isVideo ? (
                <video
                  src={cover}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <img
                  src={cover}
                  alt={project.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 auto-zoom"
                />
              )
            ) : (
              <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                <span className="font-mono text-xs">sem capa</span>
              </div>
            )
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="font-mono text-[10px] text-primary tracking-wider uppercase">
              {project.category?.name ?? "Projeto"} · {project.year ?? ""}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl md:text-3xl leading-tight group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <span className="font-mono text-xs text-muted-foreground shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        {project.client && (
          <p className="mt-1 text-sm text-muted-foreground">{project.client}</p>
        )}
      </Link>
    </motion.div>
  );
}
