function Stat({ value, label }) {
  return (
    <div>
      <p className="font-data text-lg font-semibold text-text">{value}</p>
      <p className="text-[11px] uppercase tracking-wider text-text-muted">{label}</p>
    </div>
  );
}

export default function ProfileHeader({ profile }) {
  const joined = new Date(profile.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
  });

  return (
    <div className="reveal rounded-lg bg-surface border border-border p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
      <img
        src={profile.avatarUrl}
        alt={profile.login}
        className="w-20 h-20 rounded-full border border-border"
      />
      <div className="flex-1">
        <h1 className="font-heading text-xl font-semibold">{profile.name || profile.login}</h1>
        <p className="text-text-muted text-sm font-data">@{profile.login}</p>
        {profile.bio && <p className="mt-2 text-sm text-text-muted">{profile.bio}</p>}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
          {profile.location && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              {profile.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            Joined {joined}
          </span>
        </div>
      </div>

      <div className="flex gap-6 sm:pl-6 sm:border-l border-border">
        <Stat value={profile.publicRepos} label="Repos" />
        <Stat value={profile.followers.toLocaleString()} label="Followers" />
        <Stat value={profile.following.toLocaleString()} label="Following" />
      </div>

      <a
        href={`https://github.com/${profile.login}`}
        target="_blank"
        rel="noreferrer"
        className="shrink-0 rounded-full border border-primary/40 text-primary text-sm font-heading font-semibold px-4 py-2 hover:bg-primary/10 transition-colors flex items-center gap-1.5"
      >
        View on GitHub
        <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
      </a>
    </div>
  );
}
