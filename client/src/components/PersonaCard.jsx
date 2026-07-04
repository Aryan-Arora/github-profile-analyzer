export default function PersonaCard({ personaTag, activityTag, consistency }) {
  return (
    <div className="reveal card border-l-4 border-l-primary p-8">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-data font-medium uppercase tracking-wider px-3 py-1">
        <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
        Developer Persona
      </span>

      <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text mt-4">
        {personaTag}
      </h2>

      <div className="mt-6 flex gap-10">
        <div>
          <p className="font-data text-2xl font-semibold text-secondary">{activityTag}</p>
          <p className="text-[11px] uppercase tracking-wider text-text-muted mt-1">Activity Pattern</p>
        </div>
        <div>
          <p className="font-data text-2xl font-semibold text-text">{consistency.score}<span className="text-text-muted text-base">/100</span></p>
          <div className="h-1 w-24 rounded-full bg-border mt-1.5 overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${consistency.score}%` }} />
          </div>
          <p className="text-[11px] uppercase tracking-wider text-text-muted mt-1.5">Consistency Score</p>
        </div>
      </div>
    </div>
  );
}
