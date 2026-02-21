"use client";

import { useVideoStore } from "@/store/video-store";
import { PROMPT_SUGGESTIONS } from "@/lib/types";
import { Lightbulb, RotateCcw, Wand2 } from "lucide-react";
import { ImageUpload } from "@/components/create/image-upload";

export function PromptEditor() {
  const { prompt, setPrompt, negativePrompt, setNegativePrompt } =
    useVideoStore();

  const handleEnhance = () => {
    if (!prompt.trim()) return;
    const enhancements = " cinematic lighting, highly detailed, 8k resolution, photorealistic, masterpiece, depth of field, sharp focus, dramatic lighting";
    setPrompt(prompt.trim() + enhancements);
  };

  return (
    <div className="space-y-4">
      {/* Main prompt */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium text-foreground">
            Prompt
          </label>
          <button
            onClick={handleEnhance}
            disabled={!prompt.trim()}
            className="flex items-center gap-1.5 rounded-md text-xs font-medium text-accent hover:text-accent-hover disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            <Wand2 className="h-3.5 w-3.5" />
            Enhance Prompt
          </button>
        </div>
        <div className="relative group">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Beschreibe das Video, das du generieren möchtest..."
            rows={5}
            className="w-full resize-none rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none transition-colors shadow-sm"
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{prompt.length} / 2000 Zeichen</span>
          {prompt && (
            <button
              onClick={() => setPrompt("")}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Zurücksetzen
            </button>
          )}
        </div>
      </div>

      {/* Negative prompt */}
      <div>
        <label className="mb-2 block text-sm font-medium text-muted">
          Negative Prompt{" "}
          <span className="text-muted-foreground">(optional)</span>
        </label>
        <div className="relative group">
          <textarea
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            placeholder="Was soll NICHT im Video vorkommen..."
            rows={2}
            className="w-full resize-none rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors shadow-sm"
          />
        </div>
      </div>

      {/* Suggestions */}
      <div>
        <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lightbulb className="h-3.5 w-3.5" />
          Prompt-Vorschläge
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {PROMPT_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setPrompt(suggestion)}
              className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors"
            >
              {suggestion.length > 50
                ? suggestion.slice(0, 50) + "..."
                : suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Reference images */}
      <ImageUpload />
    </div>
  );
}
