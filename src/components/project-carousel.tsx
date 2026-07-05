import { useCallback, useEffect, useState, useRef } from "react";
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
  const [volume, setVolume] = useState(1);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [playing, setPlaying] = useState<Record<string, boolean>>({});
  const [isHovering, setIsHovering] = useState(false);
  const [thumbsHover, setThumbsHover] = useState(false);
  const [aspects, setAspects] = useState<Record<string, string>>({});
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [progress, setProgress] = useState<Record<string, number>>({});
  const autoplayRef = useRef<number | null>(null);
  const AUTOPLAY_MS = 4500;
  const THUMBS_AUTOPLAY_MS = 3500;

  const onSelect = useCallback(() => {
    if (!mainApi) return;
    const idx = mainApi.selectedScrollSnap();
    setSelected(idx);
    thumbsApi?.scrollTo(idx);

    try {
      const id = media[idx]?.id;
      media.forEach((m) => {
        const v = videoRefs.current[m.id];
        if (!v) return;
        if (m.id === id && m.type === "video") {
          v.muted = muted;
          v.volume = volume;
          v.play().then(() => setPlaying((p) => ({ ...p, [m.id]: true }))).catch(() => {});
        } else {
          v.pause();
          setPlaying((p) => ({ ...p, [m.id]: false }));
        }
      });
    } catch (e) {
      // ignore
    }
  }, [mainApi, thumbsApi, media, muted, volume]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);
  }, [mainApi, onSelect]);

  // autoplay for main slides (images only — pause if hovering or video is playing)
  useEffect(() => {
    if (!mainApi || media.length <= 1) return;
    if (autoplayRef.current) {
      window.clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }

    const currentMedia = media[selected];
    const isCurrentVideoPlaying = currentMedia?.type === "video" && playing[currentMedia.id];
    if (isHovering || isCurrentVideoPlaying) return;

    autoplayRef.current = window.setInterval(() => {
      const cur = media[selected];
      if (cur?.type === "video" && playing[cur.id]) return;
      mainApi.scrollNext();
    }, AUTOPLAY_MS);

    return () => {
      if (autoplayRef.current) {
        window.clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [mainApi, media, selected, isHovering, playing]);

  // autoplay for thumbnails carousel (smooth scrolling)
  useEffect(() => {
    if (!thumbsApi || media.length <= 1) return;
    const id = window.setInterval(() => {
      if (thumbsHover) return;
      try {
        thumbsApi.scrollNext();
      } catch (e) {
        // ignore
      }
    }, THUMBS_AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [thumbsApi, thumbsHover, media.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") mainApi?.scrollPrev();
      if (e.key === "ArrowRight") mainApi?.scrollNext();
      if (e.key === " ") {
        const m = media[selected];
        const v = m && videoRefs.current[m.id];
        if (!v) return;
        if (v.paused) v.play(); else v.pause();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mainApi, media, selected]);

  if (!media.length) {
    return (
      <div className="aspect-[16/10] rounded-lg bg-surface grid place-items-center text-muted-foreground">
        <span className="font-mono text-sm">nenhum slide ainda</span>
      </div>
    );
  }

  const handleSeek = (e: any, id: string) => {
    e.stopPropagation();
    const duration = durations[id] ?? 0;
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width), 1);
    const v = videoRefs.current[id];
    if (v) v.currentTime = pct * duration;
  };

  return (
    <div className="space-y-4">
      <div
        className="relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div ref={mainRef} className="overflow-hidden rounded-lg bg-surface shadow-lg">
          <div className="flex">
            {media.map((m, i) => (
              <div key={m.id} className="flex-[0_0_100%] min-w-0 relative">
                <div className="bg-black relative overflow-hidden" style={{ maxHeight: "75vh" }}>
                  {/* background fill (blurred) */}
                  {m.type === "image" ? (
                    <div
                      aria-hidden
                      style={{ backgroundImage: `url(${m.url})` }}
                      className="absolute inset-0 bg-center bg-cover filter blur-2xl scale-110"
                    />
                  ) : (
                    <video
                      aria-hidden
                      src={m.url}
                      muted
                      autoPlay
                      loop
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover filter blur-2xl scale-110"
                    />
                  )}

                  {/* dark overlay to reduce contrast behind foreground */}
                  <div className="absolute inset-0 bg-black/60" />

                  {/* foreground centered media */}
                  <div className="relative z-10 grid place-items-center h-full">
                    <div style={{ aspectRatio: aspects[m.id] ?? "16/10", maxHeight: "75vh", width: "min(60vw, 980px)" }} className="overflow-hidden">
                      {m.type === "image" ? (
                        <img
                          src={m.url}
                          alt={`Slide ${i + 1}`}
                          loading={i === 0 ? "eager" : "lazy"}
                          onLoad={(e) => {
                            const img = e.currentTarget as HTMLImageElement;
                            if (img.naturalWidth && img.naturalHeight) {
                              setAspects((p) => ({ ...p, [m.id]: `${img.naturalWidth}/${img.naturalHeight}` }));
                            }
                          }}
                          className={cn("h-full w-full object-contain transition-transform duration-700", i === selected ? "scale-105" : "scale-100")}
                        />
                      ) : (
                        <>
                          <video
                            ref={(el) => (videoRefs.current[m.id] = el)}
                            src={m.url}
                            autoPlay={i === selected}
                            loop
                            muted={muted}
                            playsInline
                            controls={false}
                            preload="metadata"
                            onLoadedMetadata={(e) => {
                              const v = e.currentTarget as HTMLVideoElement;
                              if (v.videoWidth && v.videoHeight) {
                                setAspects((p) => ({ ...p, [m.id]: `${v.videoWidth}/${v.videoHeight}` }));
                              }
                              setDurations((p) => ({ ...p, [m.id]: v.duration }));
                              v.volume = volume;
                              v.muted = muted;
                            }}
                            onTimeUpdate={(e) => {
                              const v = e.currentTarget as HTMLVideoElement;
                              setProgress((p) => ({ ...p, [m.id]: v.currentTime }));
                            }}
                            onPlay={() => setPlaying((p) => ({ ...p, [m.id]: true }))}
                            onPause={() => setPlaying((p) => ({ ...p, [m.id]: false }))}
                            className="h-full w-full object-contain"
                          />

                          {/* central play/pause */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const v = videoRefs.current[m.id];
                              if (!v) return;
                              if (v.paused) {
                                v.play().catch(() => {});
                              } else {
                                v.pause();
                              }
                            }}
                            aria-label="Play/Pause"
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-black/50 text-white grid place-items-center hover:scale-105 transition-transform"
                          >
                            {!playing[m.id] ? (
                              <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 1.5L16 10L2 18.5V1.5Z" fill="currentColor" />
                              </svg>
                            ) : (
                              <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0" y="0" width="4" height="16" fill="currentColor" />
                                <rect x="10" y="0" width="4" height="16" fill="currentColor" />
                              </svg>
                            )}
                          </button>

                          {/* controls for selected video */}
                          {i === selected && (
                            <div className="absolute left-4 right-4 bottom-4 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const v = videoRefs.current[m.id];
                                    if (!v) return;
                                    if (v.paused) v.play().catch(() => {});
                                    else v.pause();
                                  }}
                                  className="h-9 w-9 grid place-items-center rounded-full bg-black/40 text-white"
                                >
                                  {!playing[m.id] ? (
                                    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M1 1 L13 8 L1 15 V1 Z" fill="currentColor" />
                                    </svg>
                                  ) : (
                                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <rect x="0" y="0" width="3" height="12" fill="currentColor" />
                                      <rect x="7" y="0" width="3" height="12" fill="currentColor" />
                                    </svg>
                                  )}
                                </button>

                                <div
                                  onClick={(e) => handleSeek(e, m.id)}
                                  className="h-2 w-72 bg-white/20 rounded cursor-pointer overflow-hidden"
                                >
                                  <div
                                    style={{ width: `${((progress[m.id] ?? 0) / (durations[m.id] || 1)) * 100}%` }}
                                    className="h-full bg-primary rounded"
                                  />
                                </div>
                                <div className="text-xs text-white font-mono">
                                  {String(Math.floor((progress[m.id] ?? 0) / 60)).padStart(2, "0")}:{String(Math.floor((progress[m.id] ?? 0) % 60)).padStart(2, "0")}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  aria-label={muted ? "Ativar som" : "Silenciar"}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMuted((v) => {
                                      const next = !v;
                                      const vEl = videoRefs.current[media[selected]?.id];
                                      if (vEl) vEl.muted = next;
                                      return next;
                                    });
                                  }}
                                  className="h-9 w-9 grid place-items-center rounded-full bg-white/10 shadow-md border border-border/40 hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                </button>
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={Math.round((volume ?? 1) * 100)}
                                  onChange={(e) => {
                                    const v = Number(e.target.value) / 100;
                                    setVolume(v);
                                    const vEl = videoRefs.current[media[selected]?.id];
                                    if (vEl) {
                                      vEl.volume = v;
                                      vEl.muted = v === 0;
                                      setMuted(v === 0);
                                    }
                                  }}
                                  className="w-24"
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* bottom gradient + caption */}
                      <div className="absolute left-0 right-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                      <div className="absolute left-4 bottom-4 text-sm text-white flex items-center gap-3">
                        <div className="px-2 py-1 rounded bg-black/40 text-xs uppercase tracking-wider">{m.type}</div>
                        <div className="text-xs font-medium">Slide {i + 1} de {media.length}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="Anterior"
          onClick={() => mainApi?.scrollPrev()}
          className="absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center rounded-full bg-white/10 shadow-md border border-border/40 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Próximo"
          onClick={() => mainApi?.scrollNext()}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center rounded-full bg-white/10 shadow-md border border-border/40 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="font-mono text-xs px-3 h-10 grid place-items-center rounded-full bg-white/10 shadow-md border border-border/40">
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
              "h-2 rounded-full transition-all",
              i === selected ? "w-8 bg-primary shadow-md" : "w-2 bg-border/60 hover:bg-border"
            )}
          />
        ))}
      </div>

      {media.length > 1 && (
        <div
          ref={thumbsRef}
          className="overflow-hidden"
          onMouseEnter={() => setThumbsHover(true)}
          onMouseLeave={() => setThumbsHover(false)}
        >
          <div className="flex gap-3 px-1">
            {media.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onClick={() => mainApi?.scrollTo(i)}
                className={cn(
                  "w-20 h-14 rounded-md overflow-hidden bg-surface border-2 transition-transform transform hover:scale-105 relative",
                  i === selected ? "ring-2 ring-primary shadow-lg" : "border-transparent"
                )}
              >
                {m.type === "image" ? (
                  <img src={m.url} alt="" loading="lazy" className="h-full w-full object-cover auto-zoom" />
                ) : (
                  <>
                    <video src={m.url} muted playsInline autoPlay loop className="h-full w-full object-cover" />
                    <div className="absolute right-2 top-2 bg-black/50 rounded px-1 py-0.5 text-xs text-white">Vid</div>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
