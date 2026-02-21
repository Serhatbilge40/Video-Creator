"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Video, Sparkles, Images, CreditCard, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";

const navLinks = [
  { href: "/create", label: "Erstellen", icon: Sparkles },
  { href: "/gallery", label: "Galerie", icon: Images },
  { href: "/pricing", label: "Preise", icon: CreditCard },
  { href: "/settings", label: "API Keys", icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-nav-bg backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
            <Video className="h-4 w-4 text-accent" />
          </div>
          <span className="font-semibold tracking-tight text-foreground">
            Sora Creator
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-surface text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <div className="flex items-center gap-1.5 rounded-md bg-surface px-3 py-1.5 text-sm ring-1 ring-border shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="font-medium text-foreground">100 Credits</span>
          </div>
          <Link
            href="/create"
            className="rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90 active:scale-95"
          >
            Video erstellen
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-muted hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border md:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    pathname === link.href
                      ? "bg-surface-hover text-foreground"
                      : "text-muted hover:text-foreground"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <ThemeToggle />
                <Link
                  href="/create"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background"
                >
                  Video erstellen
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
