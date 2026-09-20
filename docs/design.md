# Personal OS — Approved Design

## Product

A public, resume-grade portfolio that keeps the Vero probe console's terminal
layout while turning the terminal into a truthful navigator for Connor's work.
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

## Visual Plan

### Color

- `ground` — `#000000`
- `surface` — `#0c0c0d`
- `surface-raised` — `#141416`
- `ink` — `#f4f4f4`
- `sage` — `#7fae83`
- `amber` — `#d9a95c`
- `signal` — `#4dffb0`

These tokens deliberately preserve the source console's visual grammar. The
brief specifically calls for continuity, so the near-black and green pairing is
not being chosen as generic developer styling.

### Type

- Human narrative: SF Pro Display with system fallbacks.
- Commands and evidence: SF Mono with system fallbacks.
- Headlines are light, left-aligned, and restrained; terminal output stays dense
  enough to feel operational without sacrificing readability.

### Layout

Desktop:

```text
┌ Connor Murphy / Personal OS ───────── resume  theme ┐
│                                                     │
│ terminal session             selected work          │
│ ┌─────────────────────────┐ ┌────────────────────┐  │
│ │ boot / prompt / output  │ │ story              │  │
│ │                         │ │ evidence            │  │
│ │ connor@work ~ $         │ │ real destination   │  │
│ └─────────────────────────┘ └────────────────────┘  │
│ verified destinations · last exit 0                 │
└─────────────────────────────────────────────────────┘
```

Mobile:

```text
┌ Personal OS ─ resume ┐
│ selected work        │
│ evidence + open      │
├──────────────────────┤
│ terminal session     │
│ connor@work ~ $      │
└──────────────────────┘
```

The selected work pane comes first on narrow screens so a recruiter can use the
site without learning the terminal. Commands remain fully available below it.

## Content Shape

- `~/profile`: concise introduction, working style, and current focus.
- `~/experience`: verified resume history.
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
