# Portfólio Lucas Miranda — Anima Estudio

## Stack e infra
- TanStack Start (já configurado) + Tailwind v4 + shadcn.
- **Lovable Cloud** (Supabase) para auth, banco e storage de mídias.
- Embla Carousel para o carrossel de slides (imagens + vídeos, teclado, swipe, thumbs, dots).
- Framer Motion para microanimações sutis (fade/slide no scroll, hover nos cards).

## Direção visual
- Dark mode como base: fundo `#0A0A0A`, superfícies `#111`, texto `#F5F5F5`.
- Accent inicial: **verde neon** (`oklch(~0.85 0.22 145)`) — trocável em 1 token.
- Tipografia: display serifada moderna (ex. "Fraunces" ou "Instrument Serif") para títulos gigantes + "Inter" para corpo. Números de seção em mono ("JetBrains Mono").
- Rótulos editoriais: `[ 01 / Trabalhos ]`.
- Grid assimétrica na home, hero com nome enorme e frase curta.
- Todos os tokens em `src/styles.css` (oklch), variantes shadcn — nenhum hex hardcoded em componente.

## Rotas (TanStack file-based)
```
/                       hero + projetos em destaque
/trabalhos              grade + filtro por categoria dinâmica
/projeto/$slug          detalhe + carrossel + prev/next
/sobre                  trajetória, especialidades, softwares
/contato                formulário + WhatsApp + email + redes
/auth                   login (só admin)
/_authenticated/admin           lista de projetos + toggle destaque
/_authenticated/admin/novo      criar projeto
/_authenticated/admin/$id       editar projeto (reordenar mídias, escolher capa)
```
- Botão flutuante de WhatsApp em todas as páginas públicas.
- SEO por rota via `head()`: title, description, og:title, og:description, og:image (capa do projeto nas páginas de projeto).
- `sitemap.xml` + `robots.txt`.

## Modelo de dados (Supabase)
```
categories(id, name, slug, created_at)
projects(
  id, slug unique, title, client, category_id -> categories,
  year int, tools text[], description text,
  cover_media_id -> media, featured bool, published bool,
  created_at, updated_at, sort_order
)
media(
  id, project_id -> projects on delete cascade,
  type ('image'|'video'), storage_path, url,
  width, height, position int, created_at
)
user_roles(id, user_id -> auth.users, role app_role)  -- padrão has_role
```
- RLS: leitura pública apenas de `projects.published = true`, `categories`, `media` de projetos publicados. Escrita apenas para role `admin`.
- Storage bucket `portfolio-media` público (imagens/vídeos).
- Trigger para popular `updated_at`.
- Função `has_role(uuid, app_role)` security definer.
- Grants explícitos para `anon`/`authenticated`/`service_role`.

## Carrossel do projeto
- Embla + plugins (Autoplay off por padrão, WheelGestures off).
- Setas ←/→, dots, thumbnails scrolláveis, contador `3 / 8`.
- Suporte teclado (ArrowLeft/Right).
- Vídeos: `<video muted loop playsInline>` por padrão + botão de som (mute/unmute) sobreposto.
- Lazy loading nativo nas imagens; `preload="metadata"` nos vídeos.

## Painel admin
- Login email/senha via Supabase Auth. Layout `_authenticated` gate gerenciado pela integração.
- Só usuários com role `admin` acessam `/admin/*` (checa via `has_role`).
- **Criar/editar projeto**: form (título, cliente, categoria como combobox com criação inline, ano, ferramentas como tags, descrição rich-text simples com textarea).
- **Upload de mídia**: multi-upload para storage, salva em `media` com `position` incremental.
- **Reordenar** via drag-and-drop (`@dnd-kit/sortable`), persiste `position`.
- **Escolher capa**: botão "definir como capa" em cada slide → grava `cover_media_id`.
- **Destaque**: toggle na lista de projetos.
- **Excluir**: com confirmação (dialog); cascata remove mídias no banco + limpa storage.

## Fluxo de implementação
1. Habilitar Lovable Cloud.
2. Migração inicial (enum, tabelas, RLS, grants, `has_role`, bucket).
3. Design tokens em `src/styles.css` + fontes via `<link>` no `__root.tsx`.
4. Layout compartilhado (nav minimal, footer, botão WhatsApp flutuante).
5. Páginas públicas: home, trabalhos, projeto, sobre, contato.
6. Auth + guard admin + painel CRUD + upload/reorder.
7. SEO por rota + sitemap/robots.
8. Seed opcional (categorias iniciais vazias — deixo você criar).

## Detalhes técnicos (para revisão)
- Server functions para operações admin (usando `requireSupabaseAuth` + checagem de role).
- Leituras públicas via cliente publishable no server ou direto no browser (RLS já filtra `published`).
- Nada de dados mockados após conectar Cloud — página vazia mostra estado "sem projetos ainda".
- Preciso pedir depois: cor de destaque final, textos da seção Sobre, número de WhatsApp, e-mail, links de redes sociais. Vou deixar placeholders claros marcados com `TODO` no código para você trocar (ou me diz agora que já ajusto).

Confirma o plano que eu já começo pela ativação do Cloud e migração?