import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import { destinations, findDestination } from "@/data/destinations";

export default function ResumePage() {
  const resume = findDestination("resume");
  const projects = destinations.filter((destination) => destination.kind === "case-study");
  return (
    <div className="frame">
      <header className="app-bar"><Link className="brand" href="/"><span className="eyebrow">CONNOR MURPHY</span><span className="brand-title">PERSONAL OS</span></Link><div className="bar-actions"><ThemeToggle /></div></header>
      <main className="doc">
        <Link className="doc-back" href="/">← return to terminal</Link>
        <header className="doc-head"><p className="work-kicker">resume · evidence index</p><h1 className="doc-title">Connor Murphy</h1><p className="doc-summary">{resume?.summary}</p></header>
        <section className="doc-section"><h2>Current public version</h2><p>The one-page resume is an evidence-backed snapshot of systems work, employment, technical skills, and education.</p><div className="doc-index"><a href="/Connor_Murphy_Resume.pdf" download><strong>Download PDF resume</strong><span>One page · verified September 20, 2026</span></a></div></section>
        <section className="doc-section"><h2>Selected systems work</h2><div className="doc-index">{projects.map((project) => <Link href={project.href} key={project.slug}><strong>{project.title}</strong><span>{project.status}</span></Link>)}</div></section>
      </main>
    </div>
  );
}
