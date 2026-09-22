export const destinationKinds = [
  "repo",
  "deploy",
  "artifact",
  "case-study",
] as const;

export type DestinationKind = (typeof destinationKinds)[number];

export type Destination = {
  slug: string;
  title: string;
  shortTitle: string;
  kind: DestinationKind;
  href: string;
  summary: string;
  status: string;
  evidence: readonly string[];
  learning: string;
  verified: boolean;
};

export const destinations = [
  {
    slug: "vero",
    title: "Vero — System Assurance Field Study",
    shortTitle: "Vero",
    kind: "case-study",
    href: "https://github.com/cmurphy1140/Vero",
    summary:
      "A safety-bounded reverse-engineering study of a professionally installed home automation system.",
    status: "Active field study",
    evidence: [
      "Built repeatable read-only instrumentation instead of relying on screenshots.",
      "Separated measured behavior, inference, and assumption in the written record.",
      "Documented security findings without publishing household identifiers or raw device data.",
    ],
    learning:
      "A measuring tool is part of the evidence chain: subtle instrumentation errors create confident but incorrect conclusions.",
    verified: true,
  },
  {
    slug: "itinerary-control",
    title: "Itinerary Change Control",
    shortTitle: "Itinerary Control",
    kind: "case-study",
    href: "/work/itinerary-control",
    summary:
      "A packet-first workflow for absorbing late group-travel changes without rebuilding every document by hand.",
    status: "Design approved; first build in progress",
    evidence: [
      "Models an itinerary revision as structured changes and downstream impacts.",
      "Produces reviewable Word and PDF packets before any broader workflow automation.",
      "Keeps an employee approval gate between generated output and operational use.",
    ],
    learning:
      "The useful first step is not automating every reservation; it is making one changed plan legible before work is repeated.",
    verified: true,
  },
  {
    slug: "mac-hardening",
    title: "Mac Hardening and Automation",
    shortTitle: "Mac Hardening",
    kind: "case-study",
    href: "/work/mac-hardening",
    summary:
      "Audited and cleaned a macOS system end to end, then scripted its weekly maintenance.",
    status: "Complete, 2026",
    evidence: [
      "Removed 34 orphaned launch items left behind by uninstalled software.",
      "Migrated Homebrew to its native arm64 install.",
      "Reclaimed 89 GiB of storage.",
      "Scripted weekly maintenance with launchd.",
    ],
    learning:
      "Cleaning up a machine starts with measuring it: I inventoried every startup item and gigabyte before removing anything, so each change could be explained and undone.",
    verified: true,
  },
  {
    slug: "band-charter-outreach",
    title: "Customer Outreach Pipeline",
    shortTitle: "Outreach Pipeline",
    kind: "case-study",
    href: "/work/band-charter-outreach",
    summary:
      "Built a PostgreSQL lead pipeline for a band travel charter client.",
    status: "2025",
    evidence: [
      "Filtered East Coast schools to traveling band programs, with music-department contacts found through parameter testing.",
      "Chained queries into soft-lead scoring and templated email generation.",
      "Built with Python, PostgreSQL, and SQL.",
    ],
    learning:
      "Turning a manual outreach list into a scored, queryable pipeline made it possible to prioritize leads and generate templated contact instead of working the list by hand.",
    verified: false,
  },
  {
    slug: "catch-5",
    title: "Catch 5 — iOS Card Game and Learning App",
    shortTitle: "Catch 5",
    kind: "case-study",
    href: "/work/catch-5",
    summary:
      "Developing a Swift/SwiftUI app for playing and learning Catch 5, with a standalone rules engine, computer opponents, interactive tutorials, strategy explanations, and save/resume functionality.",
    status: "In development",
    evidence: [
      "Standalone rules engine separated from the app UI.",
      "Computer opponents for solo play.",
      "Interactive tutorials and strategy explanations for learning the game.",
      "Save/resume functionality.",
    ],
    learning:
      "Separating the rules engine from the interface let the same game logic drive both play and the interactive tutorials, instead of duplicating rules in each.",
    verified: false,
  },
  {
    slug: "resume",
    title: "Resume",
    shortTitle: "Resume",
    kind: "artifact",
    href: "/resume",
    summary:
      "A concise view of experience, systems work, and the evidence behind each project claim.",
    status: "Web index and verified PDF available",
    evidence: [
      "Project claims link back to inspectable work.",
      "Skills are grounded in the systems used to produce the work.",
    ],
    learning:
      "A portfolio is strongest when the resume is an index into evidence rather than a separate set of claims.",
    verified: true,
  },
] as const satisfies readonly Destination[];

export function findDestination(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}
