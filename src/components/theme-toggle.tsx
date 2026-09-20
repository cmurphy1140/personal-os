"use client";

/* Light/dark, stored per visitor. The icon is one shape in both states so the
   button renders identically on the server and after hydration; only the
   pressed state and the label change once the real theme is known. */

const STORAGE_KEY = "personal-os-theme";

function prefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function ThemeToggle() {
  return (
    <button
      type="button"
      className="chip chip--icon"
      aria-label="Toggle color theme"
      onClick={() => {
        const chosen = document.documentElement.dataset.theme;
        const dark = chosen ? chosen === "dark" : prefersDark();
        const next = dark ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
          /* storage blocked — the choice simply does not persist */
        }
      }}
    >
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path fill="currentColor" d="M12 4a8 8 0 0 1 0 16Z" />
      </svg>
    </button>
  );
}
