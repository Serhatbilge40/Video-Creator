"use client";

import { motion } from "framer-motion";
import { MODELS } from "@/lib/types";

export function ModelShowcase() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Die besten KI-Video-Modelle
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Greife auf die neuesten und leistungsstärksten Modelle zu — alles
            über eine einheitliche Oberfläche.
          </p>
        </div>

        {/* Model cards */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODELS.map((model, i) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-colors hover:bg-surface-hover hover:border-border-hover"
            >
              {model.badge && (
                <span className="absolute right-4 top-4 rounded-full bg-accent/[0.15] px-2.5 py-0.5 text-xs font-medium text-accent">
                  {model.badge}
                </span>
              )}

              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {model.provider}
              </div>
              <h3 className="mt-2 text-lg font-semibold text-foreground">
                {model.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {model.description}
              </p>

              <div className="mt-5 space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Max. Dauer</span>
                  <span className="text-foreground">{model.maxDuration}s</span>
                </div>
                <div className="flex justify-between">
                  <span>Auflösungen</span>
                  <span className="text-foreground">
                    {model.supportedResolutions.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Credits/Sek.</span>
                  <span className="text-foreground">
                    {model.creditsPerSecond}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
