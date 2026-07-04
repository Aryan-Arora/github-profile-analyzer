import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function GrowthTrend({ growthTrend }) {
  return (
    <div className="reveal card p-6">
      <h3 className="font-heading text-sm font-semibold text-text mb-4">Repo Growth Over Time</h3>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <AreaChart data={growthTrend}>
            <defs>
              <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#39d353" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#39d353" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#30363d" strokeOpacity={0.4} vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => new Date(d).getFullYear()}
              stroke="#8b949e"
              fontSize={11}
              fontFamily="JetBrains Mono"
              minTickGap={40}
            />
            <YAxis stroke="#8b949e" fontSize={11} fontFamily="JetBrains Mono" allowDecimals={false} />
            <Tooltip
              labelFormatter={(d) => new Date(d).toLocaleDateString()}
              formatter={(value, _name, props) => [value, props.payload.name]}
              contentStyle={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 8, fontFamily: "JetBrains Mono", fontSize: 12 }}
            />
            <Area
              type="stepAfter"
              dataKey="cumulativeRepos"
              stroke="#39d353"
              strokeWidth={2}
              fill="url(#growthFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
