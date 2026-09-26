# Study — bryangarage.dev: how it is built and why it lands

A teardown of Bryan Oh's "AI Garage" (bryangarage.dev), written to learn from
its craft, not to copy it. Nothing below reuses his copy, layout, assets or
code. The last section maps each idea onto Personal OS's own rules
(`AGENTS.md`, `docs/design.md`) and says what was built from it.

Method: the public HTML, CSS and JavaScript the site serves to any visitor,
read on 2026-09-26. Class names and library strings are quoted as evidence.
Where a claim is inference rather than something read in the source, it
says so.

## What it is, in one line

A senior product designer's portfolio whose argument is *I prototype in
code*. The site doesn't claim it; it makes the visitor watch it happen.

## How it is built

### Stack: the same one Personal OS already uses

| Layer | What the site ships | Evidence |
| --- | --- | --- |
| Framework | Next.js App Router, statically prerendered | `x-nextjs-prerender: 1`, `vary: rsc, next-router-state-tree` |
| Bundler | Turbopack | `turbopack-*.js` chunk |
| Hosting | Vercel edge cache | `server: Vercel`, `x-vercel-cache: HIT` |
| Type | Geist Sans and Geist Mono (variable), self-hosted, preloaded | `Geist_Variable`, `GeistMono_Variable` `.woff2` preloads |
| 3D | three.js r183 (WebGL2) | `"REVISION","183"`, `THREE.WebGLRenderer` |
| Motion | GSAP with a text splitter (words/chars) | `type:"words"`, `type:"words,chars"` timelines |
| Command palette | cmdk | `cmdk-` attributes, ⌘K "Jump to" |
| Analytics | Google Analytics 4 | `gtag/js` |

The front page is roughly 360 KB of HTML and about 2.7 MB of JS and CSS
chunks; three.js alone is ~700 KB. The first paint is static HTML, and the
heavy parts come in after it.

### The techniques that make it feel alive

1. **Text that assembles itself.** The intro is split into one span per
   word, so the bio reads in as a sequence rather than appearing all at
   once. GSAP drives the stagger. It is skipped entirely when
   `prefers-reduced-motion: reduce` matches.

2. **A character-cell "shader".** 1,224 `.shader-grid-cell` spans, each a
   single glyph, form an ASCII field that behaves like a pixel shader. An
   ASCII portrait is drawn to a 2D `<canvas>` only after
   `document.fonts.ready`, measured from the real monospace metrics, and
   tinted from a CSS custom property (`--crt-accent`, falling back to an
   orange). The glyphs are type, so the effect inherits the site's
   typography instead of sitting on top of it.

3. **A timeline as the spine of the page.** The career is one horizontal
   axis (`.tl-track`) with a year grid, quarter ticks (`.tl-grid--q`),
   labelled role bars (`.tl-bar`, with `is-current` on the live one) and a
   "now" marker placed by a hard-coded fractional year (`left: y(2026.5)`),
   not by reading a clock. A cursor label follows the pointer along it.

4. **Photos that "develop".** Travel frames (`.ps-frame`) show a canvas
   rendering first. On hover, focus or tap (`.is-developed`), the real image
   fades in through a warm film filter
   (`sepia(.26) saturate(.82) contrast(1.05)`), captioned with coordinates
   and a time. It turns a gallery into a small darkroom ritual, and it
   responds to `:focus-visible` as well as hover.

5. **A 3D showcase gated by capability, not just size.** The WebGL
   "showcase --3d-timeline" only turns on when this query passes:
   `(hover: hover) and (pointer: fine) and (min-width: 900px) and
   (min-height: 840px) and (prefers-reduced-motion: no-preference)`.
   Everyone else gets "swipe · tap to develop". Mobile is not a shrunken
   desktop; it is a different, simpler performance.

6. **A terminal that pretends to think.** The header prompt
   (`bryan@garage ~ %`) has a blinking cursor, and its typed responses go
   through a `thinking → typing` state with a per-character delay clamped to
   200–700 ms. Under reduced motion it starts already typed.

