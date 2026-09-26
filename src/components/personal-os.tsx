"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { destinations, type Destination } from "@/data/destinations";
import {
  boot,
  completions,
  run,
  type OutputLine,
  verifiedCount,
  viewCommand,
} from "@/components/shell";
import ThemeToggle from "@/components/theme-toggle";

type TranscriptBlock = {
  id: number;
  command?: string;
  cwd: string;
  lines: OutputLine[];
};

function Lines({ lines, execute }: { lines: OutputLine[]; execute: (command: string) => void }) {
  return lines.map((line, index) => {
    if (line.kind === "listing") {
      return (
        <div className="listing" key={index}>
          {line.entries.map((entry) => (
            <button className={`fs fs--${entry.type}`} key={entry.command} type="button" onClick={() => execute(entry.command)}>
              {entry.label}
            </button>
          ))}
        </div>
      );
    }
    if (line.kind === "link") {
      return <p className="out" key={index}><Link href={line.href} target={line.external ? "_blank" : undefined} rel={line.external ? "noopener noreferrer" : undefined}>{line.label}</Link></p>;
    }
    const className = line.kind === "out"
      ? `out${line.title ? " out--title" : ""}${line.tone ? ` out--${line.tone}` : ""}`
      : line.kind;
    return <p className={className} key={index}>{line.text}</p>;
  });
}

function WorkPane({ selected, execute }: { selected: Destination; execute: (command: string) => void }) {
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
        {destinations.map((destination) => (
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

export default function PersonalOS() {
  const router = useRouter();
  const initial = useMemo(() => boot(), []);
  const [blocks, setBlocks] = useState<TranscriptBlock[]>([{ id: 0, cwd: initial.cwd, lines: initial.lines }]);
  const [cwd, setCwd] = useState(initial.cwd);
  const [history, setHistory] = useState<string[]>([]);
  const [historyAt, setHistoryAt] = useState(0);
  const [input, setInput] = useState("");
  const [selectedSlug, setSelectedSlug] = useState("vero");
  const [lastExit, setLastExit] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionRef = useRef<HTMLDivElement>(null);
  const selected = destinations.find((item) => item.slug === selectedSlug) ?? destinations[0];

  const execute = (raw: string) => {
    const command = raw.trim();
    if (!command) return;
    const result = run(command, { cwd, history });
    const nextHistory = [...history, command];
    setHistory(nextHistory);
    setHistoryAt(nextHistory.length);
    setInput("");
    setCwd(result.cwd);
    setLastExit(result.exit);
    if (result.select) setSelectedSlug(result.select);
    if (result.clear) {
      const fresh = boot();
      setBlocks([{ id: Date.now(), cwd: fresh.cwd, lines: fresh.lines }]);
      setCwd(fresh.cwd);
    } else {
      setBlocks((current) => [...current, { id: Date.now(), command, cwd, lines: result.lines }]);
    }
    if (result.external) window.location.assign(result.external);
    else if (result.navigate) router.push(result.navigate);
  };

  useEffect(() => {
    sessionRef.current?.scrollTo({ top: sessionRef.current.scrollHeight, behavior: "smooth" });
  }, [blocks]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    execute(input);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Tab") {
      const matches = completions(input, cwd);
      if (matches.length === 1) {
        event.preventDefault();
        const parts = input.split(/\s+/);
        parts[parts.length - 1] = matches[0];
        setInput(parts.join(" "));
      }
    }
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const step = event.key === "ArrowUp" ? -1 : 1;
      const next = Math.max(0, Math.min(history.length, historyAt + step));
      setHistoryAt(next);
      setInput(next === history.length ? "" : history[next] ?? "");
    }
    if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      execute("clear");
    }
  };

  return (
    <div className="frame">
      <a className="skip-link" href="#selected-work-title">Skip to selected work</a>
      <header className="app-bar">
        <Link className="brand" href="/"><span className="eyebrow">CONNOR MURPHY</span><span className="brand-title">PERSONAL OS</span></Link>
        <div className="bar-actions"><Link className="chip" href="/timeline">timeline</Link><Link className="chip" href="/resume">resume</Link><ThemeToggle /></div>
      </header>
      <main className="planes">
        <WorkPane selected={selected} execute={execute} />
        <section className="pane pane--terminal" aria-labelledby="terminal-title">
          <header className="pane-head"><h2 className="pane-title" id="terminal-title">portfolio terminal</h2><span className="pane-meta">static router · no host access</span></header>
          <div className="session" ref={sessionRef} aria-live="polite" onClick={() => inputRef.current?.focus()}>
            {blocks.map((block) => (
              <div className={`block${block.command ? "" : " block--banner"}`} key={block.id}>
                {block.command ? <p className="echo"><span className="ps">connor@work</span><span className="path">{block.cwd}</span>$ {block.command}</p> : null}
                <Lines lines={block.lines} execute={execute} />
              </div>
            ))}
          </div>
          <form className="prompt" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="shell-input">Portfolio command</label>
            <span className="ps1">connor@work</span><span className="path">{cwd}</span><span className="ps">$</span>
            <input className="prompt-input" id="shell-input" ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={onKeyDown} autoCapitalize="off" autoComplete="off" autoCorrect="off" spellCheck={false} enterKeyHint="go" placeholder="help" />
          </form>
        </section>
      </main>
      <footer className="status-bar" aria-label="Portfolio status">
        <span className="status">{verifiedCount} verified destinations</span><span className="status">read-only manifest</span><span className={`status status--grow${lastExit ? " status--fail" : ""}`}>last exit {lastExit}</span>
      </footer>
    </div>
  );
}
