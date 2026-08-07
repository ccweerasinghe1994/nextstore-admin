(() => {
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  let preference = "system";

  try {
    const storedPreference = window.localStorage.getItem("nextstore-theme:v1");

    if (
      storedPreference === "system" ||
      storedPreference === "light" ||
      storedPreference === "dark"
    ) {
      preference = storedPreference;
    }
  } catch {}

  document.documentElement.dataset.themePreference = preference;
  document.documentElement.dataset.theme =
    preference === "system" ? systemTheme : preference;
})();
