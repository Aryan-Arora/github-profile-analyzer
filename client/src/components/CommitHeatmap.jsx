function levelFor(count, max) {
  if (count === 0) return 0;
  const ratio = count / Math.max(max, 1);
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

// Values resolve from the active theme's --heat-N custom properties
const LEVEL_COLORS = [0, 1, 2, 3, 4].map((n) => `var(--heat-${n})`);

function chunkIntoWeeks(days) {
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

function computeStreaks(days) {
  let longest = 0;
  let running = 0;
  for (const day of days) {
    if (day.contributionCount > 0) {
      running += 1;
      longest = Math.max(longest, running);
    } else {
      running = 0;
    }
  }

  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount > 0) current += 1;
    else break;
  }

  return { current, longest };
}

export default function CommitHeatmap({ calendar, hourBuckets }) {
  const days = calendar.days ?? [];
  const max = Math.max(0, ...days.map((d) => d.contributionCount));
  const weeks = chunkIntoWeeks(days);
  const { current, longest } = computeStreaks(days);
  const maxHour = Math.max(1, ...hourBuckets);

  return (
    <div className="reveal card p-6">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="font-heading text-sm font-semibold text-text">Contribution Insights</h3>
        <span className="font-data text-xs text-text-muted">
          {calendar.totalContributions} contributions
        </span>
      </div>

      <div className="flex gap-8 mb-5 mt-3">
        <div>
          <p className="font-data text-xl font-semibold text-primary flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
            {current}
          </p>
          <p className="text-[11px] uppercase tracking-wider text-text-muted mt-0.5">Current Streak</p>
        </div>
        <div>
          <p className="font-data text-xl font-semibold text-text">{longest} days</p>
          <p className="text-[11px] uppercase tracking-wider text-text-muted mt-0.5">Longest Streak</p>
        </div>
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
        <p className="text-[11px] uppercase tracking-wider text-text-muted mb-2">Commits by Hour of Day</p>
        <div className="flex items-end gap-[2px] h-16">
          {hourBuckets.map((count, hour) => (
            <div
              key={hour}
              title={`${hour}:00 — ${count} commits`}
              className="flex-1 bg-secondary/70 rounded-t-sm"
              style={{ height: `${Math.max(4, (count / maxHour) * 100)}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] font-data text-text-muted mt-1">
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
