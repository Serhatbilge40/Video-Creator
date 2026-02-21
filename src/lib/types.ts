export type VideoModel = "sora-2-pro" | "veo-3.1" | "runway-gen4" | "kling-2";

export type VideoStatus = "pending" | "processing" | "completed" | "failed";

export type AspectRatio = "16:9" | "9:16" | "1:1";

export type Resolution = "720p" | "1080p" | "4K";

export type VideoStyle =
  | "cinematic"
  | "realistic"
  | "anime"
  | "abstract"
  | "3d-render"
  | "watercolor";

export interface VideoGeneration {
  id: string;
  prompt: string;
  negativePrompt?: string;
  model: VideoModel;
  resolution: Resolution;
  duration: number; // seconds
  aspectRatio: AspectRatio;
  style: VideoStyle;
  status: VideoStatus;
  videoUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
  progress?: number;
  needsAuth?: boolean; // video URL requires API key auth header
  provider?: string;
  isFavorite?: boolean;
  cost?: number; // Cost in credits
}

export interface ModelInfo {
  id: VideoModel;
  name: string;
  provider: string;
  description: string;
  maxDuration: number;
  supportedResolutions: Resolution[];
  supportedAspectRatios: AspectRatio[];
  creditsPerSecond: number;
  badge?: string;
}

export interface GenerationParams {
  prompt: string;
  negativePrompt: string;
  model: VideoModel;
  resolution: Resolution;
  duration: number;
  aspectRatio: AspectRatio;
  style: VideoStyle;
}

export const MODELS: ModelInfo[] = [
  {
    id: "sora-2-pro",
    name: "Sora 2 Pro",
    provider: "OpenAI",
    description:
      "Höchste Qualität für fotorealistische und kreative Videos mit bis zu 60s Dauer.",
    maxDuration: 60,
    supportedResolutions: ["720p", "1080p", "4K"],
    supportedAspectRatios: ["16:9", "9:16", "1:1"],
    creditsPerSecond: 3,
    badge: "Beliebt",
  },
  {
    id: "veo-3.1",
    name: "Veo 3.1",
    provider: "Google DeepMind",
    description:
      "Googles neuestes Modell mit exzellenter Szenen-Kohärenz und Audio-Generierung.",
    maxDuration: 30,
    supportedResolutions: ["720p", "1080p", "4K"],
    supportedAspectRatios: ["16:9", "9:16", "1:1"],
    creditsPerSecond: 4,
    badge: "Neu",
  },
  {
    id: "runway-gen4",
    name: "Runway Gen-4",
    provider: "Runway",
    description:
      "Stark bei Charakter-Konsistenz und kreativen Übergängen zwischen Szenen.",
    maxDuration: 20,
    supportedResolutions: ["720p", "1080p"],
    supportedAspectRatios: ["16:9", "9:16", "1:1"],
    creditsPerSecond: 2,
  },
  {
    id: "kling-2",
    name: "Kling 2.0",
    provider: "Kuaishou",
    description:
      "Schnelle Generierung mit guter Qualität, ideal für Iterationen und Experimente.",
    maxDuration: 15,
    supportedResolutions: ["720p", "1080p"],
    supportedAspectRatios: ["16:9", "1:1"],
    creditsPerSecond: 1,
  },
];

export const STYLES: { id: VideoStyle; name: string; icon: string }[] = [
  { id: "cinematic", name: "Cinematic", icon: "🎬" },
  { id: "realistic", name: "Realistic", icon: "📷" },
  { id: "anime", name: "Anime", icon: "✨" },
  { id: "abstract", name: "Abstract", icon: "🎨" },
  { id: "3d-render", name: "3D Render", icon: "💎" },
  { id: "watercolor", name: "Watercolor", icon: "🖌️" },
];

export const PROMPT_SUGGESTIONS = [
  "Ein majestätischer Drache fliegt über schneebedeckte Berge im Sonnenuntergang",
  "Makroaufnahme eines taubedeckten Schmetterlingsflügels im Morgenlicht",
  "Futuristische Stadt bei Nacht mit Neonlichtern und fliegenden Autos",
  "Zeitraffer einer Blume, die in einem verlassenen Gebäude aufblüht",
  "Unterwasser-Szene mit biolumineszenten Quallen im tiefen Ozean",
  "Astronaut schwebt durch eine surreale Galaxie voller bunter Nebel",
];
