function scoreStyles(score) {
  if (score >= 70) return "bg-primary/10 text-primary";
  if (score >= 40) return "bg-amber-400/10 text-amber-400";
  return "bg-rose-400/10 text-rose-400";
}

function pushedLabel(days) {
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.round(days / 30)} months ago`;
  return `${Math.round(days / 365)} years ago`;
}

export default function RepoHealthList({ repos }) {
  return (
    <div className="reveal card p-6">
      <h3 className="font-heading text-sm font-semibold text-text mb-4">Repository Analysis</h3>
      <div className="space-y-3">
        {repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg border border-border bg-canvas/40 p-4 card-hover group"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-heading font-semibold text-text group-hover:text-primary transition-colors">
                {repo.name}
              </span>
              <span className={`font-data text-xs font-semibold rounded-full px-2.5 py-1 shrink-0 ${scoreStyles(repo.score)}`}>
                {repo.score}
              </span>
            </div>
            {repo.description && (
              <p className="text-xs text-text-muted mt-1.5 line-clamp-2">{repo.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] font-data text-text-muted">
              {repo.language && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  {repo.language}
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">star</span>
                {repo.stars}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">schedule</span>
                {pushedLabel(repo.daysSinceLastPush)}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">
                  {repo.hasReadme ? "check_circle" : "cancel"}
                </span>
                README
              </span>
            </div>
          </a>
        ))}
        {repos.length === 0 && (
          <p className="text-sm text-text-muted">No public repos found.</p>
        )}
      </div>
    </div>
  );
}
