import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DyGLHKzc.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { A as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Route$10 } from "./admin._id-BfgUx9DU.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { l as MessageCircle, t as X, u as Menu } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as SITE } from "./site-IINvMPcA.mjs";
import { t as Route$11 } from "./projeto._slug-eyCBPO-5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-2KhF6zNU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BPS9NWwd.css";
function reportError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__errorEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var links = [
	{
		to: "/",
		label: "Início"
	},
	{
		to: "/trabalhos",
		label: "Trabalhos"
	},
	{
		to: "/sobre",
		label: "Sobre"
	},
	{
		to: "/contato",
		label: "Contato"
	}
];
function SiteHeader() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	(0, import_react.useEffect)(() => {
		setOpen(false);
	}, [pathname]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: `fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md border-b border-border/60" : "bg-transparent"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1400px] px-6 md:px-10 h-16 flex items-center justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "font-display text-2xl leading-none",
					children: ["Lucas Miranda", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary",
						children: "."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden md:flex items-center gap-8",
					children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: l.to,
						className: "text-sm text-muted-foreground hover:text-foreground transition-colors relative",
						activeProps: { className: "text-foreground" },
						activeOptions: { exact: l.to === "/" },
						children: l.label
					}, l.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Abrir menu",
					className: "md:hidden text-foreground",
					onClick: () => setOpen((v) => !v),
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-6 w-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-6 w-6" })
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "md:hidden bg-background/95 backdrop-blur-md border-t border-border/60",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex flex-col px-6 py-6 gap-4",
				children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: l.to,
					className: "text-lg text-muted-foreground hover:text-foreground",
					activeProps: { className: "text-foreground" },
					activeOptions: { exact: l.to === "/" },
					children: l.label
				}, l.to))
			})
		})]
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-border/60 mt-32",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1400px] px-6 md:px-10 py-16 grid gap-10 md:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "section-label",
						children: "[ Anima Estudio ]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl mt-3",
						children: "Lucas Miranda"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-2 max-w-xs",
						children: "Construindo identidades e experiências visuais de impacto."
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-label",
					children: "[ Navegação ]"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/trabalhos",
							className: "hover:text-primary transition-colors",
							children: "Trabalhos"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/sobre",
							className: "hover:text-primary transition-colors",
							children: "Sobre"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contato",
							className: "hover:text-primary transition-colors",
							children: "Contato"
						}) })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-label",
					children: "[ Contato ]"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `mailto:${SITE.email}`,
							className: "hover:text-primary transition-colors",
							children: SITE.email
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: SITE.whatsappUrl,
							target: "_blank",
							rel: "noreferrer",
							className: "hover:text-primary transition-colors",
							children: "WhatsApp"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: SITE.instagramUrl,
							target: "_blank",
							rel: "noreferrer",
							className: "hover:text-primary transition-colors",
							children: "Instagram"
						}) })
					]
				})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border/60",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-[1400px] px-6 md:px-10 py-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "© 2020 Lucas Miranda — Anima Estudio. Todos os direitos reservados." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono",
					children: "Feito com muita paixão e café."
				})]
			})
		})]
	});
}
function WhatsAppButton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: SITE.whatsappUrl,
		target: "_blank",
		rel: "noreferrer",
		"aria-label": "Falar no WhatsApp",
		className: "fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-[0_10px_40px_-10px] shadow-primary/60 hover:scale-105 transition-transform",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-6 w-6" })
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-label",
					children: "[ 404 ]"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-7xl mt-4",
					children: "Página perdida"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "A página que você procura não existe ou foi movida."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Voltar para o início"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "section-label",
					children: "[ Erro ]"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl mt-4",
					children: "Algo saiu do trilho"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "Tente recarregar ou voltar para o início."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Tentar de novo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Ir para o início"
					})]
				})
			]
		})
	});
}
var Route$9 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Lucas Miranda" },
			{
				name: "description",
				content: "Portfólio de Lucas Miranda, designer gráfico sênior. Identidade visual, direção de arte e projetos editoriais com pegada moderna e sofisticada."
			},
			{
				name: "author",
				content: "Lucas Miranda"
			},
			{
				property: "og:title",
				content: "Lucas Miranda"
			},
			{
				property: "og:description",
				content: "Vitrine de trabalhos de identidade visual, direção de arte e design editorial."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			},
			{
				rel: "manifest",
				href: "/site.webmanifest"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		className: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$9.useRouteContext();
	const router = useRouter();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => sub.subscription.unsubscribe();
	}, [router, queryClient]);
	const isChrome = !pathname.startsWith("/auth") && !pathname.startsWith("/admin");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [
			isChrome && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: isChrome ? "pt-16" : "",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			isChrome && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			isChrome && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppButton, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
				theme: "dark",
				position: "top-right"
			})
		]
	});
}
var $$splitComponentImporter$7 = () => import("./trabalhos-Ci3Rp8s1.mjs");
var Route$8 = createFileRoute("/trabalhos")({
	head: () => ({
		meta: [
			{ title: "Trabalhos — Lucas Miranda | Anima Estudio" },
			{
				name: "description",
				content: "Portfólio completo de projetos de design gráfico: identidade visual, direção de arte, editorial e mais."
			},
			{
				property: "og:title",
				content: "Trabalhos — Lucas Miranda"
			},
			{
				property: "og:description",
				content: "Grade completa de projetos publicados no portfólio."
			},
			{
				property: "og:url",
				content: "/trabalhos"
			}
		],
		links: [{
			rel: "canonical",
			href: "/trabalhos"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./sobre-CqdSGazq.mjs");
var Route$7 = createFileRoute("/sobre")({
	head: () => ({
		meta: [
			{ title: "Sobre — Lucas Miranda | Anima Estudio" },
			{
				name: "description",
				content: "Trajetória, especialidades e ferramentas de Lucas Miranda, designer gráfico sênior."
			},
			{
				property: "og:title",
				content: "Sobre — Lucas Miranda"
			},
			{
				property: "og:description",
				content: "Designer sênior com trajetória em identidade visual, direção de arte e projetos editoriais."
			},
			{
				property: "og:url",
				content: "/sobre"
			}
		],
		links: [{
			rel: "canonical",
			href: "/sobre"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var BASE_URL = "";
var Route$6 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const entries = [
		{
			path: "/",
			changefreq: "weekly",
			priority: "1.0"
		},
		{
			path: "/trabalhos",
			changefreq: "weekly",
			priority: "0.9"
		},
		{
			path: "/sobre",
			changefreq: "monthly",
			priority: "0.6"
		},
		{
			path: "/contato",
			changefreq: "monthly",
			priority: "0.6"
		}
	];
	try {
		const { data } = await supabase.from("projects").select("slug, updated_at").eq("published", true);
		for (const p of data ?? []) entries.push({
			path: `/projeto/${p.slug}`,
			changefreq: "monthly",
			priority: "0.8"
		});
	} catch {}
	const xml = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...entries.map((e) => [
			`  <url>`,
			`    <loc>${BASE_URL}${e.path}</loc>`,
			e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
			e.priority ? `    <priority>${e.priority}</priority>` : null,
			`  </url>`
		].filter(Boolean).join("\n")),
		`</urlset>`
	].join("\n");
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var $$splitComponentImporter$5 = () => import("./contato-BoiLPh0Q.mjs");
var Route$5 = createFileRoute("/contato")({
	head: () => ({
		meta: [
			{ title: "Contato — Lucas Miranda | Anima Estudio" },
			{
				name: "description",
				content: "Fale com Lucas Miranda para orçamentos, colaborações e projetos de design gráfico."
			},
			{
				property: "og:title",
				content: "Contato — Lucas Miranda"
			},
			{
				property: "og:description",
				content: "Formulário direto, WhatsApp e e-mail para começar seu projeto."
			},
			{
				property: "og:url",
				content: "/contato"
			}
		],
		links: [{
			rel: "canonical",
			href: "/contato"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./auth-CXhd4Zih.mjs");
var Route$4 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Acesso — Painel" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./route-Di7iQBCH.mjs");
var Route$3 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./routes-CgwS8Tik.mjs");
var Route$2 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin.index-DsnbZanN.mjs");
var Route$1 = createFileRoute("/_authenticated/admin/")({
	head: () => ({ meta: [{ title: "Painel — Projetos" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./admin.novo-BNjdb3qN.mjs");
var Route = createFileRoute("/_authenticated/admin/novo")({
	head: () => ({ meta: [{ title: "Novo projeto" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var TrabalhosRoute = Route$8.update({
	id: "/trabalhos",
	path: "/trabalhos",
	getParentRoute: () => Route$9
});
var SobreRoute = Route$7.update({
	id: "/sobre",
	path: "/sobre",
	getParentRoute: () => Route$9
});
var SitemapDotxmlRoute = Route$6.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$9
});
var ContatoRoute = Route$5.update({
	id: "/contato",
	path: "/contato",
	getParentRoute: () => Route$9
});
var AuthRoute = Route$4.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$9
});
var AuthenticatedRouteRoute = Route$3.update({
	id: "/_authenticated",
	getParentRoute: () => Route$9
});
var IndexRoute = Route$2.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$9
});
var ProjetoSlugRoute = Route$11.update({
	id: "/projeto/$slug",
	path: "/projeto/$slug",
	getParentRoute: () => Route$9
});
var AuthenticatedAdminIndexRoute = Route$1.update({
	id: "/admin/",
	path: "/admin/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminNovoRoute = Route.update({
	id: "/admin/novo",
	path: "/admin/novo",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAdminIdRoute: Route$10.update({
		id: "/admin/$id",
		path: "/admin/$id",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedAdminNovoRoute,
	AuthenticatedAdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	ContatoRoute,
	SitemapDotxmlRoute,
	SobreRoute,
	TrabalhosRoute,
	ProjetoSlugRoute
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
