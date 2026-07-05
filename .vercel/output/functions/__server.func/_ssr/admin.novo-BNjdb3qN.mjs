import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { x as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as ProjectForm } from "./project-form-BCbufZum.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.novo-BNjdb3qN.js
var import_jsx_runtime = require_jsx_runtime();
function NovoProjeto() {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1400px] px-6 md:px-10 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin",
					className: "section-label inline-flex items-center gap-2 hover:text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3 w-3" }), " Voltar"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-5xl mt-4 mb-10",
					children: "Novo projeto"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectForm, {
					initial: {},
					onSaved: (p) => navigate({
						to: "/admin/$id",
						params: { id: p.id }
					})
				})
			]
		})
	});
}
//#endregion
export { NovoProjeto as component };
