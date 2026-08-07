(() => {
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  try {
    const storedTheme = window.localStorage.getItem("nextstore-theme:v1");
    document.documentElement.dataset.theme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : systemTheme;
  } catch {
    document.documentElement.dataset.theme = systemTheme;
  }
})();
