import type { CSSProperties } from "react";
import Link from "next/link";
import { findDestination } from "@/data/destinations";
import { formatRange, startValue, timeline, type TimelineEntry } from "@/data/timeline";

/* The dated record drawn as a road: one mile marker per entry, in order, with
   the dates exactly as src/data/timeline.ts states them. The markers are evenly
   spaced; /timeline draws the same record to scale. Across on wide screens,
   down on narrow ones. */

const laneLabel: Record<TimelineEntry["lane"], string> = {
  work: "Work",
  projects: "Project",
  education: "Education",
};

const entries = [...timeline].sort((a, b) => startValue(a.start) - startValue(b.start));

/* Only a verified destination is linked; anything else stays plain text. */
function linkFor(entry: TimelineEntry) {
  if (!entry.slug) return null;
  const destination = findDestination(entry.slug);
  return destination?.verified ? destination.href : null;
}

export default function Road() {
  return (
    <section className="road" id="road" aria-labelledby="road-title">
      <div className="section-head">
        <p className="section-kicker">Dated from the résumé</p>
        <h2 className="section-title" id="road-title">The road so far</h2>
      </div>
      <ol className="road-stops" style={{ "--stops": entries.length } as CSSProperties}>
        {entries.map((entry, index) => {
          const href = linkFor(entry);
          return (
            <li className={`stop stop--${entry.lane}${index % 2 ? " stop--low" : ""}`} key={entry.id} style={{ "--at": index } as CSSProperties}>
              <span className="stop-post" aria-hidden="true" />
              <p className="stop-when">{formatRange(entry)}<span className="stop-lane"> · {laneLabel[entry.lane]}</span></p>
              <p className="stop-title">{href ? <Link href={href}>{entry.title}</Link> : entry.title}</p>
              <p className="stop-org">{entry.org}</p>
            </li>
          );
        })}
      </ol>
      <p className="road-more"><Link href="/timeline">See the same record drawn to scale →</Link></p>
    </section>
  );
}
