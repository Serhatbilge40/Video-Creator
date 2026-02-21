"use client";

import { useVideoStore } from "@/store/video-store";
import { MODELS, STYLES, type Resolution, type AspectRatio } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Monitor, Clock, RatioIcon, Sparkles } from "lucide-react";

export function ParameterPanel() {
  const {
    model,
    resolution,
    setResolution,
    duration,
    setDuration,
    aspectRatio,
    setAspectRatio,
    style,
    setStyle,
  } = useVideoStore();

  const currentModel = MODELS.find((m) => m.id === model)!;

  const resolutions: Resolution[] = ["720p", "1080p", "4K"];
  const aspectRatios: AspectRatio[] = ["16:9", "9:16", "1:1"];
  const durations = [5, 10, 15, 20, 30, 60].filter(
    (d) => d <= currentModel.maxDuration
  );

  return (
    <div className="space-y-6">
      {/* Resolution */}
      <div>
        <label className="mb-2.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Monitor className="h-4 w-4 text-muted-foreground" />
          Auflösung
        </label>
        <div className="flex gap-2">
          {resolutions.map((r) => {
            const isSupported = currentModel.supportedResolutions.includes(r);
            return (
              <button
                key={r}
                onClick={() => isSupported && setResolution(r)}
                disabled={!isSupported}
                className={cn(
                  "flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                  resolution === r
                    ? "border-foreground bg-accent/5 text-foreground ring-1 ring-foreground"
                    : isSupported
                      ? "border-border bg-surface text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
                      : "cursor-not-allowed border-border border-dashed bg-surface/50 text-muted-foreground/30"
                )}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="mb-2.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Dauer
        </label>
        <div className="flex flex-wrap gap-2">
          {durations.map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                duration === d
                  ? "border-foreground bg-accent/5 text-foreground ring-1 ring-foreground"
                  : "border-border bg-surface text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
              )}
            >
              {d}s
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio */}
      <div>
        <label className="mb-2.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
          <RatioIcon className="h-4 w-4 text-muted-foreground" />
          Seitenverhältnis
        </label>
        <div className="flex gap-2">
          {aspectRatios.map((ar) => {
            const isSupported =
              currentModel.supportedAspectRatios.includes(ar);
            return (
              <button
                key={ar}
                onClick={() => isSupported && setAspectRatio(ar)}
                disabled={!isSupported}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                  aspectRatio === ar
                    ? "border-foreground bg-accent/5 text-foreground ring-1 ring-foreground"
                    : isSupported
                      ? "border-border bg-surface text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
                      : "cursor-not-allowed border-border border-dashed bg-surface/50 text-muted-foreground/30"
                )}
              >
                <span
                  className={cn(
                    "rounded-sm border",
                    ar === "16:9" && "h-3 w-5",
                    ar === "9:16" && "h-5 w-3",
                    ar === "1:1" && "h-4 w-4",
                    aspectRatio === ar
                      ? "border-foreground"
                      : "border-muted-foreground/50"
                  )}
                />
                {ar}
              </button>
            );
          })}
        </div>
      </div>

      {/* Style */}
      <div>
        <label className="mb-2.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          Style
        </label>
        <div className="grid grid-cols-3 gap-2">
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-md border px-3 py-3 text-sm transition-colors",
                style === s.id
                  ? "border-foreground bg-accent/5 text-foreground ring-1 ring-foreground"
                  : "border-border bg-surface text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
              )}
            >
              <span className="text-base">{s.icon}</span>
              <div className="mt-1 text-xs font-medium">{s.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
