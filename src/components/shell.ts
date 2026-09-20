/* The command engine.

   This is a pure function over a small static tree. It never touches the
   network, never evaluates input, and never resolves a path or a URL that did
   not come out of src/data/destinations.ts. `run()` returns output plus the
   effects the caller may apply (select a destination, navigate to a real
   route, clear the scrollback) — deciding is separated from doing so the same
   engine answers a typed command and a tapped control.

   Everything below is derived from the manifest and docs/design.md. Nothing
   here describes a filesystem that exists. */

import { destinations, type Destination } from "@/data/destinations";

export const COMMANDS = [
  "help",
  "whoami",
  "ls",
  "cd",
  "cat",
  "open",
  "resume",
  "history",
  "clear",
] as const;

export type CommandName = (typeof COMMANDS)[number];

export type Tone = "ok" | "warn" | "error" | "signal" | "muted";

export type ListingEntry = {
  label: string;
  command: string;
  type: "dir" | "file";
};

export type OutputLine =
  | { kind: "out"; text: string; tone?: Tone; title?: boolean }
  | { kind: "prose"; text: string }
  | { kind: "hint"; text: string }
  | { kind: "listing"; entries: ListingEntry[] }
  | { kind: "link"; label: string; href: string; external: boolean };

export type ShellState = {
  cwd: string;
  history: readonly string[];
};

export type ShellResult = {
  lines: OutputLine[];
  cwd: string;
  exit: number;
  /** Destination slug the work pane should show. */
  select?: string;
  /** Internal route the caller may push. Always from the manifest. */
  navigate?: string;
  /** Verified HTTPS destination the caller may navigate to. */
  external?: string;
  clear?: boolean;
};

const HOME = "~";
const OK = 0;
const FAIL = 1;
const NOT_FOUND = 127;

/* Only these characters may appear in an argument. A colon, a space, a
   backslash or a protocol cannot survive this, so `open https://…` and
   `cat /etc/passwd` fail before any lookup happens. */
const SAFE_ARG = /^[A-Za-z0-9._~/-]+$/;
const INTERNAL_ROUTE = /^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*$/;
const HTTPS_URL = /^https:\/\/[a-z0-9.-]+(?:\/[\w./~%-]*)?$/i;

const manifest: readonly Destination[] = destinations;
const caseStudies = manifest.filter((entry) => entry.kind === "case-study");

/* ── the tree ──────────────────────────────────────────────── */

type Directory = { dirs: string[]; files: string[] };

const tree: Record<string, Directory> = {
  "~": {
    dirs: ["work", "learning"],
    files: ["README", "profile", "experience", "resume"],
  },
  "~/work": { dirs: [], files: caseStudies.map((entry) => entry.slug) },
  "~/learning": { dirs: [], files: manifest.map((entry) => entry.slug) },
};

/** Where `cat` reads a destination from, and what a click on its tab runs. */
export function viewCommand(destination: Destination) {
  return destination.kind === "case-study"
    ? `cat ~/work/${destination.slug}`
    : `cat ~/${destination.slug}`;
}

export function destinationFor(slug: string) {
  return manifest.find((entry) => entry.slug === slug);
}

export const verifiedCount = manifest.filter((entry) => entry.verified).length;

/* ── static documents ──────────────────────────────────────── */

/* The honest README. docs/design.md requires this page to say plainly what it
   is, so it is the one document written as prose rather than derived. */
const README: OutputLine[] = [
  {
    kind: "out",
    text: "Personal OS — a portfolio interface over a static manifest",
    title: true,
  },
  {
    kind: "prose",
    text: "This is not a shell. There is no host, no mounted filesystem, and no connection to Connor's computer. The prompt reads one allowlisted list of destinations that ships with the page; the directories exist to organise that list, not because they exist on a disk.",
  },
  {
    kind: "prose",
    text: "Nine commands are accepted: help, whoami, ls, cd, cat, open, resume, history, clear. Anything else exits 127. `open` takes a slug from the manifest and nothing else — not a path, not a URL, not a command.",
  },
  {
    kind: "prose",
    text: "Everything typed here can also be clicked. The tabs, the listings and the open button run this same engine, so a visitor who never types reaches every destination.",
  },
  {
    kind: "hint",
    text: "A destination is shown as available only once its target is verified. Unverified work is listed as pending, not as a claim.",
  },
];

const PROFILE: OutputLine[] = [
  { kind: "out", text: "Connor Murphy — systems and software", title: true },
  { kind: "out", text: "how the work is done, as the manifest shows it:" },
  {
    kind: "out",
    text: [
      "  · repeatable instrumentation instead of screenshots",
      "  · measured behaviour, inference and assumption kept apart in the record",
      "  · findings published without the identifiers that would make them unsafe to publish",
      "  · one changed plan made legible before any work is repeated",
    ].join("\n"),
  },
  { kind: "out", text: "current focus:" },
  {
    kind: "out",
    text: manifest
      .filter((entry) => entry.kind === "case-study")
      .map((entry) => `  · ${entry.shortTitle} — ${entry.status}`)
      .join("\n"),
    tone: "ok",
  },
  {
    kind: "hint",
    text: "Biography and employment history are not published here yet: `cat experience`.",
  },
];

