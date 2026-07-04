import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function GrowthTrend({ growthTrend }) {
  return (
    <div className="reveal rounded-lg bg-surface border border-border p-6">
      <h3 className="font-heading text-sm font-semibold text-text mb-4">Repo Growth Over Time</h3>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={growthTrend}>
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
              contentStyle={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 6, fontFamily: "JetBrains Mono", fontSize: 12 }}
            />
            <Line
              type="stepAfter"
              dataKey="cumulativeRepos"
              stroke="#39d353"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
