"use client";

import { PromptEditor } from "@/components/create/prompt-editor";
import { ModelSelector } from "@/components/create/model-selector";
import { ParameterPanel } from "@/components/create/parameter-panel";
import { GenerateButton } from "@/components/create/generate-button";
import { GenerationQueue } from "@/components/create/generation-queue";

export default function CreatePage() {
  return (
    <div className="mx-auto max-w-7xl overflow-hidden px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Video erstellen</h1>
        <p className="mt-1 text-sm text-muted">
          Beschreibe dein Video, wähle ein Modell und passe die Parameter an.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
        {/* Left column: Prompt + Queue */}
        <div className="min-w-0 space-y-8">
          {/* Prompt section */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <PromptEditor />
          </div>

          {/* Generation queue */}
          <GenerationQueue />
        </div>

        {/* Right column: Model + Parameters + Generate */}
        <div className="space-y-6">
          {/* Model selector */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <ModelSelector />
          </div>

          {/* Parameters */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <ParameterPanel />
          </div>

          {/* Generate button */}
          <GenerateButton />
        </div>
      </div>
    </div>
  );
}
