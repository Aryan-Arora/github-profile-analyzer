import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Recharts renders SVG presentation attributes, which can't resolve CSS
// custom properties — so chart colors are picked from the theme in JS.
const CHART_COLORS = {
  dark: { accent: "#ffb224", grid: "#40382a", tick: "#a3988a", tooltipBg: "#1f1a14", tooltipBorder: "#40382a" },
  light: { accent: "#d97706", grid: "#e3daca", tick: "#6f6558", tooltipBg: "#ffffff", tooltipBorder: "#e3daca" },
};

export default function GrowthTrend({ growthTrend, theme = "dark" }) {
  const colors = CHART_COLORS[theme] ?? CHART_COLORS.dark;

  return (
    <div className="reveal card p-6">
      <h3 className="font-heading text-sm font-semibold text-text mb-4">Repo Growth Over Time</h3>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <AreaChart data={growthTrend}>
            <defs>
              <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.accent} stopOpacity={0.35} />
                <stop offset="100%" stopColor={colors.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={colors.grid} strokeOpacity={0.5} vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => new Date(d).getFullYear()}
              stroke={colors.tick}
              fontSize={11}
              fontFamily="JetBrains Mono"
              minTickGap={40}
            />
            <YAxis stroke={colors.tick} fontSize={11} fontFamily="JetBrains Mono" allowDecimals={false} />
            <Tooltip
              labelFormatter={(d) => new Date(d).toLocaleDateString()}
              formatter={(value, _name, props) => [value, props.payload.name]}
              contentStyle={{
                background: colors.tooltipBg,
                border: `1px solid ${colors.tooltipBorder}`,
                borderRadius: 8,
                fontFamily: "JetBrains Mono",
                fontSize: 12,
              }}
            />
            <Area
              type="stepAfter"
              dataKey="cumulativeRepos"
              stroke={colors.accent}
              strokeWidth={2}
              fill="url(#growthFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
