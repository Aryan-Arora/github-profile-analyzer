function scoreColor(score) {
  if (score >= 70) return "bg-emerald-400";
  if (score >= 40) return "bg-amber-400";
  return "bg-rose-400";
}

export default function RepoHealthList({ repos }) {
  return (
    <div className="reveal rounded-2xl bg-panel border border-white/10 p-6">
      <h3 className="text-sm font-semibold text-white/80 mb-4">Top Repos by Health Score</h3>
      <div className="space-y-4">
        {repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="block group"
          >
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-medium text-white/90 group-hover:text-accent transition-colors">
                {repo.name}
              </span>
              <span className="text-white/50 text-xs">{repo.score}/100</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className={`h-full ${scoreColor(repo.score)} rounded-full`}
                style={{ width: `${repo.score}%` }}
              />
            </div>
            <div className="flex gap-3 mt-1 text-[11px] text-white/40">
              {repo.language && <span>{repo.language}</span>}
              <span>★ {repo.stars}</span>
              <span>{repo.hasReadme ? "README ✓" : "No README"}</span>
              <span>Pushed {repo.daysSinceLastPush}d ago</span>
            </div>
          </a>
        ))}
        {repos.length === 0 && (
          <p className="text-sm text-white/40">No public repos found.</p>
        )}
      </div>
    </div>
  );
}
