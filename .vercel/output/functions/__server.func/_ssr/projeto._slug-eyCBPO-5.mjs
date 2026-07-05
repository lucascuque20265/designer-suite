import { N as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as fetchProjectBySlug } from "./portfolio-luPp_ivL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projeto._slug-eyCBPO-5.js
var $$splitNotFoundComponentImporter = () => import("./projeto._slug-9TjZH_TZ.mjs");
var $$splitErrorComponentImporter = () => import("./projeto._slug-DR84C0CX.mjs");
var $$splitComponentImporter = () => import("./projeto._slug-DQMI0Mix.mjs");
var Route = createFileRoute("/projeto/$slug")({
	loader: async ({ params }) => {
		const project = await fetchProjectBySlug(params.slug);
		if (!project) throw notFound();
		return project;
	},
	head: ({ loaderData, params }) => {
		if (!loaderData) return { meta: [{ title: "Projeto — Lucas Miranda" }, {
			name: "robots",
			content: "noindex"
		}] };
		const title = `${loaderData.title} — Lucas Miranda`;
		const desc = loaderData.description?.slice(0, 155) ?? `Projeto de design gráfico: ${loaderData.title}.`;
		const image = loaderData.cover_url ?? void 0;
		return {
			meta: [
				{ title },
				{
					name: "description",
					content: desc
				},
				{
					property: "og:title",
					content: title
				},
				{
					property: "og:description",
					content: desc
				},
				{
					property: "og:type",
					content: "article"
				},
				{
					property: "og:url",
					content: `/projeto/${params.slug}`
				},
				...image ? [{
					property: "og:image",
					content: image
				}, {
					name: "twitter:image",
					content: image
				}] : []
			],
			links: [{
				rel: "canonical",
				href: `/projeto/${params.slug}`
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
//#endregion
export { Route as t };
