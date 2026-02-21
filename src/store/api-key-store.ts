import { create } from "zustand";
import type { VideoModel } from "@/lib/types";

export interface ApiKeyEntry {
  model: VideoModel;
  label: string;
  provider: string;
  key: string;
  isValid: boolean | null; // null = not yet validated
}

interface ApiKeyStore {
  keys: ApiKeyEntry[];
  setKey: (model: VideoModel, key: string) => void;
  removeKey: (model: VideoModel) => void;
  getKey: (model: VideoModel) => string | null;
  hasKey: (model: VideoModel) => boolean;
  initialize: () => void;
}

const DEFAULT_KEYS: ApiKeyEntry[] = [
  {
    model: "sora-2-pro",
    label: "Sora 2 Pro",
    provider: "OpenAI",
    key: "",
    isValid: null,
  },
  {
    model: "veo-3.1",
    label: "Veo 3.1",
    provider: "Google DeepMind",
    key: "",
    isValid: null,
  },
  {
    model: "runway-gen4",
    label: "Runway Gen-4",
    provider: "Runway",
    key: "",
    isValid: null,
  },
  {
    model: "kling-2",
    label: "Kling 2.0",
    provider: "Kuaishou",
    key: "",
    isValid: null,
  },
];

export const useApiKeyStore = create<ApiKeyStore>((set, get) => ({
  keys: DEFAULT_KEYS,

  setKey: (model, key) => {
    set((s) => ({
      keys: s.keys.map((k) =>
        k.model === model ? { ...k, key, isValid: key.length > 0 ? null : null } : k
      ),
    }));
    // Persist to localStorage
    const allKeys = get().keys.map((k) =>
      k.model === model ? { ...k, key } : k
    );
    const stored = Object.fromEntries(
      allKeys.filter((k) => k.key).map((k) => [k.model, k.key])
    );
    localStorage.setItem("sora-api-keys", JSON.stringify(stored));
  },

  removeKey: (model) => {
    set((s) => ({
      keys: s.keys.map((k) =>
        k.model === model ? { ...k, key: "", isValid: null } : k
      ),
    }));
    const allKeys = get().keys;
    const stored = Object.fromEntries(
      allKeys.filter((k) => k.key && k.model !== model).map((k) => [k.model, k.key])
    );
    localStorage.setItem("sora-api-keys", JSON.stringify(stored));
  },

  getKey: (model) => {
    const entry = get().keys.find((k) => k.model === model);
    return entry?.key || null;
  },

  hasKey: (model) => {
    const entry = get().keys.find((k) => k.model === model);
    return Boolean(entry?.key);
  },

  initialize: () => {
    try {
      const raw = localStorage.getItem("sora-api-keys");
      if (raw) {
        const stored = JSON.parse(raw) as Record<string, string>;
        set((s) => ({
          keys: s.keys.map((k) => ({
            ...k,
            key: stored[k.model] || "",
            isValid: stored[k.model] ? null : null,
          })),
        }));
      }
    } catch {
      // Ignore parse errors
    }
  },
}));
