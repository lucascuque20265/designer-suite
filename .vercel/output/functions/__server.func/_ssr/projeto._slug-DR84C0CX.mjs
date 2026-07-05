import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projeto._slug-DR84C0CX.js
var import_jsx_runtime = require_jsx_runtime();
var SplitErrorComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "min-h-screen grid place-items-center px-6",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "section-label",
				children: "[ Erro ]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-5xl mt-4",
				children: "Não conseguimos abrir o projeto"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/trabalhos",
				className: "text-primary mt-6 inline-block",
				children: "Ver todos os projetos"
			})
		]
	})
});
//#endregion
export { SplitErrorComponent as errorComponent };
