import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import { destinations, findDestination } from "@/data/destinations";

export const metadata: Metadata = {
  title: "Résumé — Connor Murphy",
  description: "Connor Murphy's one-page résumé and the project evidence behind it.",
};

export default function ResumePage() {
  const resume = findDestination("resume");
  const projects = destinations.filter((destination) => destination.kind === "case-study");
  return (
    <div className="frame">
      <SiteHeader />
      <main className="doc">
        <Link className="doc-back" href="/">← Home</Link>
        <header className="doc-head">
          <p className="card-label"><span>RÉSUMÉ · EVIDENCE INDEX</span></p>
          <h1 className="doc-title">Connor Murphy</h1>
          <p className="doc-summary">{resume?.summary}</p>
          <div className="hero-actions"><a className="button button--primary" href="/Connor_Murphy_Resume.pdf" download>Download résumé</a></div>
          <p className="doc-status">One page · PDF · verified September 20, 2026</p>
        </header>
        <hr className="centre-line" />
        <section className="doc-section" aria-labelledby="projects-title">
          <h2 id="projects-title">Selected systems work</h2>
          {/* Only a verified destination is linked; the rest show their state. */}
          <ul className="doc-index">
            {projects.map((project) => (
              <li key={project.slug}>
                {project.verified ? (
                  <Link href={project.href}><strong>{project.title}</strong><span>{project.status}</span></Link>
                ) : (
                  <div><strong>{project.title}</strong><span>{project.status} · case study not yet verified</span></div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
