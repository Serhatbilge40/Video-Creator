import { NextRequest, NextResponse } from "next/server";
import type { VideoModel, Resolution, AspectRatio, VideoStyle } from "@/lib/types";
import sharp from "sharp";

interface GenerateRequest {
  prompt: string;
  negativePrompt?: string;
  model: VideoModel;
  resolution: Resolution;
  duration: number;
  aspectRatio: AspectRatio;
  style: VideoStyle;
  apiKey: string;
  images?: File[]; // reference images
}

// Map resolution + aspect ratio to Sora-supported sizes
// Sora supports: 720x1280, 1280x720, 1024x1792, 1792x1024
function soraSize(aspectRatio: AspectRatio): string {
  switch (aspectRatio) {
    case "16:9": return "1280x720";
    case "9:16": return "720x1280";
    case "1:1": return "1280x720"; // Sora has no 1:1, default to landscape
  }
}

// Snap duration to Sora-allowed values: "4", "8", "12"
function soraDuration(seconds: number): string {
  if (seconds <= 4) return "4";
  if (seconds <= 8) return "8";
  return "12";
}

// Style-Beschreibungen für den Prompt
const STYLE_PROMPTS: Record<string, string> = {
  cinematic: "Cinematic style, film-like color grading, dramatic lighting, shallow depth of field.",
  realistic: "Photorealistic, natural lighting, true to life, documentary-style.",
  anime: "Anime style, Japanese animation aesthetic, vibrant colors, expressive characters.",
  abstract: "Abstract art style, surreal, creative visual effects, non-representational.",
  "3d-render": "3D rendered, CGI quality, polished surfaces, studio lighting.",
  watercolor: "Watercolor painting aesthetic, soft blended colors, artistic brush strokes.",
};

// Translate + optimize prompt for video generation via GPT-4o
async function optimizePrompt(
  userPrompt: string,
  negativePrompt: string | undefined,
  style: string,
  apiKey: string,
  hasImages: boolean
): Promise<string> {
  const styleHint = STYLE_PROMPTS[style] || "";

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a video prompt engineer for AI video generation (Sora, Veo, Runway).
Your job: take the user's video description (in any language) and rewrite it as a detailed, English video generation prompt.

Rules:
- ALWAYS output in English, no matter the input language
- Be very specific about: camera angle, movement, lighting, subject actions, environment, mood
- Include the visual style: ${styleHint}
${negativePrompt ? `- The video must NOT contain: ${negativePrompt}` : ""}
- Keep it under 500 characters
- Output ONLY the prompt, nothing else`,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      console.warn("[optimizePrompt] GPT call failed, using original prompt");
      return buildFallbackPrompt(userPrompt, negativePrompt, style, hasImages);
    }

    const data = await res.json();
    const optimized = data.choices?.[0]?.message?.content?.trim();

    if (optimized && optimized.length > 10) {
      console.log("[optimizePrompt] Optimized:", optimized);
      return optimized;
    }
  } catch (e) {
    console.warn("[optimizePrompt] Error:", e);
  }

  return buildFallbackPrompt(userPrompt, negativePrompt, style, hasImages);
}

// Fallback if GPT optimization fails
function buildFallbackPrompt(
  prompt: string,
  negativePrompt: string | undefined,
  style: string,
  hasImages: boolean = false
): string {
  let enhanced = prompt;
  const styleHint = STYLE_PROMPTS[style];
  if (styleHint) {
    enhanced = `${enhanced}\n\nVisual style: ${styleHint}`;
  }
  if (negativePrompt?.trim()) {
    enhanced = `${enhanced}\n\nAvoid the following: ${negativePrompt.trim()}`;
  }
  if (hasImages) {
    enhanced = `${enhanced}\n\n[CRITICAL INSTRUCTION: The user has provided a reference image. Explicitly describe that the video should start from or heavily feature the visual elements of the provided reference image.]`;
  }
  return enhanced;
}

// ─── OpenAI Sora ────────────────────────────────────────────
async function generateWithSora(params: GenerateRequest) {
  const size = soraSize(params.aspectRatio);
  const seconds = soraDuration(params.duration);
  const model = params.model === "sora-2-pro" ? "sora-2-pro" : "sora-2";

  // Optimize & translate prompt to English via GPT-4o-mini
  const optimizedPrompt = await optimizePrompt(
    params.prompt,
    params.negativePrompt,
    params.style,
    params.apiKey,
    !!params.images?.length
  );

  console.log("[Sora] Request:", { model, size, seconds, prompt: optimizedPrompt, hasImages: !!(params.images?.length) });

  let res: Response;

  if (params.images && params.images.length > 0) {
    // Resize image to match Sora's required dimensions
    const [widthStr, heightStr] = size.split("x");
    const targetWidth = parseInt(widthStr);
    const targetHeight = parseInt(heightStr);

    const originalFile = params.images[0];
    const arrayBuffer = await originalFile.arrayBuffer();
    const resizedBuffer = await sharp(Buffer.from(arrayBuffer))
      .resize(targetWidth, targetHeight, { fit: "cover" })
      .jpeg({ quality: 90 })
      .toBuffer();

    const resizedBlob = new Blob([new Uint8Array(resizedBuffer)], { type: "image/jpeg" });
    const resizedFile = new File([resizedBlob], "reference.jpg", { type: "image/jpeg" });

    console.log(`[Sora] Resized image to ${targetWidth}x${targetHeight}`);

    // Use multipart/form-data when we have reference images
    const formData = new FormData();
    formData.append("model", model);
    formData.append("prompt", optimizedPrompt);
    formData.append("size", size);
    formData.append("seconds", seconds);
    formData.append("input_reference", resizedFile);

    res = await fetch("https://api.openai.com/v1/videos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
      },
      body: formData,
    });
  } else {
    // JSON request without images
    res = await fetch("https://api.openai.com/v1/videos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt: optimizedPrompt,
        size,
        seconds,
      }),
    });
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || `OpenAI API Fehler: ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json();
  console.log("[Sora] Response:", data);

  // Sora always returns an async job — poll GET /v1/videos/{id}
  return {
    taskId: data.id,
    status: "processing" as const,
    provider: "openai",
  };
}

