"use client";

import { useVideoStore } from "@/store/video-store";
import { useApiKeyStore } from "@/store/api-key-store";
import { MODELS } from "@/lib/types";
import { Sparkles, KeyRound, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function GenerateButton() {
  const { prompt, model, resolution, duration, isGenerating, credits, error, generate, clearError, storyboard, generateStoryboard } =
    useVideoStore();
  const hasKey = useApiKeyStore((s) => s.hasKey(model));

  const currentModel = MODELS.find((m) => m.id === model)!;

  const resolutionMultiplier = resolution === "4K" ? 2 : 1;
  const activePromptCount = storyboard.length > 0 ? storyboard.length : 1;
  const estimatedCost = currentModel.creditsPerSecond * duration * resolutionMultiplier * activePromptCount;

  const canGenerate = (prompt.trim().length > 0 || storyboard.length > 0) && !isGenerating && hasKey;

  const handleGenerateClick = () => {
    if (storyboard.length > 0) {
      generateStoryboard();
    } else {
      generate();
    }
  };

  return (
    <div className="rounded-md border border-border bg-surface p-5 shadow-sm">
      {/* API Key warning */}
      {!hasKey && (
        <div className="mb-3 flex items-start gap-2 rounded-lg bg-warning/[0.1] p-3">
          <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <div className="text-xs">
            <p className="font-medium text-warning">API-Key fehlt</p>
            <p className="mt-0.5 text-muted-foreground">
              Du brauchst einen {currentModel.provider} API-Key für{" "}
              {currentModel.name}.{" "}
              <Link href="/settings" className="text-accent underline">
                Jetzt hinzufügen →
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-3 flex items-start gap-2 rounded-lg bg-danger/[0.1] p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
          <div className="flex-1 text-xs">
            <p className="font-medium text-danger">Fehler</p>
            <p className="mt-0.5 text-muted-foreground">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Modell</span>
        <span className="font-medium text-foreground">
          {currentModel.name}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Geschätzte Kosten</span>
        <span className={cn("font-medium", credits >= estimatedCost ? "text-foreground" : "text-danger")}>
          {estimatedCost} Credits
        </span>
      </div>

      <button
        onClick={handleGenerateClick}
        disabled={!canGenerate}
        className="group relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-md bg-foreground px-4 py-3 text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
      >
        {isGenerating ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Generiere...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            {storyboard.length > 0 ? `Storyboard generieren (${storyboard.length})` : "Video generieren"}
          </>
        )}
      </button>

      {!prompt.trim() && storyboard.length === 0 && hasKey && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Gib zuerst einen Prompt ein
        </p>
      )}
    </div>
  );
}
