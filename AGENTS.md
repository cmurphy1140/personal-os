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

An engineer's workbench shown with the composure of a flight recorder: black
ground, quiet instrument panels, precise status language, and one honest terminal
prompt. It should feel intimate because Connor's reasoning, corrections, and
learning are visible—not because the interface imitates a hacker movie.

- Preserve Vero's disciplined shell grammar and semantic token palette.
- Use SF Pro Display/system sans for human narrative and SF Mono/system mono for
  commands, states, and evidence.
- Spend visual emphasis on the command-and-result interaction. Avoid decorative
  dashboards, generic card grids, gradients, fake telemetry, and Matrix effects.
- Mobile visitors must be able to reach everything by ordinary taps. Typed
  commands and clickable controls operate the same router.
- Respect reduced motion, visible keyboard focus, semantic HTML, and readable
  line lengths.

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

2026-09-20: the split-plane Personal OS Shell, closed command engine, typed
destination manifest, internal case-study and resume routes, public-output
privacy gate, and isolated mobile/desktop browser checks are implemented and
verified locally. Vero's public GitHub repository is the first verified external
destination. The verified one-page resume PDF includes the flagship Vero
project and is available from the resume route.
