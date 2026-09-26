import Link from "next/link";
import type { MouseEvent } from "react";
import { destinations } from "@/data/destinations";

/* The projects as mile markers. A card for a verified destination is a real
   link, but a plain click runs `open <slug>` through the same command engine
   the terminal uses; modified clicks (new tab, new window) keep the browser's
   own behaviour. An unverified destination is shown with its state and is not
   linked, exactly as `open` refuses it. */

export const projects = destinations.filter((destination) => destination.kind === "case-study" && destination.primary);

/** "MILE 01 · TOOL · PYTHON": the card's position, category and first tool. */
export function mileLabel(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  const project = projects[index];
  if (!project) return null;
  const mile = `MILE ${String(index + 1).padStart(2, "0")}`;
  return [mile, project.category, project.tags?.[0]].filter(Boolean).join(" · ").toUpperCase();
}

export default function WorkPane({ execute }: { execute: (command: string) => void }) {
  const onOpen = (slug: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    execute(`open ${slug}`);
  };

  return (
    <section className="work" id="work" aria-labelledby="work-title">
      <div className="section-head">
        <p className="section-kicker">Projects</p>
        <h2 className="section-title" id="work-title">Selected work</h2>
      </div>
      <ul className="cards">
        {projects.map((project) => {
          const label = mileLabel(project.slug);
          return (
            <li key={project.slug}>
              <article className={`card${project.verified ? "" : " card--pending"}`}>
                <p className="card-label">
                  <span>{label}</span>
                  {project.verified ? null : <span className="badge">{project.status}</span>}
                </p>
                <h3 className="card-title">
                  {project.verified ? (
                    <Link className="card-link" href={project.href} onClick={onOpen(project.slug)}>{project.title}</Link>
                  ) : project.title}
                </h3>
                <p className="card-summary">{project.summary}</p>
                <ul className="tags" aria-label="Tools">
                  {project.tags?.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                {project.verified ? <span className="card-arrow" aria-hidden="true">→</span> : null}
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
