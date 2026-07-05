import { useState, useEffect } from "react";
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

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
  const MAX_IMAGE_DIMENSION = 2048; // px
  const DEFAULT_IMAGE_QUALITY = 0.8; // 80%

  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

  const { data: remoteMedia } = useQuery({
    queryKey: ["project-media", projectId],
    queryFn: async () => {
      if (!projectId) return [] as Media[];
      const res = await fetch(`/api/media?project_id=${projectId}`);
      if (!res.ok) throw new Error('Falha ao buscar mídias');
      const json = await res.json();
      return (json.data ?? []) as Media[];
    },
    refetchInterval: 5000,
    enabled: !!projectId,
  });

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
        // Validate size and compress images if needed
        let toUpload: File | Blob = file;
        if (file.size > MAX_FILE_SIZE) {
          if (file.type.startsWith("image/")) {
            try {
              const compressed = await compressImageFile(file, MAX_IMAGE_DIMENSION, DEFAULT_IMAGE_QUALITY);
              if (compressed.size > MAX_FILE_SIZE) {
                // try lowering quality progressively
                let q = DEFAULT_IMAGE_QUALITY;
                let blob = compressed;
                while (blob.size > MAX_FILE_SIZE && q > 0.5) {
                  q -= 0.1;
                  // eslint-disable-next-line no-await-in-loop
                  blob = await compressImageFile(file, Math.round(MAX_IMAGE_DIMENSION * (q / DEFAULT_IMAGE_QUALITY)), q);
                }
                if (blob.size <= MAX_FILE_SIZE) toUpload = blob;
                else {
                  toast.error(`${file.name} ainda excede 50MB após compressão. Comprima localmente ou remova.`);
                  continue;
                }
              } else {
                toUpload = compressed;
              }
            } catch (err) {
              toast.error("Erro ao comprimir imagem");
              continue;
            }
          } else if (file.type.startsWith("video/")) {
            toast.error(`${file.name} é vídeo e excede 50MB. Por favor comprima localmente ou configure transcodificação server-side.`);
            continue;
          } else {
            toast.error(`${file.name} excede 50MB.`);
            continue;
          }
        }

        const ext = (file.type.startsWith("image/") && (toUpload as File)?.name ? ((toUpload as File).name.split('.').pop() ?? 'jpg') : file.name.split('.').pop() ?? 'bin');
        const filename = `${crypto.randomUUID()}.${ext}`;
        const path = `${projectId}/${filename}`;

        const { error: upErr } = await supabase.storage
          .from("portfolio-media")
          .upload(path, toUpload, { contentType: (toUpload as File | Blob).type || file.type, upsert: false });
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
            transcode_status: type === 'video' ? 'pending' : null,
          })
          .select()
          .single();
        if (mErr) throw mErr;
        const newMedia = mediaRow as unknown as Media;
        uploaded.push(newMedia);
        // If uploaded video, trigger server-side transcode to optimize size/quality
        if (type === 'video') {
          try {
            // fire-and-forget; server will update media row when done
            fetch('/api/transcode', {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
                'x-transcode-secret': import.meta.env.VITE_TRANSCODE_SECRET ?? '',
              },
              body: JSON.stringify({ storage_path: path, media_id: newMedia.id, target_size: 50 * 1024 * 1024 }),
            }).then(() => {
              toast.success('Transcodificação iniciada para ' + file.name);
            }).catch(() => {
              toast.error('Falha ao iniciar transcodificação');
            });
          } catch {
            // ignore
          }
        }
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

  // Sync server-side media updates (only update URL/storage_path/transcode_status)
  useEffect(() => {
    if (!remoteMedia) return;
    setMedia((prev) => {
      const prevMap = new Map(prev.map((m) => [m.id, m]));
      const merged = (remoteMedia ?? []).map((sm) => {
        const existing = prevMap.get(sm.id);
        if (existing) {
          return {
            ...existing,
            url: sm.url ?? existing.url,
            storage_path: sm.storage_path ?? existing.storage_path,
            transcode_status: sm.transcode_status ?? existing.transcode_status,
            position: sm.position ?? existing.position,
            is_cover: sm.is_cover ?? existing.is_cover,
          };
        }
        return sm;
      });
      // Keep any local-only items (e.g., not yet persisted)
      const localOnly = prev.filter((p) => !(remoteMedia ?? []).find((s) => s.id === p.id));
      return [...merged, ...localOnly];
    });
  }, [remoteMedia]);

  async function compressImageFile(file: File, maxDim = MAX_IMAGE_DIMENSION, quality = DEFAULT_IMAGE_QUALITY): Promise<Blob> {
    if (!file.type.startsWith("image/")) throw new Error("Not an image");
    // Use createImageBitmap for better performance when available
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;
    const ratio = width / height;
    if (Math.max(width, height) > maxDim) {
      if (width >= height) {
        width = maxDim;
        height = Math.round(maxDim / ratio);
      } else {
        height = maxDim;
        width = Math.round(maxDim * ratio);
      }
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    ctx.drawImage(bitmap, 0, 0, width, height);
    // Prefer webp for better compression; fallback to jpeg
    const mime = "image/webp";
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) resolve(b);
        else reject(new Error("Failed to create blob"));
      }, mime, quality);
    });
  }

  async function removeMedia(m: Media) {
    if (!confirm("Remover este slide?")) return;
    try {
      // Delete DB record first to respect RLS/permission checks
      const { error: delErr } = await supabase.from("media").delete().eq("id", m.id);
      if (delErr) throw delErr;

      // Then remove file from storage if available
      if (m.storage_path) {
        const { error: storageErr } = await supabase.storage.from("portfolio-media").remove([m.storage_path]);
        if (storageErr) {
          // Log and show a warning — DB record already removed, but file may remain in storage
          // eslint-disable-next-line no-console
          console.warn("Falha ao remover arquivo do storage:", storageErr);
          toast.error("Mídia removida do projeto, porém falha ao remover arquivo do storage.");
        }
      }

      setMedia((prev) => prev.filter((x) => x.id !== m.id));
      if (coverMediaId === m.id) setCoverMediaId(null);
      toast.success("Slide removido.");
    } catch (e) {
      const err = e as any;
      // eslint-disable-next-line no-console
      console.error("Erro ao remover mídia:", err);
      toast.error(err?.message ?? "Erro ao remover mídia");
    }
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
      // Ensure slug uniqueness to avoid 409 Conflict on insert
      async function generateUniqueSlug(base: string, excludeId?: string | null) {
        let candidate = base;
        let i = 2;
        while (true) {
          const { data, error } = await supabase.from("projects").select("id").eq("slug", candidate).limit(1);
          if (error) throw error;
          const exists = Array.isArray(data) && data.length > 0 && data[0].id !== excludeId;
          if (!exists) return candidate;
          candidate = `${base}-${i}`;
          i += 1;
          if (i > 100) throw new Error("Não foi possível gerar um slug único");
        }
      }

      const baseSlug = slugify(values.title);
      const slug = await generateUniqueSlug(baseSlug, projectId ?? null);
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
      const err = e as any;
      // Log full error to the console for debugging
      // and prefer a structured message from Supabase if available
      // so users/admins see a helpful toast instead of a generic message.
      // Examples: permission denied, unique constraint violation, validation.
      // eslint-disable-next-line no-console
      console.error("Erro ao salvar projeto:", err);
      const message =
        err instanceof Error
          ? err.message
          : err?.error?.message ?? err?.message ?? (typeof err === "string" ? err : JSON.stringify(err));
      toast.error(message || "Erro ao salvar");
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
        {media.transcode_status === 'processing' && (
          <span className="ml-2 text-yellow-500">Processando</span>
        )}
        {media.transcode_status === 'pending' && (
          <span className="ml-2 text-blue-500">Pendente</span>
        )}
        {media.transcode_status === 'failed' && (
          <span className="ml-2 text-red-500">Falha</span>
        )}
        {media.transcode_status === 'done' && (
          <span className="ml-2 text-green-500">Pronto</span>
        )}
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
