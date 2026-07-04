import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const PALETTE = [
  "#7c9eff", "#f7768e", "#9ece6a", "#e0af68", "#bb9af7",
  "#7dcfff", "#f6c177", "#c3e88d", "#ff9e64", "#89ddff",
];

export default function LanguageChart({ languages }) {
  const top = languages.slice(0, 8);
  const rest = languages.slice(8);
  const restPercent = rest.reduce((sum, l) => sum + l.percent, 0);
  const data = restPercent > 0 ? [...top, { name: "Other", percent: restPercent }] : top;

  if (data.length === 0) {
    return (
      <div className="reveal rounded-2xl bg-panel border border-white/10 p-6">
        <h3 className="text-sm font-semibold text-white/80 mb-2">Language Fingerprint</h3>
        <p className="text-sm text-white/40">Not enough public repo data to detect languages.</p>
      </div>
    );
  }

  return (
    <div className="reveal rounded-2xl bg-panel border border-white/10 p-6">
      <h3 className="text-sm font-semibold text-white/80 mb-4">Language Fingerprint</h3>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="percent"
              nameKey="name"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={2}
            >
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value}%`, name]}
              contentStyle={{ background: "#121722", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
            />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{ fontSize: 12, color: "#e7ebf3" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
