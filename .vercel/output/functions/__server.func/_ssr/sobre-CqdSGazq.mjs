import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { b as ArrowRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sobre-CqdSGazq.js
var import_jsx_runtime = require_jsx_runtime();
var specialties = [
	"Identidade visual e branding",
	"Direção de arte",
	"Design editorial",
	"Design para campanhas",
	"Design de embalagens",
	"Design digital e social"
];
var tools = [
	"Adobe Illustrator",
	"Adobe Photoshop",
	"Adobe InDesign",
	"Adobe After Effects",
	"Figma",
	"Cinema 4D"
];
function Sobre() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-6 md:px-10 py-24 md:py-32",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1400px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-label",
					children: "[ 02 / Sobre ]"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-display text-6xl md:text-8xl mt-4 leading-[0.95]",
					children: [
						"Design como ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: "ofício"
						}),
						",",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"não como fórmula."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-16 grid gap-16 md:grid-cols-[3fr_2fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 text-lg leading-relaxed text-foreground/90",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Sou Lucas Miranda, designer gráfico sênior à frente do Anima Estudio. Trabalho há mais de uma década desenhando marcas, sistemas visuais e peças editoriais que carregam intenção — não decoração." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Meu processo une pesquisa, direção de arte e execução obsessiva por detalhe. Cada projeto começa por perguntas antes de qualquer traço: o que a marca precisa comunicar, para quem, e em que contexto ela vai existir." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Já colaborei com marcas de diferentes portes — de projetos independentes a equipes internas de grandes empresas —, sempre defendendo que boas ideias merecem execução impecável." })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "space-y-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "section-label",
							children: "[ Especialidades ]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-2 text-lg font-display",
							children: specialties.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: s }, s))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "section-label",
							children: "[ Ferramentas ]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 flex flex-wrap gap-2",
							children: tools.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-xs font-mono px-3 py-1 rounded-full border border-border",
								children: t
							}, t))
						})] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-24 border-t border-border pt-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/contato",
						className: "inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors",
						children: ["Trabalhe comigo ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})
				})
			]
		})
	});
}
//#endregion
export { Sobre as component };
