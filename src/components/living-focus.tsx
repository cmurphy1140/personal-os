"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { findDestination } from "@/data/destinations";
const EvidencePlayer = dynamic(() => import("./motion/evidence-player"), { ssr: false, loading: () => <p className="motion-loading" role="status">Loading the short explainer…</p> });
export default function LivingFocus() {
  const [loaded, setLoaded] = useState(false);
  const project = findDestination("evidence-room")!;
  return <section className="focus-spread" aria-labelledby="focus-title">
    <div className="focus-copy"><p className="journal-date">On my desk / October 2026</p><h2 id="focus-title">Learning to<br />change my mind.</h2><p>Evidence Room starts with a small investigation: read the records, support a claim, and revise it when the story stops adding up.</p><p className="focus-status">Phase 1 scaffold. Learning in progress.</p><Link href={project.href}>Inside Evidence Room</Link></div>
    <div className="notebook"><div className="notebook-heading"><span>Evidence Room</span><span>A fictional case</span></div>
      {loaded ? <EvidencePlayer /> : <div className="notebook-poster"><span className="record-label">The first account</span><p className="claim-display">“The ferry stopped<br />because of the weather.”</p><div className="evidence-stamp">One record. An incomplete picture.</div><button className="button button--primary" onClick={() => setLoaded(true)}>Explore how a claim changes</button></div>}
      <p className="notebook-caption">Read. Connect. Reconsider. A short, silent illustration of the idea.</p>
    </div>
  </section>;
}
