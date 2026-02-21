"use client";

import { VideoGrid } from "@/components/gallery/video-grid";

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Meine Videos</h1>
        <p className="mt-1 text-sm text-muted">
          Alle generierten Videos auf einen Blick. Filtere nach Modell oder lade
          Videos herunter.
        </p>
      </div>

      <VideoGrid />
    </div>
  );
}
