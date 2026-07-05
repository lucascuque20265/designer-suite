import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { Project } from "@/lib/portfolio";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useRef, useState } from "react";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cover = project.cover_url;
  const medias = project.media ?? [];
  const isVideo = cover?.match(/\.(mp4|webm|mov)(\?|$)/i);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, draggable: false, containScroll: "keepSnaps" });

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [previewPlaying, setPreviewPlaying] = useState(false);

  const handlePreviewToggle = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    const idx = emblaApi?.selectedScrollSnap?.() ?? 0;
    const m = medias[idx] ?? medias[0];
    let v: HTMLVideoElement | null | undefined;
    if (m) {
      v = videoRefs.current[m.id];
    } else if (cover && isVideo) {
      v = videoRefs.current[cover as any];
    }
    if (!v) return;
    if (!v) return;
    if (v.paused) {
      try { v.muted = false; } catch (err) {}
      v.play().catch(() => {});
      setPreviewPlaying(true);
    } else {
      v.pause();
      setPreviewPlaying(false);
    }
  };

  useEffect(() => {
    if (!emblaApi || medias.length <= 1 || previewPlaying) return;
    const id = window.setInterval(() => {
      try {
        emblaApi.scrollNext();
      } catch (e) {
        // ignore
      }
    }, 2800);
    return () => window.clearInterval(id);
  }, [emblaApi, medias.length, previewPlaying]);

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
          {/* CTA overlay: instrução para abrir detalhes */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
            <div className="transition-opacity duration-300 opacity-100 group-hover:opacity-0">
              <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-full font-mono text-sm shadow-lg cta-pulse">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 2v20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 9l7-7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Clique para abrir
              </span>
            </div>
          </div>
                {medias.length > 1 ? (
            <div ref={emblaRef} className="absolute inset-0 overflow-hidden">
              <div className="flex h-full">
                {medias.map((m) => (
                  <div key={m.id} className="min-w-full h-full relative">
                    {m.type === "video" ? (
                      <video
                        ref={(el) => (videoRefs.current[m.id] = el)}
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
                  ref={(el) => { if (cover) videoRefs.current[cover] = el; }}
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

          {/* Play preview overlay (tap to play) */}
          {(medias.concat(cover ? [{ id: 'cover', type: isVideo ? 'video' : 'image', url: cover } as any] : []))
            .some((m) => m && m.type === 'video') && (
            <button
              type="button"
              onClick={handlePreviewToggle}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full bg-black/60 text-white grid place-items-center hover:scale-105 transition-transform pointer-events-auto"
              aria-label="Play preview"
            >
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 1.5L16 10L2 18.5V1.5Z" fill="currentColor" />
              </svg>
            </button>
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
