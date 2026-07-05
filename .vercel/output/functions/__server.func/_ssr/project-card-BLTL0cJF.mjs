import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/project-card-BLTL0cJF.js
var import_jsx_runtime = require_jsx_runtime();
function ProjectCard({ project, index }) {
	const cover = project.cover_url;
	const isVideo = cover?.match(/\.(mp4|webm|mov)(\?|$)/i);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		initial: {
			opacity: 0,
			y: 24
		},
		whileInView: {
			opacity: 1,
			y: 0
		},
		viewport: {
			once: true,
			margin: "-80px"
		},
		transition: {
			duration: .6,
			ease: [
				.16,
				1,
				.3,
				1
			],
			delay: index * .05
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/projeto/$slug",
			params: { slug: project.slug },
			className: "group block",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-[4/5] overflow-hidden rounded-lg bg-surface",
					children: [
						cover ? isVideo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							src: cover,
							muted: true,
							loop: true,
							playsInline: true,
							autoPlay: true,
							preload: "metadata",
							className: "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: cover,
							alt: project.title,
							loading: "lazy",
							className: "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 grid place-items-center text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs",
								children: "sem capa"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute bottom-0 left-0 right-0 p-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-[10px] text-primary tracking-wider uppercase",
								children: [
									project.category?.name ?? "Projeto",
									" · ",
									project.year ?? ""
								]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-baseline justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-2xl md:text-3xl leading-tight group-hover:text-primary transition-colors",
						children: project.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs text-muted-foreground shrink-0",
						children: String(index + 1).padStart(2, "0")
					})]
				}),
				project.client && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: project.client
				})
			]
		})
	});
}
//#endregion
export { ProjectCard as t };
