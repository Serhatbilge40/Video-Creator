"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "0",
    period: "für immer",
    description: "Zum Ausprobieren — perfekt für den Einstieg.",
    credits: 5,
    features: [
      "5 Credits / Monat",
      "Alle 4 KI-Modelle",
      "Max. 720p Auflösung",
      "Max. 10s Dauer",
      "Wasserzeichen",
    ],
    cta: "Kostenlos starten",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "29",
    period: "/ Monat",
    description: "Für Kreative und Content Creator mit höherem Bedarf.",
    credits: 100,
    features: [
      "100 Credits / Monat",
      "Alle 4 KI-Modelle",
      "Bis 4K Auflösung",
      "Max. 30s Dauer",
      "Kein Wasserzeichen",
      "Prioritäts-Queue",
      "Download als MP4 & WebM",
    ],
    cta: "Pro werden",
    highlighted: true,
    badge: "Beliebt",
  },
  {
    name: "Unlimited",
    price: "99",
    period: "/ Monat",
    description: "Unbegrenzte Generierungen für Teams und Power-User.",
    credits: -1,
    features: [
      "Unbegrenzte Credits",
      "Alle 4 KI-Modelle",
      "Bis 4K Auflösung",
      "Max. 60s Dauer",
      "Kein Wasserzeichen",
      "Prioritäts-Queue",
      "Download als MP4 & WebM",
      "API-Zugang",
      "Team-Accounts",
    ],
    cta: "Unlimited werden",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      {/* Header */}
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Einfache, transparente Preise
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-4 max-w-lg text-muted"
        >
          Starte kostenlos und upgrade wenn du bereit bist. Keine versteckten
          Kosten, jederzeit kündbar.
        </motion.p>
      </div>

      {/* Plans grid */}
      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className={cn(
              "relative rounded-2xl border p-8 transition-colors",
              plan.highlighted
                ? "border-accent/30 bg-accent/[0.04] glow"
                : "border-border bg-surface hover:bg-surface-hover"
            )}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
                {plan.badge}
              </span>
            )}

            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {plan.description}
              </p>
            </div>

            <div className="mt-6">
              <span className="text-4xl font-bold text-foreground">
                €{plan.price}
              </span>
              <span className="ml-1 text-sm text-muted-foreground">
                {plan.period}
              </span>
            </div>

            <Link
              href="/create"
              className={cn(
                "mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                plan.highlighted
                  ? "bg-accent text-white hover:bg-accent-hover"
                  : "border border-border bg-surface text-foreground hover:bg-surface-hover"
              )}
            >
              {plan.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-8 space-y-3">
              {plan.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2.5 text-sm"
                >
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      plan.highlighted ? "text-accent" : "text-muted-foreground"
                    )}
                  />
                  <span className="text-muted">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* FAQ teaser */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center text-sm text-muted-foreground"
      >
        Fragen? Schreib uns an{" "}
        <a href="mailto:support@soracreator.de" className="text-accent hover:underline">
          support@soracreator.de
        </a>
      </motion.div>
    </div>
  );
}
