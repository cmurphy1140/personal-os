# Personal OS — First Build Plan

## Implementation Status — 2026-09-20

Moves 1–3 are implemented and locally verified for the initial Vero, Itinerary
Change Control, and web-resume destinations. The one-page PDF resume now carries
the flagship Vero project and passed document and text validation. Repository
publication and deployment are the authorized release steps.

## Ownership

- Claude owns the visible shell: layout, design tokens, responsive behavior,
  accessible terminal interaction, and selected-work presentation.
- Codex owns destination data, routing behavior, verification scripts, tests,
  privacy checks, and final integration.
- Neither agent commits, pushes, creates a remote, or deploys in this increment.

## Move 1 — Interface Shell

Replace the starter page with the approved split-plane shell. Implement clickable
and keyboard-accessible navigation, the closed command set, honest README output,
mobile stacking, light/dark presentation, and reduced-motion behavior. Use only
sanitized provisional content supplied in this repository.

Acceptance:

- A visitor can use the complete site without typing.
- Commands and clicks select the same content.
- Unknown commands fail explicitly.
- No Vero imagery or house-specific evidence is copied.

## Move 2 — Destination Contract

Create a typed allowlisted manifest and verification script. Route internal case
studies through real Next.js pages. External links and artifacts remain disabled
until verified.

Acceptance:

- Every exposed slug is unique and has one allowed kind.
- `open <slug>` cannot accept free-form paths or URLs.
- Build verification fails for a destination marked publishable without a target.

## Move 3 — Evidence and Verification

Add public-safe initial project narratives and an approved resume artifact, then
run lint, type/build checks, image validation, keyboard checks, and mobile/desktop
visual review. Record remaining unverified destinations rather than inventing
them.

Acceptance:

- No private data or local paths appear in the production output.
- The production build passes.
- Screenshots demonstrate both desktop and mobile behavior.
- Deployment remains a separate authorized step.
