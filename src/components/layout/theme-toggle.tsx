"use client";

import { useThemeStore } from "@/store/theme-store";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  const options = [
    { value: "light" as const, icon: Sun, label: "Hell" },
    { value: "dark" as const, icon: Moon, label: "Dunkel" },
    { value: "system" as const, icon: Monitor, label: "System" },
  ];

  return (
    <div className="flex items-center rounded-lg border border-border bg-surface p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          title={opt.label}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
            theme === opt.value
              ? "bg-surface-hover text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <opt.icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}
