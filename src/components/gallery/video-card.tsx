"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Download,
  Monitor,
  Sparkles,
  Heart,
  Loader2,
} from "lucide-react";
import { useVideoStore } from "@/store/video-store";
import { cn } from "@/lib/utils";
import type { VideoGeneration } from "@/lib/types";

interface VideoCardProps {
  video: VideoGeneration;
  index: number;
}

export function VideoCard({ video, index }: VideoCardProps) {
  const toggleFavorite = useVideoStore((s) => s.toggleFavorite);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (video.videoUrl) {
      setIsPlaying(true);
    } else {
      // Show default browser "playing" behavior or error if no URL
      alert("Es wurde keine gültige Video-URL für diesen Clip gefunden.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-lg border border-border bg-surface transition-all duration-200 hover:-translate-y-1 hover:border-muted-foreground/50 hover:shadow-md"
    >
      {/* Thumbnail or Player */}
      <div className="relative aspect-video overflow-hidden bg-black flex items-center justify-center">
        {isPlaying && video.videoUrl ? (
          <video
            src={video.videoUrl}
            autoPlay
            controls
            className="h-full w-full object-contain"
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          <>
            <img
              src={video.thumbnailUrl || `https://picsum.photos/seed/${video.id}/640/360`}
              alt={video.prompt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Status overlay */}
            {video.status === "completed" ? (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                onClick={handlePlay}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-foreground/90 backdrop-blur-sm">
                  <Play className="h-5 w-5 text-white" fill="white" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                <Loader2 className="h-8 w-8 animate-spin text-white mb-2" />
                <span className="text-white text-xs font-medium">
                  {video.status === "failed" ? "Fehlgeschlagen" : `Generiert... ${video.progress}%`}
                </span>
              </div>
            )}
            {/* Duration badge */}
            {!isPlaying && (
              <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                {video.duration}s
              </div>
            )}
            {!isPlaying && (
              <div className="absolute left-3 top-3 rounded-md bg-foreground px-2 py-1 text-xs font-medium tracking-wide text-background shadow-sm">
                {video.model}
              </div>
            )}

            {/* Favorite Button */}
            {!isPlaying && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(video.id);
                }}
                className={cn(
                  "absolute right-3 top-3 rounded-md p-1.5 transition-colors z-10",
                  video.isFavorite
                    ? "bg-danger/10 text-danger hover:bg-danger/20"
                    : "bg-surface/80 text-muted-foreground hover:bg-surface hover:text-foreground backdrop-blur-sm"
                )}
              >
                <Heart className="h-4 w-4" fill={video.isFavorite ? "currentColor" : "none"} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <p className="line-clamp-2 text-sm font-medium text-foreground/90 leading-relaxed">
          {video.prompt}
        </p>
        <div className="mt-4 flex items-end justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground/80">
            <span className="flex items-center gap-1.5 bg-surface-hover/50 px-2 py-1 rounded-md">
              <Monitor className="h-3.5 w-3.5" />
              {video.resolution}
            </span>
            <span className="flex items-center gap-1.5 bg-surface-hover/50 px-2 py-1 rounded-md">
              <Sparkles className="h-3.5 w-3.5" />
              {video.style}
            </span>
          </div>

          {video.cost && (
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-xs font-semibold text-foreground/80">Verbraucht: {video.cost} Credits</span>
              <span className="text-[10px] text-muted-foreground">≈ ${(video.cost * 0.01).toFixed(2)} USD</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={handlePlay}
            disabled={video.status !== "completed"}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-foreground py-2 text-xs font-medium text-background hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="h-3.5 w-3.5" />
            {isPlaying ? "Läuft..." : "Abspielen"}
          </button>
          <a
            href={video.videoUrl}
            download={`sora_creator_${video.id}.mp4`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (video.status !== "completed" || !video.videoUrl) e.preventDefault();
            }}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md border border-border bg-surface py-2 text-xs font-medium text-foreground transition-all",
              video.status === "completed" && video.videoUrl
                ? "hover:bg-surface-hover"
                : "opacity-50 cursor-not-allowed"
            )}
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </a>
        </div>
      </div>
    </motion.div>
  );
}
