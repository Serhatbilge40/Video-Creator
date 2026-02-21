"use client";

import { useVideoStore } from "@/store/video-store";
import { MODELS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function ModelSelector() {
  const { model, setModel } = useVideoStore();

  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-foreground">
        KI-Modell
      </label>
      <div className="grid gap-2 sm:grid-cols-2">
        {MODELS.map((m) => {
          const isSelected = model === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setModel(m.id)}
              className={cn(
                "relative rounded-md border p-4 text-left transition-colors",
                isSelected
                  ? "border-foreground bg-accent/5 ring-1 ring-foreground"
                  : "border-border bg-surface hover:border-muted-foreground/50"
              )}
            >
              {isSelected && (
                <div className="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-sm bg-foreground">
                  <Check className="h-3 w-3 text-background" />
                </div>
              )}
              {m.badge && (
                <span className="mb-2 inline-block rounded-sm bg-accent/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-foreground ring-1 ring-border">
                  {m.badge}
                </span>
              )}
              <div className="text-xs font-medium text-muted-foreground/80">{m.provider}</div>
              <div className="mt-1 text-sm font-bold text-foreground">
                {m.name}
              </div>
              <div className="mt-2 flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                <span className="bg-surface border border-border px-2 py-0.5 rounded-sm">Max {m.maxDuration}s</span>
                <span className="bg-surface border border-border px-2 py-0.5 rounded-sm">{m.creditsPerSecond} Cr/s</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
