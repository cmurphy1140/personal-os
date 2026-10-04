import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import { destinations, findDestination } from "@/data/destinations";

export function generateStaticParams() {
  return destinations.filter((destination) => destination.kind === "case-study").map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const destination = findDestination(slug);
  return destination ? { title: `${destination.shortTitle} — Connor Murphy`, description: destination.summary } : {};
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = findDestination(slug);
  if (!destination || destination.kind !== "case-study") notFound();
  const label = "category" in destination ? destination.category : "Case study";
  return (
    <div className="frame">
      <SiteHeader />
      <main className="doc">
        <Link className="doc-back" href="/#work">← All work</Link>
        <header className="doc-head">
          <p className="card-label"><span>{label}</span>{destination.verified ? null : <span className="badge">{destination.status}</span>}</p>
          <h1 className="doc-title">{destination.title}</h1>
          <p className="doc-summary">{destination.summary}</p>
          <p className="doc-status">{destination.status}</p>
          {"tags" in destination ? <ul className="tags" aria-label="Tools">{destination.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul> : null}
        </header>
        <hr className="centre-line" />
        <section className="doc-section" aria-labelledby="evidence-title"><h2 id="evidence-title">Evidence</h2><ul className="evidence">{destination.evidence.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section className="doc-section" aria-labelledby="learning-title"><h2 id="learning-title">What this taught</h2><p className="learning">{destination.learning}</p></section>
      </main>
    </div>
  );
}
