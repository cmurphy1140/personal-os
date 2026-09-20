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
