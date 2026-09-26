# Site audit — personal-os-weld-beta.vercel.app

Run 2026-09-26. Live URL, headless tools only, no code changes.

## 1. Lighthouse

| Page | Preset | Perf | A11y | Best Practices | SEO |
|---|---|---|---|---|---|
| `/` | mobile | 78 | 96 | 96 | 100 |
| `/` | desktop | 100 | 96 | 100 | 100 |
| `/work/tracker-digest` | mobile | 72 | 100 | 100 | 100 |
| `/work/tracker-digest` | desktop | 100 | 100 | 100 | 100 |

**Top fixes, home (mobile):**
1. Total Blocking Time 940ms (score 0.30, the whole perf drag) — main-thread work 2.4s, unused JS ~29KiB, legacy JS ~14KiB.
2. Color contrast (a11y, score 0) — `.pane--work > .pane-head > .pane-meta` and `.pane--terminal > .pane-head > .pane-meta` text fails WCAG AA.
3. Legible font sizes (best practices, score 0) — only 54.5% of text meets the legible-size threshold.

**Top fixes, tracker-digest (mobile):**
1. Total Blocking Time 1,570ms (score 0.13) — main-thread work 3.8s, unused JS ~30KiB, legacy JS ~14KiB.
2. Largest Contentful Paint 2.2s (score 0.95).
3. First Contentful Paint 1.4s (score 0.97) — same root cause as #1, JS parse/execute before paint.

Desktop presets on both pages are clean (100 perf, only the same color-contrast issue holding back home's a11y score). Raw reports: `lh-*.json` in the scratch dir below.

## 2. Accessibility (axe-core, real Chrome, not Lighthouse's subset)

- **Home (`/`): 2 violations**, both `color-contrast` (serious) — `.pane--work > .pane-head > .pane-meta` and `.pane--terminal > .pane-head > .pane-meta`. Matches Lighthouse's finding: the small gray meta labels ("Active field study", "static router · no host access") are too light against the panel background.
- **`/work/tracker-digest`: 0 violations.**

## 3. Screenshots

`/private/tmp/claude-501/-Users-connormurphy-Desktop/14648294-88ef-4aca-ae4c-a9591db0a3fb/scratchpad/site-audit/`
- `home-phone.png` (390×844), `home-desktop.png` (1440×900)
- `tracker-phone.png` (390×844), `tracker-desktop.png` (1440×900)

Design reads as a deliberate terminal/CLI aesthetic (two-pane grid, monospace, green accent) — not a generic centered-stack AI layout.

## 4. Broken links (linkinator, recursive, LinkedIn skipped)

**None.** 20 links crawled from the home page, every one returned 200 (including `/resume`, all `/work/*` case studies, and `Connor_Murphy_Resume.pdf`).

## 5. Skill checklists (findings only, no fixes applied)

### anti-slop-audit
- **[BLOCK] Flat page background** — `--ground` in `src/app/globals.css` is a single flat hex per theme (`#000000` dark / `#e9eaea` light, both at `:root` and the media-query override) with no gradient, noise, or texture layer anywhere in the file. Confirmed visually in `home-desktop.png`. Fix: layer a subtle gradient or grain over `--ground`.
- **North Star**: present (`AGENTS.md:24`, pulled into `CLAUDE.md`) — not a finding.
- **Typography, emoji, CTAs, raw `<img>`, depth**: all clean. No banned fonts, no emoji, CTA copy is specific ("Open case study"), no raw `<img>` tags, 36 shadow/border declarations present.
- **[NOTE] Motion** — no `transition`/`duration` declarations found outside the `prefers-reduced-motion` override, so there's no stated micro-interaction spec either way. No `isLoading`/`Suspense` found, so this may be moot (little async content) rather than a real gap — worth a look, not a block.

Verdict: **PASS WITH NOTES** — one BLOCK (flat background), otherwise clean and distinctly non-generic.

### image-validator
- `bash scripts/validate-images.sh .` reports 4 "missing file" errors, all in `docs/personal-os-architecture.visual-check.html`, referencing sibling PNGs by bare filename (e.g. `personal-os-architecture.visual-check.1440x900.light.png`).
- **These are false positives**: the files exist in `docs/` (verified with `ls`). The validator's own resolution rules only cover `/foo.png`, `@/foo.png`, `./foo.png`, `../foo.png` — a bare filename with no path prefix isn't one of its resolvable forms, so it reports missing rather than "unchecked." Not a production issue either way: `docs/` isn't served by Next.js.
- No image references found anywhere in `src/` — the shipped site has no `<img>`, no `next/image`, no raster assets in `public/`. Nothing to validate on the live pages.

## Scratch output
Lighthouse JSON, axe text output, and linkinator log are in the same scratch dir as the screenshots (not committed).
