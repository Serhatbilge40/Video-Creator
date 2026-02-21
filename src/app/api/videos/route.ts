import { NextRequest, NextResponse } from "next/server";
import type { GenerationParams, VideoGeneration } from "@/lib/types";

// In-memory store for demo purposes
// In production, use a database (Prisma + Supabase/PostgreSQL)
const videos: VideoGeneration[] = [];

export async function GET() {
  return NextResponse.json({ videos, total: videos.length });
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerationParams = await request.json();

    if (!body.prompt?.trim()) {
      return NextResponse.json(
        { error: "Prompt ist erforderlich" },
        { status: 400 }
      );
    }

    const newVideo: VideoGeneration = {
      id: crypto.randomUUID(),
      prompt: body.prompt,
      negativePrompt: body.negativePrompt,
      model: body.model || "sora-2-pro",
      resolution: body.resolution || "1080p",
      duration: body.duration || 10,
      aspectRatio: body.aspectRatio || "16:9",
      style: body.style || "cinematic",
      status: "pending",
      createdAt: new Date().toISOString(),
      progress: 0,
    };

    videos.unshift(newVideo);

    // In production: dispatch to the actual AI model API
    // e.g., await openai.videos.generate({ model: "sora-2-pro", prompt: body.prompt, ... })

    return NextResponse.json(newVideo, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Ungültige Anfrage" },
      { status: 400 }
    );
  }
}