const EXPERIENCE: OutputLine[] = [
  { kind: "out", text: "experience: not published yet", tone: "warn" },
  {
    kind: "prose",
    text: "The resume destination is recorded as “Web version available; PDF pending publication review”. The web version is real and reachable — run `resume`.",
  },
  {
    kind: "prose",
    text: "History is added here only after the underlying work has a verified public destination. Nothing is listed on the strength of a description alone.",
  },
];

/* ── helpers ───────────────────────────────────────────────── */

function out(text: string, tone?: Tone): OutputLine {
  return tone ? { kind: "out", text, tone } : { kind: "out", text };
}

function fail(result: ShellResult, text: string, exit = FAIL): ShellResult {
  result.lines.push({ kind: "out", text, tone: "error" });
  result.exit = exit;
  return result;
}

function resolve(arg: string | undefined, cwd: string) {
  if (!arg || arg === ".") return cwd;
  if (arg === "~" || arg === "/") return HOME;
  if (arg === "..") {
    return cwd.includes("/") ? cwd.slice(0, cwd.lastIndexOf("/")) : HOME;
  }
  const path = arg.startsWith("~/") ? arg : `${cwd}/${arg}`;
  return path.replace(/\/+$/, "");
}

function fileAt(path: string) {
  const cut = path.lastIndexOf("/");
  const dir = cut === -1 ? HOME : path.slice(0, cut);
  const name = cut === -1 ? path : path.slice(cut + 1);
  const directory = tree[dir];
  if (!directory || !directory.files.includes(name)) return null;
  return { dir, name };
}

function listing(path: string): OutputLine {
  const directory = tree[path];
  const entries: ListingEntry[] = [
    ...directory.dirs.map((name) => ({
      label: `${name}/`,
      command: `cd ${path}/${name}`,
      type: "dir" as const,
    })),
    ...directory.files.map((name) => ({
      label: name,
      command: `cat ${path}/${name}`,
      type: "file" as const,
    })),
  ];
  return { kind: "listing", entries };
}

type LinkLine = Extract<OutputLine, { kind: "link" }>;

function destinationLink(destination: Destination): LinkLine | null {
  if (INTERNAL_ROUTE.test(destination.href)) {
    return {
      kind: "link",
      label: destination.href,
      href: destination.href,
      external: false,
    };
  }
  if (HTTPS_URL.test(destination.href)) {
    return {
      kind: "link",
      label: destination.href,
      href: destination.href,
      external: true,
    };
  }
  return null;
}

/** The body `cat` prints for a destination, plus the tab that stays in sync. */
function destinationDocument(destination: Destination): OutputLine[] {
  const link = destinationLink(destination);
  return [
    { kind: "out", text: destination.title, title: true },
    { kind: "out", text: `${destination.kind} · ${destination.status}`, tone: "muted" },
    { kind: "prose", text: destination.summary },
    out("evidence:"),
    out(destination.evidence.map((item) => `  · ${item}`).join("\n"), "ok"),
    ...(link ? [link] : []),
    {
      kind: "hint",
      text: `\`open ${destination.slug}\` goes there. It is the only thing \`open\` will accept for this entry.`,
    },
  ];
}

/* ── the commands ──────────────────────────────────────────── */

function help(): OutputLine[] {
  return [
    out(
      [
        "help             this",
        "whoami           who is asking",
        "ls [path]        list a directory",
        "cd <dir>         change directory (.. goes up)",
        "cat <file>       print a file",
        "open <slug>      go to a destination in the manifest",
        "resume           open the resume",
        "history          what has been run this session",
        "clear            clear the scrollback",
      ].join("\n"),
    ),
    {
      kind: "hint",
      text: "Nine commands, and nothing else. Tab completes, ↑ and ↓ walk history. Start with `ls`.",
    },
  ];
}

function openDestination(result: ShellResult, slug: string | undefined) {
  if (!slug) {
    fail(result, "open: missing operand");
    result.lines.push({ kind: "hint", text: "usage: open <slug>" });
    return result;
  }
  if (!SAFE_ARG.test(slug) || slug.includes("/")) {
    return fail(
      result,
      `open: ${slug}: not a slug. open takes a manifest slug, not a path or a URL.`,
    );
  }
  const destination = destinationFor(slug);
  if (!destination) {
    fail(result, `open: ${slug}: not in the destination manifest`);
    result.lines.push({
      kind: "hint",
      text: `known slugs: ${manifest.map((entry) => entry.slug).join(", ")}`,
    });
    return result;
  }
  if (!destination.verified) {
    return fail(result, `open: ${slug}: destination not verified yet`);
  }
  const link = destinationLink(destination);
  if (!link) {
    return fail(result, `open: ${slug}: destination target failed validation`);
  }
  result.select = destination.slug;
  result.lines.push(out(`opening ${destination.title}`, "signal"), link);
  if (link.external) {
    result.external = link.href;
  } else {
    result.navigate = link.href;
  }
  return result;
}

