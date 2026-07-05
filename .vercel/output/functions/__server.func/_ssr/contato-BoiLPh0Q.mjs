import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { g as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { d as Mail, l as MessageCircle, m as Instagram, p as Linkedin } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as SITE } from "./site-IINvMPcA.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contato-BoiLPh0Q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	name: stringType().trim().min(2, "Nome muito curto").max(100),
	email: stringType().trim().email("E-mail inválido").max(255),
	message: stringType().trim().min(10, "Descreva um pouco mais").max(1500)
});
function Contato() {
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	function onSubmit(e) {
		e.preventDefault();
		const result = schema.safeParse({
			name,
			email,
			message
		});
		if (!result.success) {
			toast.error(result.error.issues[0]?.message ?? "Verifique os campos");
			return;
		}
		const text = `Olá Lucas! Sou ${result.data.name} (${result.data.email}).\n\n${result.data.message}`;
		const url = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
		window.open(url, "_blank", "noopener");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-6 md:px-10 py-24 md:py-32",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1400px] grid gap-16 md:grid-cols-[3fr_2fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-label",
					children: "[ 03 / Contato ]"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-display text-6xl md:text-8xl mt-4 leading-[0.95]",
					children: [
						"Vamos criar",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"algo ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: "memorável"
						}),
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-lg text-muted-foreground max-w-xl",
					children: "Envie uma mensagem contando sobre o projeto — respondo em até 1 dia útil."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "mt-10 space-y-5 max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "name",
							children: "Nome"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "name",
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "mt-2",
							required: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "email",
							children: "E-mail"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "mt-2",
							required: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "message",
							children: "Sobre o projeto"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "message",
							rows: 6,
							value: message,
							onChange: (e) => setMessage(e.target.value),
							className: "mt-2",
							required: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "lg",
							children: "Enviar via WhatsApp"
						})
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "md:pt-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-label",
					children: "[ Canais diretos ]"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `mailto:${SITE.email}`,
							className: "flex items-center gap-3 text-lg hover:text-primary transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" }),
								" ",
								SITE.email
							]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: SITE.whatsappUrl,
							target: "_blank",
							rel: "noreferrer",
							className: "flex items-center gap-3 text-lg hover:text-primary transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), " WhatsApp"]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: SITE.instagramUrl,
							target: "_blank",
							rel: "noreferrer",
							className: "flex items-center gap-3 text-lg hover:text-primary transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-4 w-4" }), " @animaestudio"]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: SITE.linkedinUrl,
							target: "_blank",
							rel: "noreferrer",
							className: "flex items-center gap-3 text-lg hover:text-primary transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linkedin, { className: "h-4 w-4" }), " LinkedIn"]
						}) })
					]
				})]
			})]
		})
	});
}
//#endregion
export { Contato as component };
