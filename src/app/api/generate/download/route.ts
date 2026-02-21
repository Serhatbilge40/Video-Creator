import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy download for video content that requires auth headers
 * (e.g., OpenAI GET /v1/videos/{id}/content needs Authorization header)
 */
export async function POST(req: NextRequest) {
  try {
    const { videoUrl, apiKey, provider } = await req.json();

    if (!videoUrl) {
      return NextResponse.json({ error: "Keine Video-URL" }, { status: 400 });
    }

    const headers: Record<string, string> = {};

    if (provider === "openai" && apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const res = await fetch(videoUrl, { headers });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Download fehlgeschlagen: ${res.status}` },
        { status: res.status }
      );
    }

    const blob = await res.blob();
    const arrayBuffer = await blob.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": blob.type || "video/mp4",
        "Content-Disposition": 'attachment; filename="sora-video.mp4"',
        "Content-Length": String(arrayBuffer.byteLength),
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unbekannter Fehler";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
