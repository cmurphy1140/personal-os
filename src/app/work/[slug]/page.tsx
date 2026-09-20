import Link from "next/link";
import { notFound } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";
import { destinations, findDestination } from "@/data/destinations";

export function generateStaticParams() {
  return destinations.filter((destination) => destination.kind === "case-study").map((destination) => ({ slug: destination.slug }));
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = findDestination(slug);
  if (!destination || destination.kind !== "case-study") notFound();
  return (
    <div className="frame">
      <header className="app-bar"><Link className="brand" href="/"><span className="eyebrow">CONNOR MURPHY</span><span className="brand-title">PERSONAL OS</span></Link><div className="bar-actions"><ThemeToggle /></div></header>
      <main className="doc">
        <Link className="doc-back" href="/">← return to terminal</Link>
        <header className="doc-head"><p className="work-kicker">{destination.kind} · {destination.status}</p><h1 className="doc-title">{destination.title}</h1><p className="doc-summary">{destination.summary}</p></header>
        <section className="doc-section"><h2>Evidence</h2><ul className="evidence">{destination.evidence.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section className="doc-section"><h2>What this taught</h2><p>{destination.learning}</p></section>
      </main>
    </div>
  );
}
