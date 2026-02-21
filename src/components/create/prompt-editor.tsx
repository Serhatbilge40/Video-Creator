"use client";

import { useVideoStore } from "@/store/video-store";
import { PROMPT_SUGGESTIONS } from "@/lib/types";
import { Lightbulb, RotateCcw, Wand2, Plus, GripVertical, X } from "lucide-react";
import { ImageUpload } from "@/components/create/image-upload";

export function PromptEditor() {
  const { prompt, setPrompt, negativePrompt, setNegativePrompt, storyboard, addToStoryboard, removeFromStoryboard } =
    useVideoStore();

  const handleEnhance = () => {
    if (!prompt.trim()) return;
    const enhancements = " cinematic lighting, highly detailed, 8k resolution, photorealistic, masterpiece, depth of field, sharp focus, dramatic lighting";
    setPrompt(prompt.trim() + enhancements);
  };

  const handleAddToStoryboard = () => {
    if (!prompt.trim()) return;
    addToStoryboard(prompt.trim());
    setPrompt(""); // Clear prompt after adding to storyboard
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

        {/* Storyboard Add Button */}
        {prompt.trim() && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleAddToStoryboard}
              className="flex items-center gap-1.5 rounded-md bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition-all font-sans"
            >
              <Plus className="h-3.5 w-3.5" />
              Zum Storyboard hinzufügen
            </button>
          </div>
        )}
      </div>

      {/* Storyboard Queue Visualizer */}
      {storyboard.length > 0 && (
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
          <h3 className="mb-3 text-xs font-semibold text-accent uppercase tracking-wider flex items-center gap-2">
            🎞️ Storyboard Modus ({storyboard.length} Szenen)
          </h3>
          <div className="space-y-2">
            {storyboard.map((scene, index) => (
              <div key={index} className="group relative flex items-start gap-3 rounded-md bg-surface p-3 border border-border/50 text-sm">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[10px] font-bold text-accent">
                  {index + 1}
                </div>
                <p className="flex-1 text-foreground/90 line-clamp-3 leading-snug">
                  {scene}
                </p>
                <button
                  onClick={() => removeFromStoryboard(index)}
                  className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-danger"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
