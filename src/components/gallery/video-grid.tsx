"use client";

import { useState } from "react";
import { VideoCard } from "./video-card";
import { cn } from "@/lib/utils";
import { useVideoStore } from "@/store/video-store";
import type { VideoGeneration } from "@/lib/types";

// Demo data
const DEMO_VIDEOS: VideoGeneration[] = [
  {
    id: "1",
    prompt: "Ein majestätischer Drache fliegt über schneebedeckte Berge im Sonnenuntergang, cinematic lighting",
    model: "sora-2-pro",
    resolution: "4K",
    duration: 15,
    aspectRatio: "16:9",
    style: "cinematic",
    status: "completed",
    thumbnailUrl: "https://picsum.photos/seed/dragon/640/360",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    prompt: "Futuristische Stadt bei Nacht mit Neonlichtern und fliegenden Autos, cyberpunk aesthetics",
    model: "veo-3.1",
    resolution: "1080p",
    duration: 10,
    aspectRatio: "16:9",
    style: "cinematic",
    status: "completed",
    thumbnailUrl: "https://picsum.photos/seed/neon-city/640/360",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    prompt: "Unterwasser-Szene mit biolumineszenten Quallen im tiefen Ozean, mysteriöses blaues Licht",
    model: "runway-gen4",
    resolution: "1080p",
    duration: 10,
    aspectRatio: "16:9",
    style: "realistic",
    status: "completed",
    thumbnailUrl: "https://picsum.photos/seed/jellyfish/640/360",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    prompt: "Astronaut schwebt durch eine surreale Galaxie voller bunter Nebel, Zeitlupe",
    model: "sora-2-pro",
    resolution: "4K",
    duration: 20,
    aspectRatio: "16:9",
    style: "cinematic",
    status: "completed",
    thumbnailUrl: "https://picsum.photos/seed/astronaut/640/360",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    prompt: "Makroaufnahme eines taubedeckten Schmetterlingsflügels im warmen Morgenlicht",
    model: "veo-3.1",
    resolution: "4K",
    duration: 5,
    aspectRatio: "16:9",
    style: "realistic",
    status: "completed",
    thumbnailUrl: "https://picsum.photos/seed/butterfly/640/360",
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    prompt: "Zeitraffer einer Blume, die in einem verlassenen Gebäude aufblüht, warmes natürliches Licht",
    model: "kling-2",
    resolution: "1080p",
    duration: 10,
    aspectRatio: "16:9",
    style: "realistic",
    status: "completed",
    thumbnailUrl: "https://picsum.photos/seed/flower/640/360",
    createdAt: new Date().toISOString(),
  },
];

const FILTERS = ["Alle", "Favoriten", "sora-2-pro", "veo-3.1", "runway-gen4", "kling-2"];

export function VideoGrid() {
  const [filter, setFilter] = useState("Alle");
  const storeGenerations = useVideoStore((s) => s.generations);

  const allVideos = [...storeGenerations, ...DEMO_VIDEOS.filter(dv => !storeGenerations.some(sg => sg.id === dv.id))];

  const filteredVideos = allVideos.filter((v) => {
    if (filter === "Alle") return true;
    if (filter === "Favoriten") return v.isFavorite;
    return v.model === filter;
  });

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex flex-wrap gap-1 p-1 bg-surface border border-border rounded-lg w-full sm:w-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                filter === f
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              )}
            >
              {f === "Alle" ? f : f.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 space-y-6">
        {filteredVideos.map((video, i) => (
          <div key={video.id} className="break-inside-avoid">
            <VideoCard video={video} index={i} />
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Keine Videos mit diesem Filter gefunden.
        </div>
      )}
    </div>
  );
}
