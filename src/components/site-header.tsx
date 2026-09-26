import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";

type SiteHeaderProps = {
  /* Present only where the terminal lives (home). Both controls open the same
     dialog, so they share one disclosure state. */
  onTerminal?: () => void;
  terminalOpen?: boolean;
};

export default function SiteHeader({ onTerminal, terminalOpen = false }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true" />Connor Murphy</Link>
      <nav className="site-nav" aria-label="Site">
        <Link className="nav-link nav-link--wide" href="/timeline">Timeline</Link>
        <Link className="nav-link" href="/resume">Résumé</Link>
        {onTerminal ? (
          <>
            <button className="jump" type="button" aria-controls="terminal" aria-expanded={terminalOpen} onClick={onTerminal}>
              Jump to <kbd>⌘K</kbd>
            </button>
            <button className="icon-button" type="button" aria-label="Open the terminal" aria-controls="terminal" aria-expanded={terminalOpen} onClick={onTerminal}>
              <span aria-hidden="true">&gt;_</span>
            </button>
          </>
        ) : null}
        <ThemeToggle />
      </nav>
    </header>
  );
}
