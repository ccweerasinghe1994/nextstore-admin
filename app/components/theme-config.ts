export const THEME_STORAGE_KEY = "nextstore-theme:v1";

export const THEME_OPTIONS = ["system", "light", "dark"] as const;

export type ThemePreference = (typeof THEME_OPTIONS)[number];

export function isThemePreference(
  value: string | null,
): value is ThemePreference {
  return THEME_OPTIONS.some((option) => option === value);
}
