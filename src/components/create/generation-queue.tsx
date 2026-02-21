"use client";

import { useVideoStore } from "@/store/video-store";
import { useApiKeyStore } from "@/store/api-key-store";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
  Download,
  Trash2,
} from "lucide-react";

export function GenerationQueue() {
  const { generations, removeGeneration } = useVideoStore();

  if (generations.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-surface-hover flex items-center justify-center">
          <Clock className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Noch keine Videos generiert. Gib einen Prompt ein und starte die
          Generierung.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">
        Generierungen ({generations.length})
      </h3>
      <div className="space-y-2">
        {generations.map((gen) => (
          <div
            key={gen.id}
            className="rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-surface-hover"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm text-foreground">{gen.prompt}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {gen.model} · {gen.resolution} · {gen.duration}s ·{" "}
                  {gen.style}
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 shrink-0">
                {gen.status === "pending" && (
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    Wartend
                  </span>
                )}
                {gen.status === "processing" && (
                  <span className="flex items-center gap-1.5 text-xs text-accent">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    {Math.round(gen.progress || 0)}%
                  </span>
                )}
                {gen.status === "completed" && (
                  <span className="flex items-center gap-1.5 text-xs text-success">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Fertig
                  </span>
                )}
                {gen.status === "failed" && (
                  <span className="flex items-center gap-1.5 text-xs text-danger">
                    <XCircle className="h-3.5 w-3.5" />
                    Fehlgeschlagen
                  </span>
                )}
              </div>
            </div>

            {/* Progress bar */}
            {(gen.status === "processing" || gen.status === "pending") && (
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-hover">
                <div
                  className={cn(
                    "relative h-full rounded-full transition-all duration-500",
                    gen.status === "processing"
                      ? "bg-accent progress-shimmer"
                      : "bg-muted-foreground"
                  )}
                  style={{ width: `${gen.progress || 0}%` }}
                />
              </div>
            )}

            {/* Completed actions */}
            {gen.status === "completed" && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={async () => {
                    try {
                      if (!gen.videoUrl) {
                        alert("Keine Video-URL vorhanden.");
                        return;
                      }

                      let blobUrl: string;

                      if (gen.needsAuth) {
                        // Use server proxy for auth-required URLs
                        const apiKey = useApiKeyStore.getState().getKey(gen.model);
                        const proxyRes = await fetch("/api/generate/download", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            videoUrl: gen.videoUrl,
                            apiKey,
                            provider: gen.provider,
                          }),
                        });
                        if (!proxyRes.ok) throw new Error("Download fehlgeschlagen");
                        const blob = await proxyRes.blob();
                        blobUrl = URL.createObjectURL(blob);
                      } else {
                        const res = await fetch(gen.videoUrl);
                        const blob = await res.blob();
                        blobUrl = URL.createObjectURL(blob);
                      }

                      const a = document.createElement("a");
                      a.href = blobUrl;
                      a.download = `sora-video-${gen.id.slice(0, 8)}.mp4`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(blobUrl);
                    } catch {
                      if (gen.videoUrl) {
                        window.open(gen.videoUrl, "_blank");
                      } else {
                        alert("Download fehlgeschlagen.");
                      }
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-accent/[0.1] px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/[0.2] transition-colors"
                >
                  <Download className="h-3 w-3" />
                  Download
                </button>
                <button
                  onClick={() => removeGeneration(gen.id)}
                  className="flex items-center gap-1.5 rounded-lg bg-surface-hover px-3 py-1.5 text-xs text-muted-foreground hover:text-danger hover:bg-danger/[0.1] transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  Entfernen
                </button>
                <span className="ml-auto text-xs text-muted-foreground">
                  {formatDate(gen.createdAt)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
