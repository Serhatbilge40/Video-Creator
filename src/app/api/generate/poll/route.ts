import { NextRequest, NextResponse } from "next/server";

interface PollRequest {
  taskId: string;
  provider: "openai" | "google" | "runway" | "kling";
  apiKey: string;
}

// ─── Poll OpenAI Sora ────────────────────────────────────────
async function pollSora(taskId: string, apiKey: string) {
  // GET /v1/videos/{video_id} — returns job status + progress
  const res = await fetch(
    `https://api.openai.com/v1/videos/${taskId}`,
    {
      headers: { Authorization: `Bearer ${apiKey}` },
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenAI Poll Fehler: ${res.status}`);
  }
  const data = await res.json();
  // Possible statuses: queued, in_progress, completed, failed

  if (data.status === "completed") {
    // Download URL: GET /v1/videos/{id}/content
    return {
      status: "completed" as const,
      videoUrl: `https://api.openai.com/v1/videos/${taskId}/content`,
      needsAuth: true,
    };
  }
  if (data.status === "failed") {
    return {
      status: "failed" as const,
      error: data.error?.message || "Generierung fehlgeschlagen",
    };
  }
  return {
    status: "processing" as const,
    progress: data.progress ?? null,
  };
}

// ─── Poll Google Veo ─────────────────────────────────────────
async function pollVeo(taskId: string, apiKey: string) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${taskId}?key=${apiKey}`
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Google Poll Fehler: ${res.status}`);
  }
  const data = await res.json();

  if (data.done) {
    if (data.error) {
      return { status: "failed" as const, error: data.error.message };
    }
    return {
      status: "completed" as const,
      videoUrl:
        data.response?.video?.uri ||
        data.response?.videos?.[0]?.uri ||
        data.result?.video?.uri,
    };
  }
  return { status: "processing" as const, progress: null };
}

// ─── Poll Runway ─────────────────────────────────────────────
async function pollRunway(taskId: string, apiKey: string) {
  const res = await fetch(
    `https://api.runwayml.com/v1/video/generate/${taskId}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-Runway-Version": "2024-11-06",
      },
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Runway Poll Fehler: ${res.status}`);
  }
  const data = await res.json();

  if (data.status === "SUCCEEDED" || data.status === "completed") {
    return {
      status: "completed" as const,
      videoUrl: data.output?.[0] || data.artifacts?.[0]?.url || data.url,
    };
  }
  if (data.status === "FAILED") {
    return {
      status: "failed" as const,
      error: data.failure || "Generierung fehlgeschlagen",
    };
  }
  return {
    status: "processing" as const,
    progress: data.progress ?? null,
  };
}

// ─── Poll Kling ──────────────────────────────────────────────
async function pollKling(taskId: string, apiKey: string) {
  const res = await fetch(
    `https://api.klingai.com/v1/videos/text2video/${taskId}`,
    {
      headers: { Authorization: `Bearer ${apiKey}` },
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || err?.message || `Kling Poll Fehler: ${res.status}`
    );
  }
  const data = await res.json();
  const task = data.data;

  if (task?.task_status === "succeed") {
    return {
      status: "completed" as const,
      videoUrl:
        task.task_result?.videos?.[0]?.url || task.video_url,
    };
  }
  if (task?.task_status === "failed") {
    return {
      status: "failed" as const,
      error: task.task_status_msg || "Generierung fehlgeschlagen",
    };
  }
  return { status: "processing" as const, progress: null };
}

// ─── Main handler ────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body: PollRequest = await req.json();

    if (!body.taskId || !body.provider || !body.apiKey) {
      return NextResponse.json(
        { error: "Fehlende Parameter" },
        { status: 400 }
      );
    }

    let result;
    switch (body.provider) {
      case "openai":
        result = await pollSora(body.taskId, body.apiKey);
        break;
      case "google":
        result = await pollVeo(body.taskId, body.apiKey);
        break;
      case "runway":
        result = await pollRunway(body.taskId, body.apiKey);
        break;
      case "kling":
        result = await pollKling(body.taskId, body.apiKey);
        break;
      default:
        return NextResponse.json(
          { error: `Unbekannter Provider: ${body.provider}` },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unbekannter Fehler";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
