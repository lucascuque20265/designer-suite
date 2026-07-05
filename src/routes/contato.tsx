import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, MessageCircle, Instagram, Linkedin } from "lucide-react";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Lucas Miranda | Anima Estudio" },
      { name: "description", content: "Fale com Lucas Miranda para orçamentos, colaborações e projetos de design gráfico." },
      { property: "og:title", content: "Contato — Lucas Miranda" },
      { property: "og:description", content: "Formulário direto, WhatsApp e e-mail para começar seu projeto." },
      { property: "og:url", content: "/contato" },
    ],
    links: [{ rel: "canonical", href: "/contato" }],
  }),
  component: Contato,
});

const schema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  message: z.string().trim().min(10, "Descreva um pouco mais").max(1500),
});

function Contato() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = schema.safeParse({ name, email, message });
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Verifique os campos");
      return;
    }
    const text = `Olá Lucas! Sou ${result.data.name} (${result.data.email}).\n\n${result.data.message}`;
    const url = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  }

  return (
    <div className="px-6 md:px-10 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] grid gap-16 md:grid-cols-[3fr_2fr]">
        <div>
          <p className="section-label"></p>
          <h1 className="font-display text-6xl md:text-8xl mt-4 leading-[0.95]">
            Vamos criar
            <br />
            algo <span className="text-primary">memorável</span>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Envie uma mensagem contando sobre o projeto, respondo em até 1 dia útil.
          </p>

          <form onSubmit={onSubmit} className="mt-10 space-y-5 max-w-xl">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-2" required />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" required />
            </div>
            <div>
              <Label htmlFor="message">Sobre o projeto</Label>
              <Textarea id="message" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} className="mt-2" required />
            </div>
            <Button type="submit" size="lg">Enviar via WhatsApp</Button>
          </form>
        </div>

        <aside className="md:pt-24">
          <p className="section-label">[ Canais diretos ]</p>
          <ul className="mt-4 space-y-4">
            <li>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 text-lg hover:text-primary transition-colors">
                <Mail className="h-4 w-4" /> {SITE.email}
              </a>
            </li>
            <li>
              <a href={SITE.whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-lg hover:text-primary transition-colors">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </li>
            <li>
              <a href={SITE.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-lg hover:text-primary transition-colors">
                <Instagram className="h-4 w-4" /> @animaestudio
              </a>
            </li>
            <li>
              <a href={SITE.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-lg hover:text-primary transition-colors">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
