import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DyGLHKzc.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { g as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as closestCenter, h as CSS, i as PointerSensor, m as useSensors, p as useSensor, r as KeyboardSensor, t as DndContext } from "../_libs/@dnd-kit/core+[...].mjs";
import { n as fetchCategories, o as slugify } from "./portfolio-luPp_ivL.mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { n as Label, t as Input } from "./label-B7oQAA24.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { h as GripVertical, i as Upload, o as Star, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as verticalListSortingStrategy, i as useSortable, n as arrayMove, r as sortableKeyboardCoordinates, t as SortableContext } from "../_libs/dnd-kit__sortable.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/project-form-BCbufZum.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProjectForm({ initial, projectId, initialMedia = [], initialCoverMediaId = null, onSaved }) {
	const qc = useQueryClient();
	const [values, setValues] = (0, import_react.useState)({
		title: initial.title ?? "",
		client: initial.client ?? "",
		category_id: initial.category_id ?? null,
		newCategory: "",
		year: initial.year ?? String((/* @__PURE__ */ new Date()).getFullYear()),
		tools: initial.tools ?? "",
		description: initial.description ?? "",
		featured: initial.featured ?? false,
		published: initial.published ?? true
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [media, setMedia] = (0, import_react.useState)(initialMedia);
	const [coverMediaId, setCoverMediaId] = (0, import_react.useState)(initialCoverMediaId ?? initialMedia.find((m) => m.is_cover)?.id ?? initialMedia[0]?.id ?? null);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const { data: categories } = useQuery({
		queryKey: ["categories"],
		queryFn: fetchCategories
	});
	function setField(key, v) {
		setValues((prev) => ({
			...prev,
			[key]: v
		}));
	}
	async function ensureCategory() {
		if (values.newCategory.trim()) {
			const name = values.newCategory.trim();
			const slug = slugify(name);
			const { data, error } = await supabase.from("categories").upsert({
				name,
				slug
			}, { onConflict: "slug" }).select().single();
			if (error) throw error;
			qc.invalidateQueries({ queryKey: ["categories"] });
			return data.id;
		}
		return values.category_id;
	}
	async function handleUpload(files) {
		if (!files?.length || !projectId) return;
		setUploading(true);
		try {
			const startPos = media.length;
			const uploaded = [];
			for (const [i, file] of Array.from(files).entries()) {
				const ext = file.name.split(".").pop() ?? "bin";
				const path = `${projectId}/${crypto.randomUUID()}.${ext}`;
				const { error: upErr } = await supabase.storage.from("portfolio-media").upload(path, file, {
					contentType: file.type,
					upsert: false
				});
				if (upErr) throw upErr;
				const { data: pub } = supabase.storage.from("portfolio-media").getPublicUrl(path);
				const type = file.type.startsWith("video") ? "video" : "image";
				const { data: mediaRow, error: mErr } = await supabase.from("media").insert({
					project_id: projectId,
					type,
					url: pub.publicUrl,
					storage_path: path,
					position: startPos + i
				}).select().single();
				if (mErr) throw mErr;
				uploaded.push(mediaRow);
			}
			setMedia((prev) => [...prev, ...uploaded]);
			if (!coverMediaId && uploaded[0]) setCoverMediaId(uploaded[0].id);
			toast.success(`${uploaded.length} arquivo(s) enviado(s).`);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erro ao enviar");
		} finally {
			setUploading(false);
		}
	}
	async function removeMedia(m) {
		if (!confirm("Remover este slide?")) return;
		if (m.storage_path) await supabase.storage.from("portfolio-media").remove([m.storage_path]);
		await supabase.from("media").delete().eq("id", m.id);
		setMedia((prev) => prev.filter((x) => x.id !== m.id));
		if (coverMediaId === m.id) setCoverMediaId(null);
	}
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
	async function onDragEnd(e) {
		const { active, over } = e;
		if (!over || active.id === over.id) return;
		const oldIndex = media.findIndex((m) => m.id === active.id);
		const newIndex = media.findIndex((m) => m.id === over.id);
		const next = arrayMove(media, oldIndex, newIndex);
		setMedia(next);
		await Promise.all(next.map((m, i) => supabase.from("media").update({ position: i }).eq("id", m.id)));
	}
	async function onSubmit(e) {
		e.preventDefault();
		setSaving(true);
		try {
			const category_id = await ensureCategory();
			const slug = slugify(values.title);
			const tools = values.tools.split(",").map((s) => s.trim()).filter(Boolean);
			const cover = media.find((m) => m.id === coverMediaId) ?? media[0];
			const payload = {
				title: values.title,
				client: values.client || null,
				category_id,
				year: values.year ? Number(values.year) : null,
				tools,
				description: values.description || null,
				featured: values.featured,
				published: values.published,
				cover_url: cover?.url ?? null,
				slug
			};
			let saved;
			if (projectId) {
				const { data, error } = await supabase.from("projects").update(payload).eq("id", projectId).select("*, category:categories(*), media(*)").single();
				if (error) throw error;
				saved = data;
			} else {
				const { data, error } = await supabase.from("projects").insert(payload).select("*, category:categories(*), media(*)").single();
				if (error) throw error;
				saved = data;
			}
			if (coverMediaId) {
				await supabase.from("media").update({ is_cover: false }).eq("project_id", saved.id);
				await supabase.from("media").update({ is_cover: true }).eq("id", coverMediaId);
			}
			toast.success("Projeto salvo!");
			qc.invalidateQueries({ queryKey: ["admin-projects"] });
			onSaved(saved);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erro ao salvar");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "grid gap-8 md:grid-cols-[1fr_320px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "title",
					children: "Título *"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "title",
					required: true,
					value: values.title,
					onChange: (e) => setField("title", e.target.value),
					className: "mt-2"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "client",
						children: "Cliente"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "client",
						value: values.client,
						onChange: (e) => setField("client", e.target.value),
						className: "mt-2"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "year",
						children: "Ano"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "year",
						type: "number",
						min: "1900",
						max: "2100",
						value: values.year,
						onChange: (e) => setField("year", e.target.value),
						className: "mt-2"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Categoria existente" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: values.category_id ?? "",
						onChange: (e) => setField("category_id", e.target.value || null),
						className: "mt-2 w-full h-10 bg-input rounded-md border border-border px-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "— nenhuma —"
						}), categories?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c.id,
							children: c.name
						}, c.id))]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "newCategory",
						children: "Ou criar nova"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "newCategory",
						placeholder: "ex: Identidade Visual",
						value: values.newCategory,
						onChange: (e) => setField("newCategory", e.target.value),
						className: "mt-2"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "tools",
					children: "Ferramentas (separadas por vírgula)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "tools",
					placeholder: "Illustrator, Photoshop, Figma",
					value: values.tools,
					onChange: (e) => setField("tools", e.target.value),
					className: "mt-2"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "description",
					children: "Descrição"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "description",
					rows: 8,
					value: values.description,
					onChange: (e) => setField("description", e.target.value),
					className: "mt-2"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-6 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: values.published,
							onChange: (e) => setField("published", e.target.checked)
						}), "Publicado"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: values.featured,
							onChange: (e) => setField("featured", e.target.checked)
						}), "Destaque na home"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "lg",
					disabled: saving,
					children: saving ? "Salvando..." : projectId ? "Salvar alterações" : "Criar projeto"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "section-label",
				children: "[ Mídias / Slides ]"
			}), !projectId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted-foreground",
				children: "Salve o projeto primeiro para começar a enviar arquivos."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 flex items-center justify-center gap-2 h-12 border border-dashed border-border rounded-md cursor-pointer hover:border-primary text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }),
					" ",
					uploading ? "Enviando..." : "Enviar imagens/vídeos",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						multiple: true,
						accept: "image/*,video/*",
						onChange: (e) => handleUpload(e.target.files),
						className: "hidden"
					})
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DndContext, {
				sensors,
				collisionDetection: closestCenter,
				onDragEnd,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableContext, {
					items: media.map((m) => m.id),
					strategy: verticalListSortingStrategy,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: media.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableMediaRow, {
							media: m,
							isCover: coverMediaId === m.id,
							onCover: () => setCoverMediaId(m.id),
							onRemove: () => removeMedia(m)
						}, m.id))
					})
				})
			})]
		})]
	});
}
function SortableMediaRow({ media, isCover, onCover, onRemove }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: media.id });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		ref: setNodeRef,
		style: {
			transform: CSS.Transform.toString(transform),
			transition,
			opacity: isDragging ? .5 : 1
		},
		className: "flex items-center gap-2 p-2 bg-surface rounded-md border border-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				...attributes,
				...listeners,
				className: "cursor-grab text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-12 w-16 rounded overflow-hidden bg-black shrink-0",
				children: media.type === "image" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: media.url,
					alt: "",
					className: "h-full w-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					src: media.url,
					muted: true,
					playsInline: true,
					className: "h-full w-full object-cover"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 text-xs text-muted-foreground truncate",
				children: [
					media.type,
					" · pos ",
					media.position
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onCover,
				title: "Definir como capa",
				className: isCover ? "text-primary" : "text-muted-foreground hover:text-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
					className: "h-4 w-4",
					fill: isCover ? "currentColor" : "none"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onRemove,
				title: "Remover",
				className: "text-muted-foreground hover:text-destructive",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
			})
		]
	});
}
//#endregion
export { ProjectForm as t };
