import Link from "next/link";
import type { FormEvent, KeyboardEvent, RefObject } from "react";
import type { OutputLine } from "@/components/shell";

export type TranscriptBlock = {
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

type TerminalPanelProps = {
  blocks: TranscriptBlock[];
  cwd: string;
  input: string;
  setInput: (value: string) => void;
  execute: (command: string) => void;
  onSubmit: (event: FormEvent) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  sessionRef: RefObject<HTMLDivElement | null>;
};

export default function TerminalPanel({ blocks, cwd, input, setInput, execute, onSubmit, onKeyDown, inputRef, sessionRef }: TerminalPanelProps) {
  return (
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
  );
}
