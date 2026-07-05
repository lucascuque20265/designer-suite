import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as fetchAdjacentProjects } from "./portfolio-luPp_ivL.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { _ as ChevronRight, b as ArrowRight, n as VolumeX, r as Volume2, v as ChevronLeft, x as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as Route } from "./projeto._slug-eyCBPO-5.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
import { t as useEmblaCarousel } from "../_libs/embla-carousel-react+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projeto._slug-DQMI0Mix.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProjectCarousel({ media }) {
	const [mainRef, mainApi] = useEmblaCarousel({
		loop: true,
		align: "center"
	});
	const [thumbsRef, thumbsApi] = useEmblaCarousel({
		containScroll: "keepSnaps",
		dragFree: true
	});
	const [selected, setSelected] = (0, import_react.useState)(0);
	const [muted, setMuted] = (0, import_react.useState)(true);
	const onSelect = (0, import_react.useCallback)(() => {
		if (!mainApi) return;
		const idx = mainApi.selectedScrollSnap();
		setSelected(idx);
		thumbsApi?.scrollTo(idx);
	}, [mainApi, thumbsApi]);
	(0, import_react.useEffect)(() => {
		if (!mainApi) return;
		onSelect();
		mainApi.on("select", onSelect);
		mainApi.on("reInit", onSelect);
	}, [mainApi, onSelect]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "ArrowLeft") mainApi?.scrollPrev();
			if (e.key === "ArrowRight") mainApi?.scrollNext();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [mainApi]);
	if (!media.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "aspect-[16/10] rounded-lg bg-surface grid place-items-center text-muted-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-sm",
			children: "nenhum slide ainda"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: mainRef,
						className: "overflow-hidden rounded-lg bg-surface",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex",
							children: media.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-[0_0_100%] min-w-0 relative",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "aspect-[16/10] md:aspect-[16/9] bg-black flex items-center justify-center",
									children: m.type === "image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: m.url,
										alt: `Slide ${i + 1}`,
										loading: i === 0 ? "eager" : "lazy",
										className: "h-full w-full object-contain"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
										src: m.url,
										autoPlay: i === selected,
										loop: true,
										muted,
										playsInline: true,
										controls: false,
										preload: "metadata",
										className: "h-full w-full object-contain"
									})
								})
							}, m.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Anterior",
						onClick: () => mainApi?.scrollPrev(),
						className: "absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center rounded-full bg-background/70 backdrop-blur-md border border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Próximo",
						onClick: () => mainApi?.scrollNext(),
						className: "absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center rounded-full bg-background/70 backdrop-blur-md border border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute top-4 right-4 flex items-center gap-2",
						children: [media[selected]?.type === "video" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": muted ? "Ativar som" : "Silenciar",
							onClick: () => setMuted((v) => !v),
							className: "h-10 w-10 grid place-items-center rounded-full bg-background/70 backdrop-blur-md border border-border/60 hover:bg-primary hover:text-primary-foreground transition-colors",
							children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-mono text-xs px-3 h-10 grid place-items-center rounded-full bg-background/70 backdrop-blur-md border border-border/60",
							children: [
								String(selected + 1).padStart(2, "0"),
								" / ",
								String(media.length).padStart(2, "0")
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2 justify-center",
				children: media.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": `Ir para slide ${i + 1}`,
					onClick: () => mainApi?.scrollTo(i),
					className: cn("h-1.5 rounded-full transition-all", i === selected ? "w-8 bg-primary" : "w-1.5 bg-border")
				}, i))
			}),
			media.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: thumbsRef,
				className: "overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: media.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => mainApi?.scrollTo(i),
						className: cn("flex-[0_0_88px] h-16 rounded-md overflow-hidden bg-surface border-2 transition-colors", i === selected ? "border-primary" : "border-transparent"),
						children: m.type === "image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: m.url,
							alt: "",
							loading: "lazy",
							className: "h-full w-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							src: m.url,
							muted: true,
							playsInline: true,
							className: "h-full w-full object-cover"
						})
					}, m.id))
				})
			})
		]
	});
}
function ProjetoDetalhe() {
	const project = Route.useLoaderData();
	const { slug } = Route.useParams();
	const { data: adj } = useQuery({
		queryKey: ["adjacent", slug],
		queryFn: () => fetchAdjacentProjects(slug)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-6 md:px-10 py-16 md:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1400px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/trabalhos",
					className: "section-label inline-flex items-center gap-2 hover:text-primary transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3 w-3" }), " Todos os trabalhos"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 16
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { duration: .6 },
					className: "mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "section-label",
						children: [
							"[ ",
							project.category?.name ?? "Projeto",
							" · ",
							project.year ?? "—",
							" ]"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-6xl md:text-8xl mt-4 leading-[0.95]",
						children: project.title
					})] }), project.client && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "section-label",
							children: "[ Cliente ]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl mt-2",
							children: project.client
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 md:mt-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectCarousel, { media: project.media })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-16 grid gap-12 md:grid-cols-[2fr_1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "section-label",
						children: "[ Sobre o projeto ]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap",
						children: project.description || "Sem descrição fornecida."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-6",
						children: project.tools.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "section-label",
							children: "[ Ferramentas ]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 flex flex-wrap gap-2",
							children: project.tools.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-xs font-mono px-3 py-1 rounded-full border border-border",
								children: t
							}, t))
						})] })
					})]
				}),
				(adj?.prev || adj?.next) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-24 border-t border-border pt-8 flex justify-between gap-6",
					children: [adj?.prev ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/projeto/$slug",
						params: { slug: adj.prev.slug },
						className: "group max-w-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "section-label group-hover:text-primary transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "inline h-3 w-3 mr-1" }), " Anterior"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl mt-2 group-hover:text-primary transition-colors",
							children: adj.prev.title
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}), adj?.next && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/projeto/$slug",
						params: { slug: adj.next.slug },
						className: "group max-w-xs text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "section-label group-hover:text-primary transition-colors",
							children: ["Próximo ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "inline h-3 w-3 ml-1" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl mt-2 group-hover:text-primary transition-colors",
							children: adj.next.title
						})]
					})]
				})
			]
		})
	});
}
//#endregion
export { ProjetoDetalhe as component };
