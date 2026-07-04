function levelFor(count, max) {
  if (count === 0) return 0;
  const ratio = count / Math.max(max, 1);
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

const LEVEL_COLORS = ["#161b22", "#1f4620", "#2f6d33", "#4bab4f", "#7cff81"];

function chunkIntoWeeks(days) {
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

export default function CommitHeatmap({ calendar, hourBuckets }) {
  const days = calendar.days ?? [];
  const max = Math.max(0, ...days.map((d) => d.contributionCount));
  const weeks = chunkIntoWeeks(days);

  const maxHour = Math.max(1, ...hourBuckets);

  return (
    <div className="reveal rounded-2xl bg-panel border border-white/10 p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-sm font-semibold text-white/80">Commit Activity</h3>
        <span className="text-xs text-white/40">
          {calendar.totalContributions} contributions in the last year
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-[3px]" style={{ width: "max-content" }}>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.contributionCount} contributions`}
                  className="w-[10px] h-[10px] rounded-[2px]"
                  style={{ backgroundColor: LEVEL_COLORS[levelFor(day.contributionCount, max)] }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs text-white/50 mb-2">Commits by hour of day</p>
        <div className="flex items-end gap-[2px] h-16">
          {hourBuckets.map((count, hour) => (
            <div
              key={hour}
              title={`${hour}:00 — ${count} commits`}
              className="flex-1 bg-accent/70 rounded-t-sm"
              style={{ height: `${Math.max(4, (count / maxHour) * 100)}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-white/30 mt-1">
          <span>12am</span>
          <span>6am</span>
          <span>12pm</span>
          <span>6pm</span>
          <span>11pm</span>
        </div>
      </div>
    </div>
  );
}
