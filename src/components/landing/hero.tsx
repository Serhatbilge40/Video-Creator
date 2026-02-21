"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6">
      {/* Clean grid background to avoid plain starkness while maintaining seriousness */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-accent opacity-[0.05] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <span className="inline-flex flex-row items-center gap-2 rounded-md border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="tracking-wide">Sora 2 Pro & Veo 3.1 Live</span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl font-bold tracking-tight leading-[1.1] sm:text-6xl lg:text-7xl"
        >
          Erstelle Videos mit
          <br className="hidden sm:block" />
          <span className="text-muted-foreground"> künstlicher Intelligenz.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed sm:text-xl"
        >
          Beschreibe deine Vision und lass die fortschrittlichsten KI-Modelle
          dein Video in Sekunden generieren. Hochauflösend, professionell, schnell.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/create"
            className="group flex items-center justify-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:opacity-90 active:scale-95"
          >
            Video erstellen
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/gallery"
            className="flex items-center justify-center gap-2 rounded-md border border-border bg-surface px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-surface-hover active:scale-95"
          >
            <Play className="h-4 w-4" />
            Galerie ansehen
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground sm:gap-12"
        >
          <div>
            <span className="block text-2xl font-semibold text-foreground">4</span>
            KI-Modelle
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <span className="block text-2xl font-semibold text-foreground">4K</span>
            Auflösung
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <span className="block text-2xl font-semibold text-foreground">60s</span>
            Max. Dauer
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <span className="block text-2xl font-semibold text-foreground">6</span>
            Styles
          </div>
        </motion.div>
      </div>
    </section>
  );
}
