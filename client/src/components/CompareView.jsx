const LANG_COLORS = [
  "#58a6ff", "#39d353", "#bb9af7", "#e0af68", "#f7768e",
];

function ProfileCard({ data, accent }) {
  const p = data.profile;
  return (
    <div className={`reveal card p-6 text-center border-t-2 ${accent === "left" ? "border-t-secondary" : "border-t-primary"}`}>
      <img
        src={p.avatarUrl}
        alt={p.login}
        className="w-20 h-20 rounded-full border-2 border-border mx-auto"
      />
      <h3 className="font-heading text-lg font-semibold mt-3">{p.name || p.login}</h3>
      <a
        href={`https://github.com/${p.login}`}
        target="_blank"
        rel="noreferrer"
        className="font-data text-xs text-secondary hover:underline"
      >
        @{p.login}
      </a>
      <p className={`font-data text-[11px] uppercase tracking-wider mt-2 ${accent === "left" ? "text-secondary" : "text-primary"}`}>
        {data.personaTag}
      </p>
      <div className="flex flex-wrap justify-center gap-1.5 mt-4">
        {data.languages.slice(0, 3).map((l) => (
          <span key={l.name} className="font-data text-[10px] text-text-muted bg-canvas border border-border rounded-md px-2 py-1">
            {l.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function MetricRow({ label, a, b, format = (v) => v.toLocaleString() }) {
  const aWins = a > b;
  const bWins = b > a;

  function cell(value, wins, align) {
    return (
      <div className={`flex items-center gap-2 ${align === "right" ? "justify-end" : ""}`}>
        {wins && align === "right" && (
          <span className="font-data text-[9px] font-semibold text-primary bg-primary/10 rounded px-1.5 py-0.5 tracking-widest">LEAD</span>
        )}
        <span className={`font-data text-lg font-semibold ${wins ? "text-primary" : "text-text"}`}>
          {format(value)}
        </span>
        {wins && align === "left" && (
          <span className="font-data text-[9px] font-semibold text-primary bg-primary/10 rounded px-1.5 py-0.5 tracking-widest">LEAD</span>
        )}
      </div>
    );
  }

  const total = (a || 0) + (b || 0);
  const leftPct = total === 0 ? 50 : Math.round((a / total) * 100);

  return (
    <div className="py-4 border-b border-border last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        {cell(a, aWins, "left")}
        <span className="font-data text-[11px] uppercase tracking-wider text-text-muted px-4 text-center">
          {label}
        </span>
        {cell(b, bWins, "right")}
      </div>
      <div className="flex h-1 rounded-full overflow-hidden bg-border">
        <div className="bg-secondary/80 rounded-l-full" style={{ width: `${leftPct}%` }} />
        <div className="bg-primary/80 rounded-r-full" style={{ width: `${100 - leftPct}%` }} />
      </div>
    </div>
  );
}

function LanguageColumn({ data, accent }) {
  const top = data.languages.slice(0, 5);
  return (
    <div>
      <p className={`font-data text-[11px] uppercase tracking-wider mb-3 ${accent === "left" ? "text-secondary" : "text-primary"}`}>
        @{data.profile.login}
      </p>
      <div className="space-y-3">
        {top.map((lang, i) => (
          <div key={lang.name}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-text">{lang.name}</span>
              <span className="font-data text-text-muted">{lang.percent}%</span>
            </div>
            <div className="h-1 rounded-full bg-border overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${lang.percent}%`, backgroundColor: LANG_COLORS[i % LANG_COLORS.length] }}
              />
            </div>
          </div>
        ))}
        {top.length === 0 && <p className="text-xs text-text-muted">No language data</p>}
      </div>
    </div>
  );
}

export default function CompareView({ left, right }) {
  return (
    <div className="space-y-5">
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5">
        <ProfileCard data={left} accent="left" />
        <ProfileCard data={right} accent="right" />
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-canvas border border-border items-center justify-center font-data text-xs font-bold text-text-muted z-10">
          VS
        </div>
      </div>

      <div className="reveal card p-6">
        <h3 className="font-heading text-sm font-semibold mb-2">Key Metrics</h3>
        <MetricRow label="Followers" a={left.profile.followers} b={right.profile.followers} />
        <MetricRow label="Total Stars" a={left.totals?.stars ?? 0} b={right.totals?.stars ?? 0} />
        <MetricRow label="Contributions / Year" a={left.calendar.totalContributions} b={right.calendar.totalContributions} />
        <MetricRow label="Consistency Score" a={left.consistency.score} b={right.consistency.score} format={(v) => `${v}/100`} />
        <MetricRow label="Avg Repo Health" a={left.totals?.avgHealth ?? 0} b={right.totals?.avgHealth ?? 0} format={(v) => `${v}/100`} />
        <MetricRow label="Public Repos" a={left.profile.publicRepos} b={right.profile.publicRepos} />
      </div>

      <div className="reveal card p-6">
        <h3 className="font-heading text-sm font-semibold mb-5">Language Proficiency</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <LanguageColumn data={left} accent="left" />
          <LanguageColumn data={right} accent="right" />
        </div>
      </div>
    </div>
  );
}
