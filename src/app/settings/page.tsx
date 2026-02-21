"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useApiKeyStore } from "@/store/api-key-store";
import {
  Key,
  Eye,
  EyeOff,
  Save,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Shield,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_DOCS: Record<string, { url: string; hint: string }> = {
  "sora-2-pro": {
    url: "https://platform.openai.com/api-keys",
    hint: "Beginnt mit sk-...",
  },
  "veo-3.1": {
    url: "https://aistudio.google.com/apikey",
    hint: "Google AI Studio API Key",
  },
  "runway-gen4": {
    url: "https://app.runwayml.com/settings/api-keys",
    hint: "Runway API Key",
  },
  "kling-2": {
    url: "https://platform.kuaishou.com/",
    hint: "Kling API Key",
  },
};

export default function SettingsPage() {
  const { keys, setKey, removeKey } = useApiKeyStore();
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const toggleVisibility = (model: string) => {
    setVisibleKeys((prev) => ({ ...prev, [model]: !prev[model] }));
  };

  const handleSave = (model: string) => {
    setSavedMessage(model);
    setTimeout(() => setSavedMessage(null), 2000);
  };

  const configuredCount = keys.filter((k) => k.key.length > 0).length;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Einstellungen</h1>
        <p className="mt-1 text-sm text-muted">
          Verwalte deine API-Schlüssel, um die KI-Modelle direkt zu nutzen.
        </p>
      </div>

      {/* Info banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-2xl border border-border bg-accent-muted p-5"
      >
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Deine Keys bleiben lokal
            </h3>
            <p className="mt-1 text-sm text-muted leading-relaxed">
              Alle API-Schlüssel werden ausschließlich in deinem Browser
              gespeichert (localStorage) und niemals an unsere Server gesendet.
              Du hast die volle Kontrolle.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Status */}
      <div className="mb-6 flex items-center gap-2 text-sm">
        <div
          className={cn(
            "h-2 w-2 rounded-full",
            configuredCount > 0 ? "bg-success" : "bg-muted-foreground"
          )}
        />
        <span className="text-muted">
          {configuredCount} von {keys.length} Modellen konfiguriert
        </span>
      </div>

      {/* API Key Cards */}
      <div className="space-y-4">
        {keys.map((entry, i) => {
          const docs = API_DOCS[entry.model];
          const isVisible = visibleKeys[entry.model];
          const isSaved = savedMessage === entry.model;

          return (
            <motion.div
              key={entry.model}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      {entry.label}
                    </h3>
                    {entry.key && (
                      <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                        <CheckCircle2 className="h-3 w-3" />
                        Konfiguriert
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {entry.provider}
                  </p>
                </div>
                {docs && (
                  <a
                    href={docs.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-accent hover:underline"
                  >
                    API Key holen
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              {/* Input */}
              <div className="mt-4 flex gap-2">
                <div className="relative flex-1">
                  <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={isVisible ? "text" : "password"}
                    value={entry.key}
                    onChange={(e) => setKey(entry.model, e.target.value)}
                    placeholder={docs?.hint || "API Key eingeben..."}
                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors"
                  />
                  <button
                    onClick={() => toggleVisibility(entry.model)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {entry.key && (
                  <>
                    <button
                      onClick={() => {
                        handleSave(entry.model);
                      }}
                      className={cn(
                        "flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-medium transition-all",
                        isSaved
                          ? "bg-success/10 text-success"
                          : "bg-accent/10 text-accent hover:bg-accent/20"
                      )}
                    >
                      {isSaved ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <Save className="h-3.5 w-3.5" />
                      )}
                      {isSaved ? "Gespeichert" : "Testen"}
                    </button>
                    <button
                      onClick={() => removeKey(entry.model)}
                      className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2.5 text-xs text-muted-foreground hover:text-danger hover:border-danger/30 hover:bg-danger/5 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>

              {/* Warning for no key */}
              {!entry.key && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <AlertCircle className="h-3 w-3" />
                  Ohne API Key kann dieses Modell nicht genutzt werden.
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Help section */}
      <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
        <h3 className="text-sm font-semibold text-foreground">
          Wie bekomme ich einen API Key?
        </h3>
        <ol className="mt-3 space-y-2 text-sm text-muted leading-relaxed">
          <li className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
              1
            </span>
            Erstelle einen Account beim jeweiligen Anbieter (OpenAI, Google, Runway, etc.)
          </li>
          <li className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
              2
            </span>
            Navigiere zu den API-Einstellungen oder dem Developer-Dashboard
          </li>
          <li className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
              3
            </span>
            Generiere einen neuen API-Schlüssel und kopiere ihn
          </li>
          <li className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
              4
            </span>
            Füge den Key hier ein — er wird sofort lokal gespeichert
          </li>
        </ol>
      </div>
    </div>
  );
}
