import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { LogOut, Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/portfolio";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Painel — Projetos" }, { name: "robots", content: "noindex" }] }),
  component: AdminIndex,
});

function useIsAdmin() {
  return useQuery({
    queryKey: ["me-is-admin"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return false;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });
}

function AdminIndex() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, category:categories(*)")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Project[];
    },
    enabled: !!isAdmin,
  });

  const toggleFeatured = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const { error } = await supabase.from("projects").update({ featured }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-projects"] }),
  });

  const togglePublished = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from("projects").update({ published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-projects"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success("Projeto excluído.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (adminLoading) return <AdminShell><p className="text-muted-foreground">Carregando...</p></AdminShell>;
  if (!isAdmin) {
    return (
      <AdminShell>
        <div className="max-w-md">
          <p className="section-label">[ Acesso negado ]</p>
          <h2 className="font-display text-3xl mt-3">Sua conta não é administradora.</h2>
          <p className="text-muted-foreground mt-3 text-sm">Somente o administrador do portfólio pode acessar o painel.</p>
          <Button className="mt-6" onClick={signOut}>Sair</Button>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell onSignOut={signOut}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-label">[ 01 / Painel ]</p>
          <h1 className="font-display text-5xl mt-2">Projetos</h1>
        </div>
        <Button asChild size="lg">
          <Link to="/admin/novo"><Plus className="h-4 w-4 mr-2" /> Novo projeto</Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando projetos...</p>
      ) : !projects?.length ? (
        <div className="border border-dashed border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground">Nenhum projeto ainda. Comece criando o primeiro.</p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
          {projects.map((p) => (
            <div key={p.id} className="grid grid-cols-[80px_1fr_auto] gap-4 p-4 items-center">
              <div className="h-16 w-20 bg-surface rounded overflow-hidden">
                {p.cover_url && (
                  p.cover_url.match(/\.(mp4|webm|mov)/i)
                    ? <video src={p.cover_url} muted playsInline className="h-full w-full object-cover" />
                    : <img src={p.cover_url} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-display text-xl truncate">{p.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {p.client ?? "sem cliente"} · {p.category?.name ?? "sem categoria"} · {p.year ?? "—"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Switch checked={p.published} onCheckedChange={(v) => togglePublished.mutate({ id: p.id, published: v })} />
                  Publicado
                </label>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Switch checked={p.featured} onCheckedChange={(v) => toggleFeatured.mutate({ id: p.id, featured: v })} />
                  Destaque
                </label>
                <Button asChild variant="ghost" size="icon" title="Ver">
                  <Link to="/projeto/$slug" params={{ slug: p.slug }} target="_blank"><ExternalLink className="h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="ghost" size="icon" title="Editar">
                  <Link to="/admin/$id" params={{ id: p.id }}><Pencil className="h-4 w-4" /></Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" title="Excluir"><Trash2 className="h-4 w-4" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir projeto?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Isso removerá o projeto e todos os slides. A ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => remove.mutate(p.id)}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

function AdminShell({ children, onSignOut }: { children: React.ReactNode; onSignOut?: () => void }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 h-16 flex items-center justify-between">
          <Link to="/admin" className="font-display text-2xl">
            Painel<span className="text-primary">.</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm"><Link to="/">Ver site</Link></Button>
            {onSignOut && (
              <Button variant="outline" size="sm" onClick={onSignOut}>
                <LogOut className="h-4 w-4 mr-2" /> Sair
              </Button>
            )}
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-10">{children}</div>
    </div>
  );
}
