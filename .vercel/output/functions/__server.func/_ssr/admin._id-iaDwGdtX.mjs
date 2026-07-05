import { t as supabase } from "./client-DyGLHKzc.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Route } from "./admin._id-BfgUx9DU.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { x as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as ProjectForm } from "./project-form-BCbufZum.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin._id-iaDwGdtX.js
var import_jsx_runtime = require_jsx_runtime();
function EditarProjeto() {
	const { id } = Route.useParams();
	const { data, isLoading, refetch } = useQuery({
		queryKey: ["admin-project", id],
		queryFn: async () => {
			const { data, error } = await supabase.from("projects").select("*, category:categories(*), media(*)").eq("id", id).single();
			if (error) throw error;
			const p = data;
			p.media = (p.media ?? []).sort((a, b) => a.position - b.position);
			return p;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1400px] px-6 md:px-10 py-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin",
				className: "section-label inline-flex items-center gap-2 hover:text-primary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3 w-3" }), " Voltar"]
			}), isLoading || !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-muted-foreground",
				children: "Carregando..."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display text-5xl mt-4 mb-10",
				children: ["Editar: ", data.title]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectForm, {
				projectId: data.id,
				initialMedia: data.media,
				initial: {
					title: data.title,
					client: data.client ?? "",
					category_id: data.category_id,
					year: data.year ? String(data.year) : "",
					tools: data.tools.join(", "),
					description: data.description ?? "",
					featured: data.featured,
					published: data.published
				},
				onSaved: () => refetch()
			})] })]
		})
	});
}
//#endregion
export { EditarProjeto as component };
