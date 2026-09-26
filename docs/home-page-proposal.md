# Home page proposal — recruiter-first ordering

Written for a recruiter landing cold on the Vercel URL while screening for
entry-level roles: **BAE Systems — Software Engineer I**, **CCA Global — IT
Support**, **OWL Services — IT Support**. Content and order only. The
split-plane terminal/work layout, the closed command set, SF Pro/SF Mono
type, and the existing color tokens (`ground` `#000000`, `surface`
`#0c0c0d`, `ink` `#f4f4f4`, `sage` `#7fae83`, `amber` `#d9a95c`, `signal`
`#4dffb0`) are unchanged. This is a reorder of `src/data/destinations.ts`
plus one short line of new copy in the work pane — no new components, no
new visual language.

## The 10-second problem today

Right now the first content a visitor reads is either the terminal boot
banner ("Personal OS — Connor Murphy / portfolio navigator · static
destination manifest · not a shell...") or, on mobile where the work pane
loads first, straight into project #1's summary with no identity line above
it. Neither says who Connor is or what he does for work before asking the
reader to parse a project. A recruiter who has 10 seconds and two open tabs
needs that answer before the first case study, not instead of it.

## What the page should say first

Add one short identity line at the top of the work pane, above the project
switcher, in the same kicker/heading style already used for a selected
project (no new component):

> **Connor Murphy — Software Engineer**
> B.S. Computer Science, UNH. Ships backend pipelines, databases, and iOS
> apps; reads every line before it ships.

That second sentence is the resume's own opening claim, trimmed to one line
— it is generic enough to cover both the SWE and IT-support reading and
specific enough to not be filler. Everything below it — the project tabs,
the evidence bullets, the terminal — is proof of that one sentence.

## Lead order and why

Reordering `destinations.ts` (which drives both the tab row and the
default-selected project) to:

1. **Vero** (Cyber-Physical System Assurance) — stays first. It's the top
   entry under Projects on the approved résumé, and it is the single
   strongest match to what BAE Systems screens for in a Software Engineer
   I: reverse-engineered 457 API operations and 1,502 state channels,
   built a 182-test safety suite, and turned 1,257 apparent differences
   into 7 verified ones — instrumentation discipline, not a demo. It also
   reads directly as IT-support-relevant work (interface/network analysis,
   service discovery, least-privilege documentation) for CCA
   Global/OWL Services. Most differentiated project; leads.
2. **Student-travel proposal tool** (`itinerary-control`) — moves up to
   second. It is Connor's most complete "shipped and used" story: a real
   business runs it, 239 tests, byte-identical builds, a second
   consistency check that catches double-booked venues before a client
   sees them. For a Software Engineer I screen this is the clearest
   evidence he can take a full pipeline (data → rendered document →
   change tracking) into production, which is more legible than Vero's
   research framing to a recruiter who is not security-focused.
3. **tracker-digest** — third. Small enough to read start to finish in the
   time a recruiter has: one stdlib-only Python CLI, 20 tests pinning the
   "gone quiet" rule, an append-only audit log before anything leaves the
   program. It's the fast, fully-legible proof that sits well right after
   two bigger stories, and the fact that it manages his own job search is
   an honest, on-brand detail rather than the headline.
4. **Mac Hardening** — fourth, and the one to point IT-support reviewers
   at directly: it is IT support work — audited a real machine, removed 34
   orphaned launch items, migrated Homebrew to native arm64, reclaimed 89
   GiB, then scripted the weekly maintenance. It's the most literal match
   to CCA Global/OWL Services day-to-day, but it's a narrower, one-time
   engagement next to the three shipped/tested systems above it, so it
   sits fourth rather than first.
5. **Catch 5** — fifth. Marked "in development" and unverified — no test
   count or shipped date yet, so it can't carry a lead spot next to work
   that's already tested and used. Still worth keeping visible: it shows
   Swift/SwiftUI breadth and the same separation-of-concerns habit (rules
   engine kept independent of the UI) as the shipped projects, and casts a
   wider net than backend-only work.
6. **Resume** — unchanged, last tab, same role it has today (the index
   into the above).

## What to cut or fold away

- **Outreach Pipeline** (`band-charter-outreach`) — drop it from the
  primary tab row. It's the one project marked `verified: false` with the
  thinnest evidence (three bullets, no test count, no shipped status), and
  it's the closest thing on the page to describing a client's business
  model even without naming the client — smallest signal for either
  target role, most exposure risk. Don't delete the entry; keep it
  reachable the way `~/learning` already is (`ls work`, or a folded
  "additional work" line under the tab row) so the manifest stays honest
  without competing for the first 10 seconds.
- **Terminal boot banner as the first thing read** — the "not a shell /
  static destination manifest" framing is good, correct copy for an
  engineer who explores the terminal, but it isn't identity content. Leave
  it exactly where it lives (terminal pane, which already reads second on
  mobile) rather than promoting it; the new identity line above the work
  pane replaces it as the first thing read.
- **Flag, don't fold: `cat experience`** currently prints "experience: not
  published yet" and says the resume PDF is "pending publication review."
  That's stale next to `docs/design.md`'s own claim that a verified resume
  PDF is live at `/resume`, and next to the actual `/resume` route, which
  works. Not a layout change, but worth fixing the copy in
  `src/components/shell.ts` before Monday so a recruiter who types
  `whoami` → `cat experience` doesn't hit a dead end that contradicts the
  page one click away.

## Wireframe — desktop (≥1000px, current grid: terminal left, work right)

```
┌ CONNOR MURPHY · PERSONAL OS ───────────────────── resume  ☾ ┐
│                                                               │
│ ┌─ portfolio terminal ───────────┐ ┌─ selected work ────────┐ │
│ │ Personal OS — Connor Murphy    │ │ Connor Murphy —         │ │
│ │ portfolio navigator · static   │ │ Software Engineer       │ │
│ │ destination manifest · not a   │ │ B.S. CS, UNH. Ships     │ │
│ │ shell                          │ │ backend pipelines,      │ │
│ │                                 │ │ databases, iOS apps.    │ │
│ │ `help` lists the commands.      │ ├─────────────────────────┤ │
│ │ Everything here can also be     │ │[Vero][Proposal Control] │ │
│ │ clicked.                        │ │[tracker-digest][Mac     │ │
│ │                                 │ │ Hardening][Catch 5]     │ │
│ │ work/  learning/  README        │ ├─────────────────────────┤ │
│ │                                 │ │ case-study · Active     │ │
│ │ connor@work ~ $ _                │ │ field study             │ │
│ │                                 │ │ Vero — System Assurance │ │
│ │                                 │ │ Field Study              │ │
│ │                                 │ │ A safety-bounded reverse-│ │
│ │                                 │ │ engineering study of a  │ │
│ │                                 │ │ professionally installed│ │
│ │                                 │ │ home automation system.  │ │
│ │                                 │ │ $ evidence --published  │ │
│ │                                 │ │  · repeatable read-only │ │
│ │                                 │ │    instrumentation      │ │
│ │                                 │ │  · measured vs. inferred│ │
│ │                                 │ │    kept apart           │ │
│ │                                 │ │  · no household IDs     │ │
│ │                                 │ │    published            │ │
│ │                                 │ │ $ Open case study        │ │
│ └─────────────────────────────────┘ └─────────────────────────┘ │
│ 6 verified destinations · read-only manifest · last exit 0     │
└──────────────────────────────────────────────────────────────┘
```

## Wireframe — phone (work pane first, per existing design.md rule)

```
┌ PERSONAL OS ─────────────── resume  ☾ ┐
│ Connor Murphy — Software Engineer     │
│ B.S. CS, UNH. Ships backend pipelines, │
│ databases, iOS apps.                   │
├─────────────────────────────────────────┤
│ [Vero] [Proposal Control]              │
│ [tracker-digest] [Mac Hardening]       │
│ [Catch 5]                              │
├─────────────────────────────────────────┤
│ case-study · Active field study        │
│ Vero — System Assurance Field Study    │
│ A safety-bounded reverse-engineering   │
│ study of a professionally installed    │
│ home automation system.                │
│ $ evidence --published                  │
│  · repeatable read-only instrumentation │
│  · measured vs. inferred kept apart     │
│  · no household IDs published           │
│ $ Open case study                       │
├─────────────────────────────────────────┤
│ portfolio terminal                      │
│ connor@work ~ $                         │
└─────────────────────────────────────────┘
```

## What stays exactly the same

- The two-pane terminal + selected-work layout, and the rule that the work
  pane leads on narrow screens.
- The closed nine-command terminal (`help whoami ls cd cat open resume
  history clear`) and the destination manifest as the single source of
  truth for both the terminal and the clickable tabs.
- Type (SF Pro Display / SF Mono) and the full color token set — ground,
  surface, ink, sage, amber, signal.
- The `/resume`, `/work/[slug]` routes and the verified-PDF resume chip in
  the header.

No client names appear anywhere above; the existing manifest already keeps
`band-charter-outreach`'s wording client-free, and this proposal doesn't
change that.

## Second opinion (Codex, read-only review)

1. Put the identity line, the CS degree, the target roles ("Entry-level Software Engineering / IT Support") and the résumé link above both panes, so a desktop reader meets the qualifications before the terminal.
2. For Vero, replace the method bullets with one plain-language outcome, the technologies, and one approved number; the strongest evidence currently sits only in this proposal's rationale.
3. For the IT-support applications, move Mac Hardening ahead of tracker-digest and label it "IT Support & Automation".

Pushback worth taking: the proposed first line says "ships … iOS apps", but Catch 5 is still in development. Use "developing an iOS app" until one ships.
