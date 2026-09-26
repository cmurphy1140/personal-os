# Personal OS — Approved Design

## Product

A public, resume-grade portfolio that leads with who Connor is and his work,
with a truthful terminal navigator one keystroke away.
It is not an exposed shell and does not connect to Connor's computer.

## Interaction Contract

The terminal and the visible navigation controls share one destination manifest.
`open vero` and a tap on the Vero entry produce the same result. Unknown commands,
unlisted slugs, free-form URLs, and filesystem paths return an explicit failure.

Closed command set:

- `help`
- `whoami`
- `ls [path]`
- `cd <directory>`
- `cat <file>`
- `open <slug>`
- `resume`
- `history`
- `clear`

Every destination declares one kind: `repo`, `deploy`, `artifact`, or
`case-study`. No destination is shown as available until its target is verified.

## Visual Plan — "A Different Road" (shipped 2026-09-26)

Built on Connor's line: "I walk a different road, and it's the only road I
want to be on." Replaces the earlier split-plane terminal-first layout.

### Color

Dark (default) and light are token swaps in `src/app/globals.css`.

| Token | Dark | Light | Use |
|---|---|---|---|
| `ground` | `#0b0b0c` | `#f4f2ed` | page, with a faint grain |
| `surface` | `#121214` | `#fbfaf7` | cards, terminal |
| `ink` / `ink-soft` / `ink-faint` | `#f3f1ec` / `#b3b0a9` / `#94918b` | `#18181a` / `#45443f` / `#5d5b55` | text tiers, each ≥ 4.5:1 |
| `amber` | `#d9a95c` | `#8a5c12` | the one accent: road paint, focus, primary button |
| `sage` | `#8dbb91` | `#3d7a4e` | terminal success output only |
| `asphalt` / `paint` | `#1c1c1f` / `#d9a95c` | `#26262a` / `#d9a95c` | the road, dark in both themes |

The motif is the dashed amber centre line: section dividers, the terminal
toggles' dashed focus ring, the road. Nothing else is decorated.

### Type

- Geist Sans (via `next/font/google`) for the name, bio, titles and prose.
- Geist Mono for labels, mile markers, tags and the terminal.
- The name is the only h1 on home; the bio is a large muted sentence with the
  key words bright.

### Layout

Desktop:

```text
┌ -- Connor Murphy        Timeline Résumé [Jump to ⌘K] [>_] [◐] ┐
│ SOFTWARE ENGINEER · B.S. COMPUTER SCIENCE                     │
│ Connor Murphy                                                 │
│ bio sentence, key words bright                                │
│ ┆ I walk a different road, and it's the only road …           │
│ [Download résumé] [See the work]                              │
│ — — — — — — — — — — — — — — — — — — — — — — — — — — — — —     │
│ Selected work   ┌ MILE 01 · … ┐ ┌ MILE 02 · … ┐               │
│                 └─────────────┘ └─────────────┘  (2 columns)  │
│ — — — — — — — — — — — — — — — — — — — — — — — — — — — — —     │
│ The road so far   stops above and below one road, in order    │
└───────────────────────────────────────────────────────────────┘
```

Mobile: the same order in one column; the road runs down the left edge; the
header keeps Résumé, `>_` and the theme toggle.

The terminal is a modal `<dialog>` opened by ⌘K (or Ctrl-K), the ⌘K pill,
the `>_` button or the footer link: a palette on desktop, a sheet from the
bottom on a phone. Escape or a click outside closes it.

### Projects and the road

- Cards come from `src/data/destinations.ts` (primary case studies, in
  order). The label is the mile number, the entry's `category` and its first
  `tag`; tags only name tools the entry's own evidence states.
- A verified card is a link whose plain click runs `open <slug>` through the
  command engine. An unverified card (Catch 5) shows its status badge and is
  not linked, matching `open`'s refusal.
- The road draws every entry of `src/data/timeline.ts`, evenly spaced and in
  start order, with dates exactly as stated. `/timeline` draws it to scale.

## Content Shape

- `~/profile`: concise introduction, working style, and current focus.
- `~/experience`: verified resume history; drawn to scale at `/timeline`.
- `~/work`: project manifests and public case studies.
- `~/learning`: corrections, constraints, and what each project taught Connor.
- `~/resume.pdf`: approved downloadable resume.

Initial work entries are Vero and Itinerary Change Control. Further entries are
added only after their public destination and claims are verified.

## Public-Safety Architecture

- Separate repository and deployment from Vero.
- Static allowlisted destination data; no arbitrary URL or shell evaluation.
- Build-time checks for invalid, duplicate, or unverified entries.
- No Vero raw evidence, private paths, home identifiers, or customer data.
- Honest `~/README`: this is a portfolio interface over a static manifest, not a
  shell or mounted filesystem.

## Quality Bar

Keyboard operation, mobile layout, visible focus, reduced motion, semantic
headings, truthful failure states, and a passing production build are part of the
first increment—not later polish.
