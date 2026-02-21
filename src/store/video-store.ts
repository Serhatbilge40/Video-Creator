import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type VideoGeneration,
  type VideoModel,
  type Resolution,
  type AspectRatio,
  type VideoStyle,
  MODELS,
} from "@/lib/types";
import { useApiKeyStore } from "@/store/api-key-store";

type Provider = "openai" | "google" | "runway" | "kling";

function modelToProvider(model: VideoModel): Provider {
  switch (model) {
    case "sora-2-pro":
      return "openai";
    case "veo-3.1":
      return "google";
    case "runway-gen4":
      return "runway";
    case "kling-2":
      return "kling";
  }
}

interface VideoStore {
  // Generation params
  prompt: string;
  negativePrompt: string;
  model: VideoModel;
  resolution: Resolution;
  duration: number;
  aspectRatio: AspectRatio;
  style: VideoStyle;
  referenceImages: File[];
  storyboard: string[];

  // State
  generations: VideoGeneration[];
  isGenerating: boolean;
  credits: number;
  error: string | null;

  // Actions
  setPrompt: (prompt: string) => void;
  setNegativePrompt: (negativePrompt: string) => void;
  setModel: (model: VideoModel) => void;
  setResolution: (resolution: Resolution) => void;
  setDuration: (duration: number) => void;
  setAspectRatio: (aspectRatio: AspectRatio) => void;
  setStyle: (style: VideoStyle) => void;
  addReferenceImages: (files: File[]) => void;
  removeReferenceImage: (index: number) => void;
  clearReferenceImages: () => void;
  generate: () => void;
  removeGeneration: (id: string) => void;
  clearError: () => void;
  toggleFavorite: (id: string) => void;
  addToStoryboard: (prompt: string) => void;
  removeFromStoryboard: (index: number) => void;
  clearStoryboard: () => void;
  generateStoryboard: () => void;
}

