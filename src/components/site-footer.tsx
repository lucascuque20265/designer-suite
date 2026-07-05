import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 grid gap-10 md:grid-cols-3">
        <div>
          <p className="section-label">[ Anima Estudio ]</p>
          <p className="font-display text-3xl mt-3">Lucas Miranda</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">
            Construindo identidades e experiências visuais de impacto.
          </p>
        </div>

        <div>
          <p className="section-label">[ Navegação ]</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/trabalhos" className="hover:text-primary transition-colors">Trabalhos</Link></li>
            <li><Link to="/sobre" className="hover:text-primary transition-colors">Sobre</Link></li>
            <li><Link to="/contato" className="hover:text-primary transition-colors">Contato</Link></li>
          </ul>
        </div>

        <div>
          <p className="section-label">[ Contato ]</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href={`mailto:${SITE.email}`} className="hover:text-primary transition-colors">{SITE.email}</a></li>
            <li><a href={SITE.whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">WhatsApp</a></li>
            <li><a href={SITE.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2020 Lucas Miranda — Anima Estudio. Todos os direitos reservados.</p>
          <p className="font-mono">Feito com muita paixão e café.</p>
        </div>
      </div>
    </footer>
  );
}
