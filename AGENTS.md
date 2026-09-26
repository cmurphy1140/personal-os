<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Personal OS

## Purpose

This is Connor Murphy's public portfolio and resume site. It reuses the visual
grammar of Vero's private probe console, but it is a separate project with no
Vero house data, device data, or private filesystem access.

The terminal is a real portfolio navigator, not a simulated operating-system
shell. Every successful `open <slug>` resolves through one allowlisted manifest
entry to a real repository, deployed app/site, downloadable artifact, or public
case study. Arbitrary commands, paths, and URLs must fail closed.

## Aesthetic North Star

"A Different Road", built on Connor's line: "I walk a different road, and it's
the only road I want to be on." A recruiter should know who Connor is and see
his best work within five seconds; the terminal is there for anyone who wants
it, not in the way of anyone who doesn't.

- Night road: near-black asphalt ground with a faint grain, and one warm
  accent (amber `#d9a95c`, darkened in the light theme for contrast) used the
  way road paint is used. Sage is for success states in the terminal only.
- One motif, used sparingly: the dashed amber centre line (section dividers,
  the terminal toggles' focus ring, the road itself). No gradients, fake
  telemetry or decorative clutter.
- Home order: the name, the bio as a large muted sentence with the key words
  bright, Connor's line as the tagline, a résumé button sized to its label;
  then mile-marker project cards ("MILE 01 · TOOL · PYTHON"); then the road,
  drawn only from `src/data/timeline.ts` (across on wide screens, down on a
  phone) and linked to `/timeline`, which draws the same record to scale.
- Geist Sans for narrative and titles, Geist Mono for labels and the terminal.
- The terminal lives behind "Jump to ⌘K" and a `>_` button as a modal dialog
  (a sheet on a phone). Card taps and typed commands run the same router; an
  unverified project is shown with its state and is not linked.
- Mobile visitors reach everything by ordinary taps. Respect reduced motion,
  visible keyboard focus, semantic HTML, light and dark themes, readable line
  lengths, and no horizontal scroll at 390px.

## Public Boundary

Public content may include approved resume facts, public repository/deployment
URLs, sanitized case studies, screenshots created for publication, and learning
notes. Never publish local paths, IP addresses, hostnames, room names, device
maps, raw scans, household identifiers, customer identifiers, private employer
material, secrets, or unverified claims.

Do not copy `web/assets/keypads.webp` or any house-specific Vero content. Link to
approved public Vero material only.

## Working Rules

- `src/data/destinations.ts` is the only source of navigation destinations.
- The terminal accepts only the closed command set documented in the design.
- A destination is publishable only when its route or public URL passes the
  verification script.
- Do not deploy, create a remote, commit, or push without Connor's authorization.
- Run `npm run lint`, `npm run build`, and `npm run validate:images` before any
  completion claim.

## Current Status

2026-09-26: the "A Different Road" redesign replaced the split-plane layout
(see Aesthetic North Star and docs/design.md).

2026-09-20: the split-plane Personal OS Shell, closed command engine, typed
destination manifest, internal case-study and resume routes, public-output
privacy gate, and isolated mobile/desktop browser checks are implemented and
verified locally. Vero's public GitHub repository is the first verified external
destination. The verified one-page resume PDF includes the flagship Vero
project and is available from the resume route.
