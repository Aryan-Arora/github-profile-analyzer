export default function PersonaCard({ personaTag, activityTag, consistency }) {
  return (
    <div className="reveal rounded-2xl bg-gradient-to-br from-accent/20 to-panel border border-accent/30 p-8 text-center">
      <p className="text-xs uppercase tracking-widest text-white/50 mb-2">
        Developer Persona
      </p>
      <h2 className="text-3xl sm:text-4xl font-bold text-white">{personaTag}</h2>
      <div className="mt-4 flex justify-center gap-6 text-sm text-white/60">
        <span>Activity: <strong className="text-white/90">{activityTag}</strong></span>
        <span>Consistency: <strong className="text-white/90">{consistency.score}/100</strong></span>
      </div>
    </div>
  );
}