export const useVideoStore = create<VideoStore>()(
  persist(
    (set, get) => ({
      prompt: "",
      negativePrompt: "",
      model: "sora-2-pro",
      resolution: "1080p",
      duration: 10,
      aspectRatio: "16:9",
      style: "cinematic",
      referenceImages: [],
      storyboard: [],

      generations: [],
      isGenerating: false,
      credits: 100,
      error: null,

      setPrompt: (prompt) => set({ prompt }),
      setNegativePrompt: (negativePrompt) => set({ negativePrompt }),
      setModel: (model) => set({ model }),
      setResolution: (resolution) => set({ resolution }),
      setDuration: (duration) => set({ duration }),
      setAspectRatio: (aspectRatio) => set({ aspectRatio }),
      setStyle: (style) => set({ style }),
      addReferenceImages: (files) =>
        set((s) => ({
          referenceImages: [...s.referenceImages, ...files].slice(0, 5), // max 5
        })),
      removeReferenceImage: (index) =>
        set((s) => ({
          referenceImages: s.referenceImages.filter((_, i) => i !== index),
        })),
      clearReferenceImages: () => set({ referenceImages: [] }),
      clearError: () => set({ error: null }),
      addToStoryboard: (prompt) => set((s) => ({ storyboard: [...s.storyboard, prompt] })),
      removeFromStoryboard: (index) => set((s) => ({ storyboard: s.storyboard.filter((_, i) => i !== index) })),
      clearStoryboard: () => set({ storyboard: [] }),

      generate: async () => {
        const state = get();
        const apiKey = useApiKeyStore.getState().getKey(state.model);

        if (!apiKey) {
          set({
            error: `Kein API-Key für ${state.model} hinterlegt. Gehe zu Einstellungen → API Keys.`,
          });
          return;
        }

        const currentModel = MODELS.find((m) => m.id === state.model)!;
        const resolutionMultiplier = state.resolution === "4K" ? 2 : 1;
        const cost = currentModel.creditsPerSecond * state.duration * resolutionMultiplier;

        const newGeneration: VideoGeneration = {
          id: crypto.randomUUID(),
          prompt: state.prompt,
          negativePrompt: state.negativePrompt,
          model: state.model,
          resolution: state.resolution,
          duration: state.duration,
          aspectRatio: state.aspectRatio,
          style: state.style,
          status: "pending",
          createdAt: new Date().toISOString(),
          progress: 0,
          isFavorite: false,
          cost,
        };

        set((s) => ({
          generations: [newGeneration, ...s.generations],
          isGenerating: true,
          error: null,
        }));

        try {
          // 1. Start generation via API route — use FormData if images present
          let res: Response;

          if (state.referenceImages.length > 0) {
            const formData = new FormData();
            formData.append("prompt", state.prompt);
            formData.append("negativePrompt", state.negativePrompt || "");
            formData.append("model", state.model);
            formData.append("resolution", state.resolution);
            formData.append("duration", String(state.duration));
            formData.append("aspectRatio", state.aspectRatio);
            formData.append("style", state.style);
            formData.append("apiKey", apiKey);
            for (const img of state.referenceImages) {
              formData.append("images", img);
            }
            res = await fetch("/api/generate", {
              method: "POST",
              body: formData,
            });
          } else {
            res = await fetch("/api/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                prompt: state.prompt,
                negativePrompt: state.negativePrompt,
                model: state.model,
                resolution: state.resolution,
                duration: state.duration,
                aspectRatio: state.aspectRatio,
                style: state.style,
                apiKey,
              }),
            });
          }

          const data = await res.json();

          if (!res.ok || data.error) {
            throw new Error(data.error || "Generierung fehlgeschlagen");
          }

          // If the API returned a direct video URL (synchronous response)
          if (data.status === "completed" && data.videoUrl) {
            set((s) => ({
              generations: s.generations.map((g) =>
                g.id === newGeneration.id
                  ? {
                    ...g,
                    status: "completed",
                    progress: 100,
                    videoUrl: data.videoUrl,
                  }
                  : g
              ),
              isGenerating: false,
            }));
            return;
          }

          // 2. Async: mark as processing and start polling
          const taskId = data.taskId;
          const provider = data.provider || modelToProvider(state.model);

          set((s) => ({
            generations: s.generations.map((g) =>
              g.id === newGeneration.id
                ? { ...g, status: "processing", progress: 5 }
                : g
            ),
            isGenerating: false, // Free up the UI so user can start another video
          }));

          // 3. Poll for completion
          const maxAttempts = 120; // ~10 min max (5s intervals)
          let attempts = 0;

          const poll = async () => {
            attempts++;
            if (attempts > maxAttempts) {
              set((s) => ({
                generations: s.generations.map((g) =>
                  g.id === newGeneration.id
                    ? { ...g, status: "failed", progress: 0 }
                    : g
                ), // Note: we don't set isGenerating: false here because it was already freed
                error: "Zeitüberschreitung – Generierung dauert zu lange.",
              }));
              return;
            }

            try {
              const pollRes = await fetch("/api/generate/poll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ taskId, provider, apiKey }),
              });

              const pollData = await pollRes.json();

              if (pollData.status === "completed" && pollData.videoUrl) {
                set((s) => ({
                  generations: s.generations.map((g) =>
                    g.id === newGeneration.id
                      ? {
                        ...g,
                        status: "completed",
                        progress: 100,
                        videoUrl: pollData.videoUrl,
                        needsAuth: pollData.needsAuth || false,
                        provider,
                      }
                      : g
                  ),
                }));
                return;
              }

              if (pollData.status === "failed") {
                set((s) => ({
                  generations: s.generations.map((g) =>
                    g.id === newGeneration.id
                      ? { ...g, status: "failed", progress: 0 }
                      : g
                  ),
                  error: pollData.error || "Generierung fehlgeschlagen",
                }));
                return;
              }

              // Still processing — update progress estimate
              const estimatedProgress = Math.min(
                5 + (attempts / maxAttempts) * 90,
                pollData.progress ?? 5 + (attempts / maxAttempts) * 90
              );
              set((s) => ({
                generations: s.generations.map((g) =>
                  g.id === newGeneration.id
                    ? { ...g, progress: Math.round(estimatedProgress) }
                    : g
                ),
              }));

              // Poll again after 5 seconds
              setTimeout(poll, 5000);
            } catch {
              // Network error during poll — retry
              if (attempts < maxAttempts) {
                setTimeout(poll, 5000);
              }
            }
          };

          // Start polling after initial delay
          setTimeout(poll, 3000);
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : "Unbekannter Fehler";
          set((s) => ({
            generations: s.generations.map((g) =>
              g.id === newGeneration.id
                ? { ...g, status: "failed", progress: 0 }
                : g
            ),
            isGenerating: false,
            error: message,
          }));
        }
      },

      generateStoryboard: async () => {
        const state = get();
        if (state.storyboard.length === 0) return;

        // Loop through storyboard and generate
        for (const prompt of state.storyboard) {
          get().setPrompt(prompt);
          // Small delay before triggering generate to ensure Zustand state has settled
          await new Promise(r => setTimeout(r, 100));
          get().generate();
          // Delay to not hammer the API too instantly
          await new Promise(r => setTimeout(r, 1000));
        }

        // Clear storyboard after submitting
        get().clearStoryboard();
      },

      removeGeneration: (id: string) =>
        set((s) => ({
          generations: s.generations.filter((g) => g.id !== id),
        })),
      toggleFavorite: (id: string) =>
        set((s) => ({
          generations: s.generations.map((g) =>
            g.id === id ? { ...g, isFavorite: !g.isFavorite } : g
          ),
        })),
    }),
    {
      name: "sora-video-storage",
      partialize: (state) => ({
        generations: state.generations,
        credits: state.credits,
        storyboard: state.storyboard,
      }), // Save generations, credits, and storyboard
    }
  )
);
