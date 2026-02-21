"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  RefreshCw,
  Share2,
  Monitor,
  Clock,
  Sparkles,
  Calendar,
  RatioIcon,
} from "lucide-react";

// Demo data for the detail page
const demoVideo = {
  id: "1",
  prompt:
    "Ein majestätischer Drache fliegt über schneebedeckte Berge im Sonnenuntergang, cinematic lighting, epic wide shot, 8K quality",
  negativePrompt: "low quality, blurry, distorted",
  model: "Sora 2 Pro",
  resolution: "4K",
  duration: 15,
  aspectRatio: "16:9",
  style: "Cinematic",
  status: "completed",
  thumbnailUrl: "https://picsum.photos/seed/dragon/1280/720",
  createdAt: "2026-02-19T10:30:00Z",
};

export default function VideoDetailPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Back */}
      <Link
        href="/gallery"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zur Galerie
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-border bg-black"
        >
          <div className="relative aspect-video">
            <img
              src={demoVideo.thumbnailUrl}
              alt={demoVideo.prompt}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform hover:scale-110">
                <svg
                  className="ml-1 h-7 w-7 text-white"
                  fill="white"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Info panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors">
              <Download className="h-4 w-4" />
              Download MP4
            </button>
            <button className="rounded-xl border border-border bg-surface p-2.5 text-muted hover:text-foreground hover:bg-surface-hover transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          {/* Metadata */}
          <div className="rounded-2xl border border-border bg-surface p-5 space-y-3">
            <h3 className="text-sm font-medium text-foreground">Details</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                  Modell
                </span>
                <span className="text-foreground">{demoVideo.model}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Monitor className="h-3.5 w-3.5" />
                  Auflösung
                </span>
                <span className="text-foreground">{demoVideo.resolution}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Dauer
                </span>
                <span className="text-foreground">{demoVideo.duration}s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <RatioIcon className="h-3.5 w-3.5" />
                  Format
                </span>
                <span className="text-foreground">
                  {demoVideo.aspectRatio}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                  Style
                </span>
                <span className="text-foreground">{demoVideo.style}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Erstellt
                </span>
                <span className="text-foreground">19.02.2026</span>
              </div>
            </div>
          </div>

          {/* Re-generate */}
          <Link
            href="/create"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface-hover transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Neu generieren
          </Link>
        </motion.div>
      </div>

      {/* Prompt section below */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 rounded-2xl border border-border bg-surface p-6"
      >
        <h3 className="mb-2 text-sm font-medium text-foreground">Prompt</h3>
        <p className="text-sm leading-relaxed text-muted">{demoVideo.prompt}</p>
        {demoVideo.negativePrompt && (
          <>
            <h3 className="mb-2 mt-4 text-sm font-medium text-muted-foreground">
              Negative Prompt
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {demoVideo.negativePrompt}
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
