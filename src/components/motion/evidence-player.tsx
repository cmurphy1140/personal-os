"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useEffect, useRef, useState } from "react";

const chapters = [
  { title: "Read the record", claim: "Weather delayed the ferry.", record: "A passenger recalls a storm.", note: "A plausible claim, based on one account." },
  { title: "Meet the contradiction", claim: "But the timings do not fit.", record: "The weather cleared before departure.", note: "New evidence challenges the first explanation." },
  { title: "Revise the claim", claim: "The cause is still uncertain.", record: "Keep the account. Reconsider the conclusion.", note: "Revision makes uncertainty visible." },
];

export function EvidenceSequence() {
  const frame = useCurrentFrame();
  const index = Math.min(2, Math.floor(frame / 120));
  const chapter = chapters[index];
  const reveal = interpolate(frame % 120, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: "#1c1c1f", color: "#f3f1ec", padding: 40, fontFamily: "Arial, sans-serif", justifyContent: "center" }}>
    <div style={{ fontSize: 19, color: "#d9a95c", marginBottom: 28 }}>{index + 1} / 3 — {chapter.title}</div>
    <div style={{ opacity: reveal, transform: `translateY(${(1 - reveal) * 12}px)` }}>
      <div style={{ fontSize: 46, lineHeight: 1.08, letterSpacing: -2, maxWidth: 500 }}>{chapter.claim}</div>
      <div style={{ borderLeft: "3px solid #d9a95c", paddingLeft: 18, marginTop: 30, fontSize: 22, lineHeight: 1.4 }}>{chapter.record}</div>
    </div>
    <div style={{ position: "absolute", bottom: 0, left: 0, height: 4, background: "#d9a95c", width: `${(frame / 359) * 100}%` }} />
  </AbsoluteFill>;
}

export default function EvidencePlayer() {
  const ref = useRef<PlayerRef>(null);
  const [reduced, setReduced] = useState(true);
  const [chapter, setChapter] = useState(0);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReduced(query.matches); if (query.matches) ref.current?.pause(); };
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const player = ref.current;
    if (!player) return;
    const onFrame = ({ detail }: { detail: { frame: number } }) => setChapter(Math.min(2, Math.floor(detail.frame / 120)));
    player.addEventListener("frameupdate", onFrame);
    return () => player.removeEventListener("frameupdate", onFrame);
  }, [reduced]);
  return <div className="evidence-player">
    {reduced ? <div className="static-chapter"><p>{chapters[chapter].title}</p><h3>{chapters[chapter].claim}</h3><p>{chapters[chapter].record}</p></div> :
      <Player ref={ref} component={EvidenceSequence} compositionWidth={640} compositionHeight={400} durationInFrames={360} fps={30} controls autoPlay={false} loop={false} numberOfSharedAudioTags={0} showVolumeControls={false} style={{ width: "100%" }} errorFallback={() => <p>The animation could not load. Read the three steps below.</p>} />}
    <div className="chapter-controls" aria-label="Evidence story steps">{chapters.map((item, index) => <button key={item.title} aria-pressed={chapter === index} onClick={() => { setChapter(index); ref.current?.pause(); ref.current?.seekTo(index * 120 + 20); }}>{index + 1}. {item.title}</button>)}</div>
    <p className="chapter-note" aria-live="polite">{chapters[chapter].note}</p>
    <details className="motion-transcript"><summary>Read the full story</summary><ol>{chapters.map(item => <li key={item.title}><strong>{item.title}: </strong>{item.claim} {item.record} {item.note}</li>)}</ol></details>
  </div>;
}
