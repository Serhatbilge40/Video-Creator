"use client";

import { motion } from "framer-motion";
import { Cpu, Zap, Download, Layers, Palette, Shield } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "Mehrere KI-Modelle",
    description:
      "Sora 2 Pro, Veo 3.1, Runway Gen-4 und Kling 2.0 — wähle das beste Modell für dein Projekt.",
  },
  {
    icon: Zap,
    title: "Schnelle Generierung",
    description:
      "Optimierte Pipeline für schnellstmögliche Video-Generierung ohne Qualitätsverlust.",
  },
  {
    icon: Palette,
    title: "Style-Presets",
    description:
      "Cinematic, Anime, Realistic, Abstract und mehr — passe den Look an deine Vision an.",
  },
  {
    icon: Layers,
    title: "Flexible Parameter",
    description:
      "Kontrolliere Auflösung (bis 4K), Dauer, Seitenverhältnis und Negative Prompts.",
  },
  {
    icon: Download,
    title: "Sofort-Download",
    description:
      "Lade generierte Videos direkt als MP4 herunter. Keine Wasserzeichen, keine Einschränkungen.",
  },
  {
    icon: Shield,
    title: "Datenschutz",
    description:
      "Deine Prompts und Videos gehören dir. DSGVO-konform und sicher gespeichert.",
  },
];

export function Features() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Alles was du brauchst
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Eine Plattform, alle führenden Video-KI-Modelle. Einfach prompten
            und beeindruckende Ergebnisse erzielen.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group rounded-2xl border border-border bg-surface p-6 transition-colors hover:bg-surface-hover hover:border-border-hover"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/[0.1]">
                <feature.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