7. **Reduced motion checked at every call site.** `prefers-reduced-motion`
   appears in ten separate places in the bundle: each effect opts out
   locally instead of relying on one global kill switch.

## Why it is appealing

- **The medium is the proof.** His thesis is "build the interaction, put it
  in motion". Every effect is a small demonstration of that, so the
  portfolio *is* the first case study. Nothing on the page has to be taken
  on trust.
- **One voice, first person, specific.** "Born in Seoul, now in the Bay
  Area by way of Berlin and LA." Short, concrete, unhedged. The work cards
  say what the thing does in one sentence and how long it took ("in two
  hours").
- **A few things, done deeply.** Three featured projects, numbered 03 → 01,
  plus a "coming soon" slot. Scarcity makes each one feel chosen.
- **Time as structure.** A timeline answers the recruiter question
  ("what have you done, and when?") in one glance, and turns a list of jobs
  into a trajectory.
- **Rewards for curiosity.** ⌘K, the terminal, the developing photos and
  the 3D showcase are all optional. A hurried visitor still gets the
  answer; a curious one finds more.
- **Craft you can feel but not see.** Fonts are awaited before measuring,
  effects check capability, and motion degrades gracefully. The polish is
  in the edge cases.
- **Personal without oversharing.** Travel frames and coordinates humanise
  it; the professional record stays crisp.

## What Personal OS should take, and what it should not

Personal OS already shares the bones: the same Next.js/Vercel stack, a dark
ground, mono/sans pairing, a terminal voice and a command palette in spirit
(the closed command set). The difference is the thesis. Bryan's site proves
*I can make interactions feel alive*. Connor's proves *I can make systems
inspectable and honest*. The borrowed ideas must serve that thesis.

| Idea from the garage | Keep? | How it translates under our rules |
| --- | --- | --- |
| Timeline as the spine | **Yes — built** | `/timeline`, drawn from the verified resume. Honest precision: a year-only entry is hatched as a whole year instead of given an invented month. Fixed "as of" date, no clock (same trick he uses). |
| Terminal and visuals as one system | **Yes — built** | `cat experience` prints the same record; `open timeline` and the Timeline tab reach it. One manifest entry, one router. |
| Motion that explains, then gets out of the way | **Yes, small — built** | Bars draw in once, left to right, staggered. That is the only motion, and it is removed under reduced motion. |
| Capability-gated enhancement | **Yes, as a rule** | Any future heavy effect gets a capability media query like his, with a static equivalent that carries the same information. |
| Few, numbered, deep projects | **Consider** | The home-page proposal already argues for a lead order. Numbering the top three (03 → 01) would signal curation; that's a content call for Connor. |
| First-person, specific voice | **Yes, next** | The profile could open with one concrete sentence about where Connor is and what he builds, in his words. Draft for Connor to approve; not written here. |
| Word-by-word text reveal | **No** | Decorative. The design forbids motion that isn't the command/result interaction. |
| ASCII / CRT shader field, 3D showcase | **No** | Explicitly out of bounds ("no fake telemetry, no Matrix effects"). It's also ~700 KB of three.js for a site whose promise is plainness. |
| "Developing" travel photos | **Not now** | Charming, but a personal gallery needs photos created for publication and a privacy review (coordinates in captions would breach our public boundary). |
| Thinking/typing terminal delay | **No** | Our terminal answers instantly because it is a pure function; a fake "thinking" pause would misrepresent what it is (see `~/README`). |
| Google Analytics | **No** | No third-party trackers on a site whose selling point is care with data. |

## Open questions for Connor

1. The timeline draws the record to scale, so the gap between the Liberty
   Mutual internship (Aug 2022) and September 2024 is visible, with only the
   May 2023 graduation inside it. That is accurate to the resume. Keep it as
   is, or add a verified entry that covers that period?
2. Projects that are only dated "2026" in the manifest (Proposal Control,
   Mac Hardening, tracker-digest) are not on the timeline, because drawing
   them as whole-year bars would overstate how long they ran. Add month
   dates for them, and they can join the projects lane.
3. Should the timeline lead the home page for recruiters? It could replace
   the boot banner as the first thing mobile visitors see.
