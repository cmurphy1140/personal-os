# Personal OS

Connor Murphy's public portfolio and resume site, presented as a restrained
terminal workbench. The terminal is a closed navigator over a static allowlist;
it is not connected to a computer or an arbitrary shell.

## What works

- Terminal and clickable navigation share one destination manifest.
- `open vero` resolves to the verified public Vero repository.
- Vero and Itinerary Change Control have public-safe project views.
- The resume route and verified one-page PDF include the flagship Vero project.
- Mobile and desktop layouts, unknown-command failure, internal routes, image
  references, and production privacy tokens are checked locally.

## Local verification

```bash
npm run verify
npm start -- --hostname 127.0.0.1 --port 4174
npm run test:ui
```

The UI test expects the production server at `http://127.0.0.1:4174` unless
`PERSONAL_OS_URL` is set.

## Boundaries

The project is separate from Vero. It must never contain raw house evidence,
local paths, network details, device maps, household identifiers, or private
customer/employer material. See `AGENTS.md` and `docs/design.md` before editing.
