import { useState } from "react";

const POPULAR = ["torvalds", "gaearon", "sindresorhus"];

export default function SearchBar({ onSearch, loading, token, onTokenChange }) {
  const [username, setUsername] = useState("");
  const [showToken, setShowToken] = useState(false);

  function submit(name) {
    const trimmed = (name ?? username).trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="flex items-center gap-2 rounded-full bg-surface border border-border pl-4 pr-1.5 py-1.5 focus-within:border-primary/60 transition-colors">
        <span className="material-symbols-outlined text-text-muted text-[20px]">search</span>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username (e.g. torvalds)"
          className="flex-1 bg-transparent outline-none text-sm py-1.5 placeholder:text-text-muted/70"
        />
        <button
          type="submit"
          disabled={loading || !token}
          className="rounded-full bg-primary text-[#04260d] font-heading font-semibold px-5 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-dim transition-colors"
        >
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-text-muted font-data">
        <span>Popular:</span>
        {POPULAR.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              setUsername(name);
              submit(name);
            }}
            className="text-secondary hover:underline"
          >
            @{name}
          </button>
        ))}
      </div>

      <div className="mt-4 text-xs text-text-muted">
        <button
          type="button"
          onClick={() => setShowToken((v) => !v)}
          className="underline decoration-dotted hover:text-text transition-colors"
        >
          {showToken ? "Hide token field" : "Add a GitHub token (required)"}
        </button>
      </div>

      {showToken && (
        <div className="mt-2">
          <input
            type="password"
            value={token}
            onChange={(e) => onTokenChange(e.target.value)}
            placeholder="ghp_… personal access token"
            className="w-full rounded-full bg-surface border border-border px-4 py-2.5 text-sm outline-none focus:border-primary/60 transition-colors"
          />
          <p className="mt-2 text-[11px] text-text-muted leading-relaxed">
            GitHub's GraphQL API requires authentication even for public data.
            Your token is only sent from your browser to your own server and is
            never stored anywhere except your browser's local storage.
          </p>
        </div>
      )}

      {!token && (
        <p className="mt-2 text-[11px] text-amber-400/80">
          A personal access token (no scopes needed — a classic or fine-grained
          token both work) is required to run an analysis.
        </p>
      )}
    </form>
  );
}
