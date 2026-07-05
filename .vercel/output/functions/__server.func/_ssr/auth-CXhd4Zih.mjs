import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DyGLHKzc.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-CXhd4Zih.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setLoading(true);
		try {
			if (mode === "signin") {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
				toast.success("Bem-vindo de volta!");
				navigate({ to: "/admin" });
			} else {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: { emailRedirectTo: `${window.location.origin}/admin` }
				});
				if (error) throw error;
				toast.success("Conta criada. Se pedir confirmação por e-mail, verifique sua caixa.");
				navigate({ to: "/admin" });
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Erro desconhecido";
			toast.error(msg);
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen grid place-items-center px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "section-label hover:text-primary transition-colors",
					children: "← Voltar ao site"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-label mt-8",
					children: "[ Área restrita ]"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-5xl mt-3",
					children: mode === "signin" ? "Entrar no painel" : "Criar conta"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "O primeiro usuário cadastrado assume o papel de administrador."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "mt-10 space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "email",
							children: "E-mail"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							required: true,
							autoComplete: "email",
							className: "mt-2"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "password",
							children: "Senha"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "password",
							type: "password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							required: true,
							minLength: 6,
							autoComplete: mode === "signin" ? "current-password" : "new-password",
							className: "mt-2"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "lg",
							disabled: loading,
							className: "w-full",
							children: loading ? "..." : mode === "signin" ? "Entrar" : "Criar conta"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode(mode === "signin" ? "signup" : "signin"),
					className: "mt-6 text-sm text-muted-foreground hover:text-foreground",
					children: mode === "signin" ? "Ainda não tem conta? Cadastre-se" : "Já tem conta? Entrar"
				})
			]
		})
	});
}
//#endregion
export { AuthPage as component };
