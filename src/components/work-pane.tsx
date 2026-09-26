import Link from "next/link";
import { destinations, type Destination } from "@/data/destinations";
import { viewCommand } from "@/components/shell";

export default function WorkPane({ selected, execute }: { selected: Destination; execute: (command: string) => void }) {
  const destinationLabel = selected.href.startsWith("https://github.com/")
    ? "Open repository"
    : selected.kind === "artifact"
      ? `Open ${selected.shortTitle.toLowerCase()}`
      : "Open case study";
  return (
    <section className="pane pane--work" aria-labelledby="selected-work-title">
      <header className="pane-head">
        <h2 className="pane-title" id="selected-work-title">selected work</h2>
        <span className="pane-meta">{selected.status}</span>
      </header>
      <nav className="work-picker" aria-label="Portfolio destinations">
        {destinations.filter((destination) => destination.primary).map((destination) => (
          <button className="work-tab" type="button" aria-pressed={destination.slug === selected.slug} key={destination.slug} onClick={() => execute(viewCommand(destination))}>
            {destination.shortTitle}
          </button>
        ))}
      </nav>
      <div className="work-body">
        <p className="work-kicker">{selected.kind} · {selected.status}</p>
        <h1 className="work-title">{selected.title}</h1>
        <p className="work-summary">{selected.summary}</p>
        <p className="section-label"><span className="sigil">$</span> evidence --published</p>
        <ul className="evidence">{selected.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
        <p className="section-label"><span className="sigil">$</span> cat learning/{selected.slug}</p>
        <p className="learning">{selected.learning}</p>
        <Link className="destination" href={selected.href}>
          <span className="sigil" aria-hidden="true">$</span>
          {destinationLabel}
        </Link>
        <p className="destination-note">Terminal equivalent: open {selected.slug}</p>
      </div>
    </section>
  );
}
