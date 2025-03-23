import { createStorage } from "./storage.js";

/**
 * Initializes the app theme
 *
 * @returns {void}
 */
export function initTheme() {
  const html = document.documentElement;
  const themeToggle = $("theme-toggle");

  let theme = createStorage("theme", "dark", {
    callback: (newTheme) => {
      html.dataset.theme = newTheme;
      themeToggle.removeClass(newTheme === "dark" ? "icon-sun" : "icon-moon");
      themeToggle.addClass(newTheme === "dark" ? "icon-moon" : "icon-sun");
    },
  });

  themeToggle.on("click", () => {
    theme.value = theme.value === "dark" ? "light" : "dark";
  });
}
