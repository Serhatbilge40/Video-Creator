"use client";

import { useVideoStore } from "@/store/video-store";
import { ImagePlus, X, Image as ImageIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";

export function ImageUpload() {
  const { referenceImages, addReferenceImages, removeReferenceImage } =
    useVideoStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const validFiles = Array.from(files).filter(
        (f) =>
          f.type === "image/jpeg" ||
          f.type === "image/png" ||
          f.type === "image/webp"
      );
      if (validFiles.length > 0) {
        addReferenceImages(validFiles);
      }
    },
    [addReferenceImages]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className="space-y-3">
      <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
        <ImageIcon className="h-4 w-4 text-accent" />
        Referenzbilder
        <span className="text-muted-foreground font-normal">(optional)</span>
      </label>
      <p className="text-xs text-muted-foreground -mt-2">
        Lade Bilder hoch, die als Referenz für das Video dienen (z.B. als erstes
        Frame). Max. 5 Bilder, JPG/PNG/WebP.
      </p>

      {/* Upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors ${
          isDragging
            ? "border-accent bg-accent/[0.05]"
            : "border-border hover:border-accent/50 hover:bg-surface-hover"
        }`}
      >
        <ImagePlus
          className={`h-8 w-8 ${isDragging ? "text-accent" : "text-muted-foreground"}`}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          {isDragging ? "Loslassen zum Hochladen" : "Klicken oder hierher ziehen"}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground/60">
          JPG, PNG, WebP · max. 5 Bilder
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Preview grid */}
      {referenceImages.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {referenceImages.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-surface"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="h-full w-full object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeReferenceImage(index);
                }}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-danger"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1 py-0.5 text-[10px] text-white truncate">
                {file.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