// ─── Google Veo 3.1 ───────────────────────────────────────────
async function generateWithVeo(params: GenerateRequest) {
  // Google Veo 3.1 via Gemini / Vertex AI endpoint
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/veo-3.1:generateVideo?key=${params.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: buildFallbackPrompt(params.prompt, params.negativePrompt, params.style, !!params.images?.length),
        videoConfig: {
          aspectRatio: params.aspectRatio,
          durationSeconds: params.duration,
          resolution: params.resolution,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || `Google API Fehler: ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json();

  if (data.video?.uri) {
    return { videoUrl: data.video.uri, status: "completed" as const };
  }

  return {
    taskId: data.name || data.operationId,
    status: "processing" as const,
    provider: "google",
  };
}

// ─── Runway Gen-4 ───────────────────────────────────────────
async function generateWithRunway(params: GenerateRequest) {
  const res = await fetch("https://api.runwayml.com/v1/video/generate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      "Content-Type": "application/json",
      "X-Runway-Version": "2024-11-06",
    },
    body: JSON.stringify({
      model: "gen4",
      prompt: buildFallbackPrompt(params.prompt, params.negativePrompt, params.style, !!params.images?.length),
      duration: params.duration,
      ratio: params.aspectRatio,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || `Runway API Fehler: ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json();
  return {
    taskId: data.id || data.taskId,
    status: "processing" as const,
    provider: "runway",
  };
}

// ─── Kling 2.0 ──────────────────────────────────────────────
async function generateWithKling(params: GenerateRequest) {
  const res = await fetch(
    "https://api.klingai.com/v1/videos/text2video",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model_name: "kling-v2",
        prompt: buildFallbackPrompt(params.prompt, params.negativePrompt, params.style, !!params.images?.length),
        negative_prompt: params.negativePrompt || "",
        duration: String(params.duration),
        aspect_ratio: params.aspectRatio,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error?.message ||
      err?.message ||
      `Kling API Fehler: ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json();
  return {
    taskId: data.data?.task_id || data.task_id || data.id,
    status: "processing" as const,
    provider: "kling",
  };
}

// ─── Main handler ────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    let body: GenerateRequest;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // Parse FormData (with images)
      const formData = await req.formData();
      const imageFiles = formData.getAll("images") as File[];

      body = {
        prompt: formData.get("prompt") as string,
        negativePrompt: (formData.get("negativePrompt") as string) || "",
        model: formData.get("model") as VideoModel,
        resolution: formData.get("resolution") as Resolution,
        duration: Number(formData.get("duration")),
        aspectRatio: formData.get("aspectRatio") as AspectRatio,
        style: formData.get("style") as VideoStyle,
        apiKey: formData.get("apiKey") as string,
        images: imageFiles.length > 0 ? imageFiles : undefined,
      };
    } else {
      // Parse JSON (no images)
      body = await req.json();
    }

    if (!body.apiKey) {
      return NextResponse.json(
        { error: "Kein API-Key angegeben. Bitte unter API Keys hinterlegen." },
        { status: 400 }
      );
    }

    if (!body.prompt?.trim()) {
      return NextResponse.json(
        { error: "Kein Prompt angegeben." },
        { status: 400 }
      );
    }

    let result;

    switch (body.model) {
      case "sora-2-pro":
        result = await generateWithSora(body);
        break;
      case "veo-3.1":
        result = await generateWithVeo(body);
        break;
      case "runway-gen4":
        result = await generateWithRunway(body);
        break;
      case "kling-2":
        result = await generateWithKling(body);
        break;
      default:
        return NextResponse.json(
          { error: `Unbekanntes Modell: ${body.model}` },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unbekannter Fehler";
    console.error("[API /generate] Error:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
