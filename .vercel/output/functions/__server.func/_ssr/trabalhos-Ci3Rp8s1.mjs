import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { g as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as fetchPublishedProjects, n as fetchCategories } from "./portfolio-luPp_ivL.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as ProjectCard } from "./project-card-BLTL0cJF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trabalhos-Ci3Rp8s1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Trabalhos() {
	const { data: projects } = useQuery({
		queryKey: ["projects"],
		queryFn: fetchPublishedProjects
	});
	const { data: categories } = useQuery({
		queryKey: ["categories"],
		queryFn: fetchCategories
	});
	const [filter, setFilter] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => (filter ? projects?.filter((p) => p.category_id === filter) : projects) ?? [], [projects, filter]);
	const activeCategories = (0, import_react.useMemo)(() => {
		if (!categories || !projects) return [];
		const used = new Set(projects.map((p) => p.category_id).filter(Boolean));
		return categories.filter((c) => used.has(c.id));
	}, [categories, projects]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-6 md:px-10 py-24 md:py-32",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1400px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-label",
					children: "[ 01 / Trabalhos ]"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-6xl md:text-8xl mt-4",
					children: "Portfólio"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-lg text-muted-foreground max-w-2xl",
					children: "Uma seleção de projetos publicados. Filtre por categoria para navegar mais rápido."
				}),
				activeCategories.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setFilter(null),
						className: cn("px-4 py-2 rounded-full text-sm border transition-colors", filter === null ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"),
						children: "Todos"
					}), activeCategories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setFilter(c.id),
						className: cn("px-4 py-2 rounded-full text-sm border transition-colors", filter === c.id ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"),
						children: c.name
					}, c.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3",
					children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-span-full border border-dashed border-border rounded-lg p-16 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground",
							children: [
								"Nenhum projeto ",
								filter ? "nessa categoria" : "publicado ainda",
								"."
							]
						})
					}) : filtered.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectCard, {
						project: p,
						index: i
					}, p.id))
				})
			]
		})
	});
}
//#endregion
export { Trabalhos as component };
