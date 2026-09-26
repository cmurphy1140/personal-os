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
    href: "/work/vero",
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
    title: "Trip Proposal Change Control",
    shortTitle: "Proposal Control",
    kind: "case-study",
    href: "/work/itinerary-control",
    summary:
      "A tool for a student travel company that turns a trip record into its printed Word proposal, then turns a director's revision into the reprinted proposal and a paper trail of what changed.",
    status: "Shipped, 2026",
    evidence: [
      "Renders a trip record into the client's own printed layout: cover, day-by-day schedule, inclusions and exclusions, and a price table.",
      "One command takes a director's revised trip and produces the revised proposal, a change summary that separates material changes (venues, times, prices, inclusions) from wording-only edits, and an internal vendor call list.",
      "Builds are byte-identical run to run; 239 tests cover the proposal, the revision command, and the change classification; real client data never enters git.",
      "Each revision also runs a consistency check on the trip data, catching problems like two stops booked at the same time or a supplier named differently in two places, before anything reaches the client.",
    ],
    learning:
      "Reading and writing the same trip record everywhere meant a fact fixed once showed up correctly in the proposal, the change summary, and the vendor list, instead of needing to be retyped into a second source for the Word document.",
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
    slug: "tracker-digest",
    title: "tracker-digest — Job-Application Follow-up Digest",
    shortTitle: "tracker-digest",
    kind: "case-study",
    href: "/work/tracker-digest",
    summary:
      "A Python command-line tool, standard library only, that reads a job-application tracker CSV, finds applications with no reply for seven or more days, and drafts a digest of them.",
    status: "Complete, 2026",
    evidence: [
      "Keeps the rule for what counts as gone quiet in one function, with 20 tests pinning the behavior.",
      "Reports rows with unreadable or missing dates under a Needs fixing section with their CSV line numbers, instead of dropping them.",
      "Puts a human review step before any output leaves the program, recording every approve or reject decision in an append-only audit log.",
    ],
    learning:
      "A deliberate edge-case pass found that a blank line in the CSV shifted the reported line number for a bad row, because the code assumed row index plus two instead of asking the CSV reader for its own line count. A test that failed on the old code and passed on the fix pinned the correction.",
    verified: true,
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
