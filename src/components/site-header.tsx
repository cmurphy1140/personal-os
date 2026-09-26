import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";

export default function SiteHeader() {
  return (
    <header className="app-bar">
      <Link className="brand" href="/"><span className="eyebrow">CONNOR MURPHY</span><span className="brand-title">PERSONAL OS</span></Link>
      <div className="bar-actions"><Link className="chip" href="/timeline">timeline</Link><Link className="chip" href="/resume">resume</Link><ThemeToggle /></div>
    </header>
  );
}