function catFile(result: ShellResult, arg: string | undefined) {
  if (!arg) return fail(result, "cat: missing operand");
  const path = resolve(arg, result.cwd);
  if (tree[path]) return fail(result, `cat: ${arg}: Is a directory`);
  const found = fileAt(path);
  if (!found) return fail(result, `cat: ${arg}: No such file or directory`);

  if (found.dir === HOME) {
    if (found.name === "README") {
      result.lines.push(...README);
      return result;
    }
    if (found.name === "profile") {
      result.lines.push(...PROFILE);
      return result;
    }
    if (found.name === "experience") {
      result.lines.push(...EXPERIENCE);
      return result;
    }
  }

  const destination = destinationFor(found.name);
  if (!destination) {
    return fail(result, `cat: ${arg}: No such file or directory`);
  }

  if (found.dir === "~/learning") {
    result.select = destination.slug;
    result.lines.push(
      { kind: "out", text: `${destination.shortTitle} — what it taught`, title: true },
      { kind: "prose", text: destination.learning },
      {
        kind: "hint",
        text: `the work itself: \`${viewCommand(destination)}\``,
      },
    );
    return result;
  }

  result.select = destination.slug;
  result.lines.push(...destinationDocument(destination));
  return result;
}

/* ── entry point ───────────────────────────────────────────── */

export function run(input: string, state: ShellState): ShellResult {
  const result: ShellResult = { lines: [], cwd: state.cwd, exit: OK };
  const line = input.trim();
  if (!line) return result;

  const [name, ...args] = line.split(/\s+/);
  const badArg = args.find((arg) => !SAFE_ARG.test(arg));
  if (badArg !== undefined) {
    return fail(result, `${name}: ${badArg}: rejected — unsupported characters`);
  }

  switch (name as CommandName) {
    case "help":
      result.lines.push(...help());
      return result;

    case "whoami":
      result.lines.push(
        out("connor"),
        out("guest session · static manifest · no host access", "muted"),
      );
      return result;

    case "ls": {
      const path = resolve(args[0], result.cwd);
      if (tree[path]) {
        result.lines.push(listing(path));
        if (path === HOME) {
          result.lines.push({
            kind: "hint",
            text: "work/ the projects.  learning/ what each one corrected.  README what this interface actually is.",
          });
        }
        return result;
      }
      if (fileAt(path)) {
        result.lines.push(out(path.slice(path.lastIndexOf("/") + 1)));
        return result;
      }
      return fail(result, `ls: ${args[0] ?? ""}: No such file or directory`);
    }

    case "cd": {
      const path = resolve(args[0], result.cwd);
      if (!tree[path]) return fail(result, `cd: ${args[0] ?? ""}: Not a directory`);
      result.cwd = path;
      return result;
    }

    case "cat":
      return catFile(result, args[0]);

    case "open":
      return openDestination(result, args[0]);

    case "resume":
      return openDestination(result, "resume");

    case "history":
      result.lines.push(
        out(
          state.history.length
            ? state.history
                .map((entry, index) => `${String(index + 1).padStart(4)}  ${entry}`)
                .join("\n")
            : "(nothing yet)",
        ),
      );
      return result;

    case "clear":
      result.clear = true;
      return result;

    default:
      fail(result, `personal-os: ${name}: command not found`, NOT_FOUND);
      result.lines.push({
        kind: "hint",
        text: "`help` lists the nine commands this interface accepts. Everything else exits 127.",
      });
      return result;
  }
}

/** The deterministic opening screen. No clock, no counters, no telemetry. */
export function boot(): { lines: OutputLine[]; cwd: string } {
  const first = run("ls", { cwd: HOME, history: [] });
  return {
    cwd: HOME,
    lines: [
      { kind: "out", text: "Personal OS — Connor Murphy", title: true },
      out("portfolio navigator · static destination manifest · not a shell", "muted"),
      {
        kind: "hint",
        text: "`help` lists the commands. `cat README` says what this is. Everything here can also be clicked.",
      },
      ...first.lines,
    ],
  };
}

/* ── completion ────────────────────────────────────────────── */

export function completions(value: string, cwd: string): string[] {
  const parts = value.split(/\s+/);
  if (parts.length <= 1) {
    return COMMANDS.filter((command) => command.startsWith(parts[0]));
  }
  const stem = parts[parts.length - 1];
  const verb = parts[0];
  const here = tree[cwd] ?? tree[HOME];
  const pool =
    verb === "open"
      ? manifest.map((entry) => entry.slug)
      : [...here.dirs.map((dir) => `${dir}/`), ...here.files];
  return [...new Set(pool)].filter((candidate) => candidate.startsWith(stem));
}
