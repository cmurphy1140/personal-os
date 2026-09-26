import type { CSSProperties } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import { findDestination } from "@/data/destinations";
import {
  asOfValue,
  endValue,
  formatDate,
  formatRange,
  isYearPrecision,
  startValue,
  timeline,
  TIMELINE_AS_OF,
  TIMELINE_FIRST_YEAR,
  TIMELINE_LAST_YEAR,
  timelineLanes,
  type TimelineEntry,
} from "@/data/timeline";

export const metadata = {
  title: "Timeline — Connor Murphy",
  description: "Work, projects and education by date, from Connor Murphy's verified resume.",
};

const years = Array.from(
  { length: TIMELINE_LAST_YEAR - TIMELINE_FIRST_YEAR + 1 },
  (_, index) => TIMELINE_FIRST_YEAR + index,
);
const span = years.length;

/** A position on the axis as a percentage of the track. */
function at(value: number) {
  const clamped = Math.min(Math.max(value, TIMELINE_FIRST_YEAR), TIMELINE_LAST_YEAR + 1);
  return ((clamped - TIMELINE_FIRST_YEAR) / span) * 100;
}

const now = at(asOfValue());

/* Only a verified destination is linked; anything else stays plain text. */
function linkFor(entry: TimelineEntry) {
  if (!entry.slug) return null;
  const destination = findDestination(entry.slug);
  return destination?.verified ? destination.href : null;
}

function Bar({ entry, index }: { entry: TimelineEntry; index: number }) {
  const left = at(startValue(entry.start));
  const style = {
    "--left": `${left}%`,
    "--width": `${Math.max(at(endValue(entry)) - left, 0)}%`,
    "--i": index,
  } as CSSProperties;
  const shape = entry.milestone ? "tl-mark--point" : isYearPrecision(entry) ? "tl-mark--year" : "tl-mark--month";
  const ongoing = !entry.milestone && !entry.end;
  return <span className={`tl-mark ${shape}${ongoing ? " tl-mark--ongoing" : ""}`} style={style} aria-hidden="true" />;
}

export default function TimelinePage() {
  return (
    <div className="frame">
      <header className="app-bar"><Link className="brand" href="/"><span className="eyebrow">CONNOR MURPHY</span><span className="brand-title">PERSONAL OS</span></Link><div className="bar-actions"><Link className="chip" href="/resume">resume</Link><ThemeToggle /></div></header>
      <main className="doc doc--wide">
        <Link className="doc-back" href="/">← return to terminal</Link>
        <header className="doc-head">
          <p className="work-kicker">timeline · dated from the verified resume</p>
          <h1 className="doc-title">Work, projects and education, to scale</h1>
          <p className="doc-summary">Each entry keeps the precision the resume gives it. A month is drawn as a month; a year the resume states without a month is drawn as the whole year and hatched, so no date is sharper here than in the source.</p>
        </header>

        <section className="doc-section tl" aria-labelledby="tl-axis-title" style={{ "--years": span } as CSSProperties}>
          <h2 id="tl-axis-title">{TIMELINE_FIRST_YEAR} – {formatDate(TIMELINE_AS_OF)}</h2>
          <div className="tl-row tl-row--axis" aria-hidden="true">
            <span />
            <div className="tl-track tl-track--axis">
              {years.map((year) => <span className="tl-year" key={year} style={{ "--left": `${at(year)}%` } as CSSProperties}>{year}</span>)}
            </div>
          </div>
          {timelineLanes.map((lane) => {
            const entries = timeline.filter((entry) => entry.lane === lane);
            return (
              <div className="tl-lane" key={lane}>
                <h3 className="tl-lane-title"><span className="sigil">$</span> ls {lane}</h3>
                <ol className="tl-list">
                  {entries.map((entry) => {
                    const href = linkFor(entry);
                    return (
                      <li className="tl-row" key={entry.id}>
                        <div className="tl-label">
                          <p className="tl-range">{formatRange(entry)}{isYearPrecision(entry) ? " · year precision" : ""}</p>
                          <p className="tl-title">{href ? <Link href={href}>{entry.title}</Link> : entry.title}</p>
                          <p className="tl-org">{entry.org}</p>
                          <p className="tl-note">{entry.note}</p>
                        </div>
                        <div className="tl-track" style={{ "--now": `${now}%` } as CSSProperties}>
                          <Bar entry={entry} index={timeline.indexOf(entry)} />
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          })}
          <ul className="tl-legend" aria-label="How to read the timeline">
            <li><span className="tl-key tl-key--month" aria-hidden="true" />month precision</li>
            <li><span className="tl-key tl-key--year" aria-hidden="true" />year precision</li>
            <li><span className="tl-key tl-key--point" aria-hidden="true" />single date</li>
            <li><span className="tl-key tl-key--now" aria-hidden="true" />as of {formatDate(TIMELINE_AS_OF)}</li>
          </ul>
        </section>

        <section className="doc-section">
          <h2>Terminal equivalent</h2>
          <p>The same record prints in the portfolio terminal with <code>cat experience</code>, newest first. <code>open timeline</code> brings you back here.</p>
        </section>
      </main>
    </div>
  );
}
