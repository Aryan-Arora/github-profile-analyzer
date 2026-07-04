import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function GrowthTrend({ growthTrend }) {
  const data = growthTrend.map((point) => ({
    ...point,
    year: new Date(point.date).getFullYear(),
  }));

  return (
    <div className="reveal rounded-2xl bg-panel border border-white/10 p-6">
      <h3 className="text-sm font-semibold text-white/80 mb-4">Repo Growth Over Time</h3>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => new Date(d).getFullYear()}
              stroke="rgba(255,255,255,0.3)"
              fontSize={11}
              minTickGap={40}
            />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} allowDecimals={false} />
            <Tooltip
              labelFormatter={(d) => new Date(d).toLocaleDateString()}
              formatter={(value, _name, props) => [value, props.payload.name]}
              contentStyle={{ background: "#121722", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
            />
            <Line
              type="stepAfter"
              dataKey="cumulativeRepos"
              stroke="#7c9eff"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
