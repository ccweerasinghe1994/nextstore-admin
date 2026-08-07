"use client";

import { useEffect, useRef, useState } from "react";
import {
  isThemePreference,
  THEME_OPTIONS,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from "./theme-config";

const DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

const THEME_LABELS: Record<ThemePreference, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

function readThemePreference(): ThemePreference {
  try {
    const storedPreference = window.localStorage.getItem(THEME_STORAGE_KEY);

    return isThemePreference(storedPreference) ? storedPreference : "system";
  } catch {
    return "system";
  }
}

function resolveTheme(preference: ThemePreference): "light" | "dark" {
  if (preference !== "system") {
    return preference;
  }

  return window.matchMedia(DARK_MODE_QUERY).matches ? "dark" : "light";
}

function applyTheme(preference: ThemePreference) {
  document.documentElement.dataset.theme = resolveTheme(preference);
}

function storeThemePreference(preference: ThemePreference) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // The current-page preference still works when storage is unavailable.
  }
}

export function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>("system");
  const activePreference = useRef<ThemePreference>("system");

  useEffect(() => {
    const initialPreference = readThemePreference();
    const mediaQuery = window.matchMedia(DARK_MODE_QUERY);

    activePreference.current = initialPreference;
    setPreference(initialPreference);
    applyTheme(initialPreference);

    function handleSystemThemeChange() {
      if (activePreference.current === "system") {
        applyTheme("system");
      }
    }

    function handleStorageChange(event: StorageEvent) {
      if (event.key !== THEME_STORAGE_KEY) {
        return;
      }

      const nextPreference = isThemePreference(event.newValue)
        ? event.newValue
        : "system";

      activePreference.current = nextPreference;
      setPreference(nextPreference);
      applyTheme(nextPreference);
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  function selectTheme(nextPreference: ThemePreference) {
    activePreference.current = nextPreference;
    setPreference(nextPreference);
    storeThemePreference(nextPreference);
    applyTheme(nextPreference);
  }

  return (
    <aside className="fixed right-4 bottom-4 z-50 rounded-xl border border-border bg-surface p-1.5 text-foreground shadow-lg">
      <fieldset>
        <legend className="sr-only">Color theme</legend>
        <div className="flex gap-1">
          {THEME_OPTIONS.map((option) => {
            const isSelected = preference === option;

            return (
              <button
                key={option}
                type="button"
                aria-pressed={isSelected}
                className={
                  isSelected
                    ? "rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    : "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                }
                onClick={() => selectTheme(option)}
              >
                {THEME_LABELS[option]}
              </button>
            );
          })}
        </div>
      </fieldset>
    </aside>
  );
}
