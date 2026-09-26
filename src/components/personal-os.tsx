"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { destinations } from "@/data/destinations";
import { boot, completions, run, verifiedCount } from "@/components/shell";
import SiteHeader from "@/components/site-header";
import TerminalPanel, { type TranscriptBlock } from "@/components/terminal-panel";
import WorkPane from "@/components/work-pane";

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
      <SiteHeader />
      <section className="identity" aria-label="About Connor Murphy">
        <p className="identity-kicker">Connor Murphy · Software Engineer</p>
        <p className="identity-heading">B.S. Computer Science, University of New Hampshire</p>
        <p className="identity-line">Targeting entry-level software engineering and IT support roles. Ships backend pipelines and databases; developing an iOS app.</p>
        <Link className="chip identity-actions" href="/resume">résumé</Link>
      </section>
      <main className="planes">
        <WorkPane selected={selected} execute={execute} />
        <TerminalPanel blocks={blocks} cwd={cwd} input={input} setInput={setInput} execute={execute} onSubmit={onSubmit} onKeyDown={onKeyDown} inputRef={inputRef} sessionRef={sessionRef} />
      </main>
      <footer className="status-bar" aria-label="Portfolio status">
        <span className="status">{verifiedCount} verified destinations</span><span className="status">read-only manifest</span><span className={`status status--grow${lastExit ? " status--fail" : ""}`}>last exit {lastExit}</span>
      </footer>
    </div>
  );
}
