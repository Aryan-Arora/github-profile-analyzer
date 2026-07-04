import { useEffect, useRef } from "react";
import gsap from "gsap";

// The terminal window keeps its own fixed dark palette in both themes —
// a dark console on the light theme reads as intentional contrast.
const TERMINAL_LINES = [
  { prefix: "$", text: "analyze @torvalds", cls: "text-[#f5efe3]" },
  { prefix: "▸", text: "fetching profile … done (312ms)", cls: "text-[#a3988a]" },
  { prefix: "▸", text: "scanning 9 repositories … done", cls: "text-[#a3988a]" },
  { prefix: "▸", text: "bucketing 441 commits by hour-of-day … done", cls: "text-[#a3988a]" },
  { prefix: "✓", text: 'persona → "Meticulous Night-Owl Systems Builder"', cls: "text-[#ffb224]" },
  { prefix: "✓", text: "consistency 63/100 · top language C 97.9% · streak 67d", cls: "text-[#5bc7d8]" },
];

const FEATURES = [
  {
    icon: "fingerprint",
    title: "Developer Persona",
    body: "A shareable identity tag derived from tech stack, commit rhythm, and repo quality — not just a stats dump.",
  },
  {
    icon: "calendar_month",
    title: "Contribution DNA",
    body: "A year of activity distilled: heatmap, streaks, consistency score, and the hours a developer actually ships.",
  },
  {
    icon: "compare_arrows",
    title: "Head-to-Head",
    body: "Put two profiles side by side with per-metric leader badges — built for screening and friendly rivalry alike.",
  },
];

export default function Landing() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".landing-reveal",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.15 }
      );
      gsap.fromTo(
        ".terminal-line",
        { opacity: 0 },
        { opacity: 1, duration: 0.3, stagger: 0.3, ease: "none", delay: 0.6 }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="mt-14">
      {/* Terminal demo */}
      <div className="landing-reveal max-w-2xl mx-auto rounded-xl border border-[#40382a] bg-[#1a1510] shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#40382a] bg-[#211b13]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <span className="font-data text-[11px] text-[#a3988a] ml-2">
            profile-analyzer — demo
          </span>
        </div>
        <div className="p-5 font-data text-[13px] leading-relaxed">
          {TERMINAL_LINES.map((line, i) => (
            <p key={i} className={`terminal-line ${line.cls}`}>
              <span className="text-[#e0961a] mr-2">{line.prefix}</span>
              {line.text}
            </p>
          ))}
          <p className="terminal-line text-[#f5efe3]">
            <span className="text-[#e0961a] mr-2">$</span>
            <span className="cursor-blink inline-block w-2 h-4 bg-[#ffb224] align-middle" />
          </p>
        </div>
      </div>

      {/* Feature trio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14 max-w-4xl mx-auto">
        {FEATURES.map((f) => (
          <div key={f.title} className="landing-reveal card card-hover p-6">
            <span className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary text-[18px]">{f.icon}</span>
            </span>
            <h3 className="font-heading text-sm font-semibold">{f.title}</h3>
            <p className="text-xs text-text-muted leading-relaxed mt-2">{f.body}</p>
          </div>
        ))}
      </div>

      {/* Footnote strip */}
      <p className="landing-reveal text-center font-data text-[11px] text-text-muted mt-12 tracking-wider uppercase">
        No sign-up · No candidate tokens · Public data only
      </p>
    </div>
  );
}
