import { useState } from "react";

export default function SearchBar({ onSearch, loading, token, onTokenChange }) {
  const [username, setUsername] = useState("");
  const [showToken, setShowToken] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="flex gap-2">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="GitHub username, e.g. torvalds"
          className="flex-1 rounded-lg bg-panel border border-white/10 px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !token}
          className="rounded-lg bg-accent text-black font-medium px-5 py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
        >
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </div>

      <div className="mt-3 text-xs text-white/50">
        <button
          type="button"
          onClick={() => setShowToken((v) => !v)}
          className="underline decoration-dotted hover:text-white/80"
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
            className="w-full rounded-lg bg-panel border border-white/10 px-4 py-2 text-sm outline-none focus:border-accent transition-colors"
          />
          <p className="mt-1 text-[11px] text-white/40">
            GitHub's GraphQL API requires authentication even for public data.
            Your token is only sent from your browser to your own server and is
            never stored anywhere except your browser's local storage.
          </p>
        </div>
      )}

      {!token && (
        <p className="mt-2 text-[11px] text-amber-400/80">
          A personal access token (no scopes needed, just create a
          "fine-grained" or classic token) is required to run an analysis.
        </p>
      )}
    </form>
  );
}
