"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme-store";
import { useApiKeyStore } from "@/store/api-key-store";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const initializeTheme = useThemeStore((s) => s.initialize);
  const initializeApiKeys = useApiKeyStore((s) => s.initialize);

  useEffect(() => {
    initializeTheme();
    initializeApiKeys();
  }, [initializeTheme, initializeApiKeys]);

  return <>{children}</>;
}
