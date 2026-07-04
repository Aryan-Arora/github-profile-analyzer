import { useState } from "react";

function UserInput({ value, onChange, placeholder }) {
  return (
    <div className="flex items-center gap-2 flex-1 rounded-full bg-surface border border-border pl-4 pr-4 py-3 focus-within:border-primary/60 transition-colors">
      <span className="material-symbols-outlined text-text-muted text-[18px]">person</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-text-muted/70"
      />
    </div>
  );
}

export default function CompareBar({ onCompare, loading }) {
  const [userA, setUserA] = useState("");
  const [userB, setUserB] = useState("");

  const ready = userA.trim() && userB.trim();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) onCompare(userA.trim(), userB.trim());
      }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <UserInput value={userA} onChange={setUserA} placeholder="First username" />
        <span className="self-center shrink-0 font-data text-[11px] font-semibold text-text-muted bg-surface border border-border rounded-md px-2.5 py-1.5 tracking-widest">
          VS
        </span>
        <UserInput value={userB} onChange={setUserB} placeholder="Second username" />
      </div>
      <div className="mt-4 flex justify-center">
        <button
          type="submit"
          disabled={loading || !ready}
          className="rounded-full bg-primary text-canvas font-heading font-semibold px-8 py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-dim transition-colors glow-primary"
        >
          {loading ? "Comparing…" : "Compare Profiles"}
        </button>
      </div>
    </form>
  );
}
