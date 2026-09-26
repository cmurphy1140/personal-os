"use client";

import Link from "next/link";
import { useEffect, useRef, type FormEvent, type KeyboardEvent, type RefObject } from "react";
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
  open: boolean;
  onClose: () => void;
  blocks: TranscriptBlock[];
  cwd: string;
  input: string;
  setInput: (value: string) => void;
  execute: (command: string) => void;
  onSubmit: (event: FormEvent) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  sessionRef: RefObject<HTMLDivElement | null>;
  verifiedCount: number;
  lastExit: number;
};

/* The terminal sits behind ⌘K and the >_ button as a modal dialog: a palette
   on wide screens, a sheet from the bottom on a phone. The native <dialog>
   supplies the focus trap, Escape and the inert page behind it. */
export default function TerminalPanel({ open, onClose, blocks, cwd, input, setInput, execute, onSubmit, onKeyDown, inputRef, sessionRef, verifiedCount, lastExit }: TerminalPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open, inputRef]);

  return (
    <dialog className="terminal" id="terminal" ref={dialogRef} aria-labelledby="terminal-title" onClose={onClose} onClick={(event) => { if (event.target === dialogRef.current) onClose(); }}>
      <div className="terminal-inner">
        <header className="terminal-head">
          <h2 className="terminal-title" id="terminal-title">Portfolio terminal</h2>
          <span className="terminal-meta">type <kbd>help</kbd> · <kbd>esc</kbd> closes</span>
          <button className="icon-button" type="button" aria-label="Close the terminal" onClick={onClose}><span aria-hidden="true">×</span></button>
        </header>
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
        <footer className="terminal-foot">
          <span>{verifiedCount} verified destinations</span>
          <span className={lastExit ? "terminal-exit terminal-exit--fail" : "terminal-exit"}>last exit {lastExit}</span>
        </footer>
      </div>
    </dialog>
  );
}
