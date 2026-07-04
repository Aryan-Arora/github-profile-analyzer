import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const PALETTE = [
  "#58a6ff", "#39d353", "#bb9af7", "#e0af68", "#f7768e",
  "#7dcfff", "#ff9e64", "#9ece6a", "#c3e88d", "#89ddff",
];

export default function LanguageChart({ languages }) {
  const top = languages.slice(0, 6);
  const rest = languages.slice(6);
  const restPercent = rest.reduce((sum, l) => sum + l.percent, 0);
  const data = restPercent > 0 ? [...top, { name: "Other", percent: restPercent }] : top;

  if (data.length === 0) {
    return (
      <div className="reveal rounded-lg bg-surface border border-border p-6">
        <h3 className="font-heading text-sm font-semibold text-text mb-2">Languages &amp; Skills</h3>
        <p className="text-sm text-text-muted">Not enough public repo data to detect languages.</p>
      </div>
    );
  }

  const dominant = data[0];

  return (
    <div className="reveal rounded-lg bg-surface border border-border p-6">
      <h3 className="font-heading text-sm font-semibold text-text mb-4">Languages &amp; Skills</h3>

      <div className="flex items-center gap-6">
        <div className="relative shrink-0" style={{ width: 160, height: 160 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="percent"
                nameKey="name"
                innerRadius={52}
                outerRadius={78}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((entry, i) => (
                  <Cell key={entry.name} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-data text-2xl font-bold text-text">{dominant.percent}%</span>
            <span className="text-[11px] text-text-muted text-center px-4">{dominant.name}</span>
          </div>
        </div>

        <div className="flex-1 space-y-3 min-w-0">
          {data.map((lang, i) => (
            <div key={lang.name}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-text truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                  />
                  {lang.name}
                </span>
                <span className="font-data text-text-muted shrink-0 ml-2">{lang.percent}%</span>
              </div>
              <div className="h-1 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${lang.percent}%`, backgroundColor: PALETTE[i % PALETTE.length] }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
