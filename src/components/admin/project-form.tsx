import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCategories, slugify, type Category, type Media, type ProjectWithMedia } from "@/lib/portfolio";
import { X, GripVertical, Star, Upload } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type ProjectFormValues = {
  title: string;
  client: string;
  category_id: string | null;
  newCategory: string;
  year: string;
  tools: string;
  description: string;
  featured: boolean;
  published: boolean;
};

export function ProjectForm({
  initial,
  projectId,
  initialMedia = [],
  initialCoverMediaId = null,
  onSaved,
}: {
  initial: Partial<ProjectFormValues>;
  projectId?: string;
  initialMedia?: Media[];
  initialCoverMediaId?: string | null;
  onSaved: (project: ProjectWithMedia) => void;
}) {
  const qc = useQueryClient();
  const [values, setValues] = useState<ProjectFormValues>({
    title: initial.title ?? "",
    client: initial.client ?? "",
    category_id: initial.category_id ?? null,
    newCategory: "",
    year: initial.year ?? String(new Date().getFullYear()),
    tools: initial.tools ?? "",
    description: initial.description ?? "",
    featured: initial.featured ?? false,
    published: initial.published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [media, setMedia] = useState<Media[]>(initialMedia);
  const [coverMediaId, setCoverMediaId] = useState<string | null>(
    initialCoverMediaId ?? initialMedia.find((m) => m.is_cover)?.id ?? initialMedia[0]?.id ?? null,
  );
  const [uploading, setUploading] = useState(false);

  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

  function setField<K extends keyof ProjectFormValues>(key: K, v: ProjectFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function ensureCategory(): Promise<string | null> {
    if (values.newCategory.trim()) {
      const name = values.newCategory.trim();
      const slug = slugify(name);
      const { data, error } = await supabase
        .from("categories")
        .upsert({ name, slug }, { onConflict: "slug" })
        .select()
        .single();
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["categories"] });
      return (data as Category).id;
    }
    return values.category_id;
  }

  async function handleUpload(files: FileList | null) {
    if (!files?.length || !projectId) return;
    setUploading(true);
    try {
      const startPos = media.length;
      const uploaded: Media[] = [];
      for (const [i, file] of Array.from(files).entries()) {
        const ext = file.name.split(".").pop() ?? "bin";
        const path = `${projectId}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("portfolio-media")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("portfolio-media").getPublicUrl(path);
        const type: "image" | "video" = file.type.startsWith("video") ? "video" : "image";
        const { data: mediaRow, error: mErr } = await supabase
          .from("media")
          .insert({
            project_id: projectId,
            type,
            url: pub.publicUrl,
            storage_path: path,
            position: startPos + i,
          })
          .select()
          .single();
        if (mErr) throw mErr;
        uploaded.push(mediaRow as unknown as Media);
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

  async function removeMedia(m: Media) {
    if (!confirm("Remover este slide?")) return;
    if (m.storage_path) {
      await supabase.storage.from("portfolio-media").remove([m.storage_path]);
    }
    await supabase.from("media").delete().eq("id", m.id);
    setMedia((prev) => prev.filter((x) => x.id !== m.id));
    if (coverMediaId === m.id) setCoverMediaId(null);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = media.findIndex((m) => m.id === active.id);
    const newIndex = media.findIndex((m) => m.id === over.id);
    const next = arrayMove(media, oldIndex, newIndex);
    setMedia(next);
    await Promise.all(
      next.map((m, i) =>
        supabase.from("media").update({ position: i }).eq("id", m.id),
      ),
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const category_id = await ensureCategory();
      const slug = slugify(values.title);
      const tools = values.tools
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
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
        slug,
      };

      let saved: ProjectWithMedia;
      if (projectId) {
        const { data, error } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", projectId)
          .select("*, category:categories(*), media(*)")
          .single();
        if (error) throw error;
        saved = data as unknown as ProjectWithMedia;
      } else {
        const { data, error } = await supabase
          .from("projects")
          .insert(payload)
          .select("*, category:categories(*), media(*)")
          .single();
        if (error) throw error;
        saved = data as unknown as ProjectWithMedia;
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

  return (
    <form onSubmit={onSubmit} className="grid gap-8 md:grid-cols-[1fr_320px]">
      <div className="space-y-5">
        <div>
          <Label htmlFor="title">Título *</Label>
          <Input id="title" required value={values.title} onChange={(e) => setField("title", e.target.value)} className="mt-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client">Cliente</Label>
            <Input id="client" value={values.client} onChange={(e) => setField("client", e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="year">Ano</Label>
            <Input id="year" type="number" min="1900" max="2100" value={values.year} onChange={(e) => setField("year", e.target.value)} className="mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Categoria existente</Label>
            <select
              value={values.category_id ?? ""}
              onChange={(e) => setField("category_id", e.target.value || null)}
              className="mt-2 w-full h-10 bg-input rounded-md border border-border px-3 text-sm"
            >
              <option value="">— nenhuma —</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="newCategory">Ou criar nova</Label>
            <Input id="newCategory" placeholder="ex: Identidade Visual" value={values.newCategory} onChange={(e) => setField("newCategory", e.target.value)} className="mt-2" />
          </div>
        </div>
        <div>
          <Label htmlFor="tools">Ferramentas (separadas por vírgula)</Label>
          <Input id="tools" placeholder="Illustrator, Photoshop, Figma" value={values.tools} onChange={(e) => setField("tools", e.target.value)} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" rows={8} value={values.description} onChange={(e) => setField("description", e.target.value)} className="mt-2" />
        </div>
        <div className="flex items-center gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={values.published} onChange={(e) => setField("published", e.target.checked)} />
            Publicado
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={values.featured} onChange={(e) => setField("featured", e.target.checked)} />
            Destaque na home
          </label>
        </div>
        <Button type="submit" size="lg" disabled={saving}>
          {saving ? "Salvando..." : projectId ? "Salvar alterações" : "Criar projeto"}
        </Button>
      </div>

      <aside className="space-y-4">
        <div>
          <p className="section-label">[ Mídias / Slides ]</p>
          {!projectId ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Salve o projeto primeiro para começar a enviar arquivos.
            </p>
          ) : (
            <label className="mt-3 flex items-center justify-center gap-2 h-12 border border-dashed border-border rounded-md cursor-pointer hover:border-primary text-sm">
              <Upload className="h-4 w-4" /> {uploading ? "Enviando..." : "Enviar imagens/vídeos"}
              <input type="file" multiple accept="image/*,video/*" onChange={(e) => handleUpload(e.target.files)} className="hidden" />
            </label>
          )}
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={media.map((m) => m.id)} strategy={verticalListSortingStrategy}>
            <ul className="space-y-2">
              {media.map((m) => (
                <SortableMediaRow
                  key={m.id}
                  media={m}
                  isCover={coverMediaId === m.id}
                  onCover={() => setCoverMediaId(m.id)}
                  onRemove={() => removeMedia(m)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </aside>
    </form>
  );
}

function SortableMediaRow({ media, isCover, onCover, onRemove }: {
  media: Media; isCover: boolean; onCover: () => void; onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: media.id });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center gap-2 p-2 bg-surface rounded-md border border-border"
    >
      <button type="button" {...attributes} {...listeners} className="cursor-grab text-muted-foreground">
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="h-12 w-16 rounded overflow-hidden bg-black shrink-0">
        {media.type === "image" ? (
          <img src={media.url} alt="" className="h-full w-full object-cover" />
        ) : (
          <video src={media.url} muted playsInline className="h-full w-full object-cover" />
        )}
      </div>
      <div className="flex-1 text-xs text-muted-foreground truncate">
        {media.type} · pos {media.position}
      </div>
      <button type="button" onClick={onCover} title="Definir como capa" className={isCover ? "text-primary" : "text-muted-foreground hover:text-foreground"}>
        <Star className="h-4 w-4" fill={isCover ? "currentColor" : "none"} />
      </button>
      <button type="button" onClick={onRemove} title="Remover" className="text-muted-foreground hover:text-destructive">
        <X className="h-4 w-4" />
      </button>
    </li>
  );
}
