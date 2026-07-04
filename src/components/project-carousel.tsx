import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import type { Media } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

export function ProjectCarousel({ media }: { media: Media[] }) {
  const [mainRef, mainApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [thumbsRef, thumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });
  const [selected, setSelected] = useState(0);
  const [muted, setMuted] = useState(true);

  const onSelect = useCallback(() => {
    if (!mainApi) return;
    const idx = mainApi.selectedScrollSnap();
    setSelected(idx);
    thumbsApi?.scrollTo(idx);
  }, [mainApi, thumbsApi]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);
  }, [mainApi, onSelect]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") mainApi?.scrollPrev();
      if (e.key === "ArrowRight") mainApi?.scrollNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mainApi]);

  if (!media.length) {
    return (
      <div className="aspect-[16/10] rounded-lg bg-surface grid place-items-center text-muted-foreground">
        <span className="font-mono text-sm">nenhum slide ainda</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div ref={mainRef} className="overflow-hidden rounded-lg bg-surface">
          <div className="flex">
            {media.map((m, i) => (
              <div key={m.id} className="flex-[0_0_100%] min-w-0 relative">
                <div className="aspect-[16/10] md:aspect-[16/9] bg-black flex items-center justify-center">
                  {m.type === "image" ? (
                    <img
                      src={m.url}
                      alt={`Slide ${i + 1}`}
                      loading={i === 0 ? "eager" : "lazy"}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <video
                      src={m.url}
                      autoPlay={i === selected}
                      loop
                      muted={muted}
                      playsInline
                      controls={false}
                      preload="metadata"
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="Anterior"
          onClick={() => mainApi?.scrollPrev()}
          className="absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center rounded-full bg-background/70 backdrop-blur-md border border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Próximo"
          onClick={() => mainApi?.scrollNext()}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center rounded-full bg-background/70 backdrop-blur-md border border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute top-4 right-4 flex items-center gap-2">
          {media[selected]?.type === "video" && (
            <button
              type="button"
              aria-label={muted ? "Ativar som" : "Silenciar"}
              onClick={() => setMuted((v) => !v)}
              className="h-10 w-10 grid place-items-center rounded-full bg-background/70 backdrop-blur-md border border-border/60 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          )}
          <div className="font-mono text-xs px-3 h-10 grid place-items-center rounded-full bg-background/70 backdrop-blur-md border border-border/60">
            {String(selected + 1).padStart(2, "0")} / {String(media.length).padStart(2, "0")}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-center">
        {media.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir para slide ${i + 1}`}
            onClick={() => mainApi?.scrollTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === selected ? "w-8 bg-primary" : "w-1.5 bg-border"
            )}
          />
        ))}
      </div>

      {media.length > 1 && (
        <div ref={thumbsRef} className="overflow-hidden">
          <div className="flex gap-2">
            {media.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onClick={() => mainApi?.scrollTo(i)}
                className={cn(
                  "flex-[0_0_88px] h-16 rounded-md overflow-hidden bg-surface border-2 transition-colors",
                  i === selected ? "border-primary" : "border-transparent"
                )}
              >
                {m.type === "image" ? (
                  <img src={m.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <video src={m.url} muted playsInline className="h-full w-full object-cover" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
