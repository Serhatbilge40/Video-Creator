import Link from "next/link";
import { Video } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
                <Video className="h-4 w-4 text-accent" />
              </div>
              <span className="font-semibold tracking-tight">Sora Creator</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Erstelle beeindruckende Videos mit den besten KI-Modellen. Einfach
              prompten, generieren, herunterladen.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-foreground">Produkt</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/create" className="hover:text-foreground transition-colors">Video erstellen</Link></li>
              <li><Link href="/gallery" className="hover:text-foreground transition-colors">Galerie</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Preise</Link></li>
              <li><Link href="/settings" className="hover:text-foreground transition-colors">API Keys</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium text-foreground">Modelle</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Sora 2 Pro</li>
              <li>Veo 3.1</li>
              <li>Runway Gen-4</li>
              <li>Kling 2.0</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Impressum</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Datenschutz</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">AGB</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-border pt-6 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Sora Creator. Alle Rechte vorbehalten.</p>
          <p>Erstellt mit Next.js & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
