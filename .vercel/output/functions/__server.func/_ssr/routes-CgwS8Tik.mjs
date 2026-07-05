import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as fetchFeaturedProjects } from "./portfolio-luPp_ivL.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { b as ArrowRight, y as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { t as SITE } from "./site-IINvMPcA.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
import { t as ProjectCard } from "./project-card-BLTL0cJF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CgwS8Tik.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { data: featured } = useQuery({
		queryKey: ["featured-projects"],
		queryFn: () => fetchFeaturedProjects(6)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative min-h-[calc(100vh-4rem)] flex items-center px-6 md:px-10 overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 opacity-[0.05] pointer-events-none",
					style: { backgroundImage: "radial-gradient(circle at 20% 30%, var(--primary) 0%, transparent 50%), radial-gradient(circle at 80% 70%, var(--primary) 0%, transparent 50%)" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-[1400px] w-full relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
							initial: {
								opacity: 0,
								y: 12
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { duration: .6 },
							className: "section-label"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.h1, {
							initial: {
								opacity: 0,
								y: 24
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .9,
								ease: [
									.16,
									1,
									.3,
									1
								],
								delay: .1
							},
							className: "font-display text-[15vw] md:text-[10rem] leading-[0.9] mt-6 tracking-tight",
							children: [
								"Lucas",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Miranda",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary",
									children: "."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.p, {
							initial: {
								opacity: 0,
								y: 12
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .6,
								delay: .35
							},
							className: "mt-8 max-w-xl text-lg md:text-xl text-muted-foreground",
							children: [SITE.tagline, " Mais de uma década desenhando marcas, campanhas e narrativas visuais que ficam."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: 12
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .6,
								delay: .5
							},
							className: "mt-10 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/trabalhos",
								className: "group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors",
								children: ["Ver trabalhos", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 group-hover:translate-x-1 transition-transform" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/contato",
								className: "inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-primary hover:text-primary transition-colors",
								children: ["Falar comigo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute bottom-6 left-6 md:left-10 font-mono text-[10px] text-muted-foreground uppercase tracking-widest",
					children: "Role para explorar ↓"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "px-6 md:px-10 py-24 md:py-32",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-[1400px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between mb-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "section-label" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-5xl md:text-7xl mt-4",
						children: "Trabalho selecionado"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/trabalhos",
						className: "hidden md:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors",
						children: ["Ver todos ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})]
				}), !featured?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border border-dashed border-border rounded-lg p-16 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: "Ainda não há projetos em destaque publicados. Marque projetos como \"destaque\" no painel para vê-los aqui."
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-10 md:grid-cols-2 lg:grid-cols-3",
					children: featured.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectCard, {
						project: p,
						index: i
					}, p.id))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "px-6 md:px-10 py-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-[1400px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border pt-16 grid gap-10 md:grid-cols-[1fr_auto] items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "section-label" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-5xl md:text-7xl mt-4 leading-[0.95]",
						children: [
							"Tem um projeto que pede",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "olhar de sênior"
							}),
							"?"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/contato",
						className: "inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors self-start md:self-end shrink-0",
						children: ["Vamos conversar ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})]
				})
			})
		})
	] });
}
//#endregion
export { Home as component };
