export default function ProfileHeader({ profile }) {
  const joined = new Date(profile.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="reveal rounded-2xl bg-panel border border-white/10 p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
      <img
        src={profile.avatarUrl}
        alt={profile.login}
        className="w-20 h-20 rounded-full border border-white/10"
      />
      <div className="flex-1">
        <h1 className="text-xl font-semibold">{profile.name || profile.login}</h1>
        <p className="text-white/50 text-sm">@{profile.login}</p>
        {profile.bio && <p className="mt-2 text-sm text-white/70">{profile.bio}</p>}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50">
          <span>{profile.publicRepos} repos</span>
          <span>{profile.followers} followers</span>
          <span>{profile.following} following</span>
          {profile.location && <span>{profile.location}</span>}
          <span>Joined {joined}</span>
        </div>
      </div>
    </div>
  );
}
