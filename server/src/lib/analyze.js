const LANGUAGE_CATEGORY = {
  JavaScript: "frontend",
  TypeScript: "frontend",
  HTML: "frontend",
  CSS: "frontend",
  Vue: "frontend",
  Svelte: "frontend",
  Python: "backend",
  Java: "backend",
  Go: "backend",
  Ruby: "backend",
  PHP: "backend",
  "C#": "backend",
  Rust: "backend",
  Kotlin: "backend",
  Scala: "backend",
  Elixir: "backend",
  C: "systems",
  "C++": "systems",
  Swift: "mobile",
  Dart: "mobile",
  "Jupyter Notebook": "data",
  R: "data",
  Shell: "devops",
  Dockerfile: "devops",
  HCL: "devops",
};

function stddev(values) {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function hourFromIso(iso) {
  const match = /T(\d{2}):/.exec(iso);
  return match ? parseInt(match[1], 10) : null;
}

export function buildLanguageFingerprint(repos) {
  const totals = {};
  for (const repo of repos) {
    for (const edge of repo.languages?.edges ?? []) {
      totals[edge.node.name] = (totals[edge.node.name] ?? 0) + edge.size;
    }
  }
  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);
  if (grandTotal === 0) return [];

  return Object.entries(totals)
    .map(([name, size]) => ({
      name,
      bytes: size,
      percent: Math.round((size / grandTotal) * 1000) / 10,
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

export function buildCommitHeatmap(repos) {
  const hourBuckets = Array(24).fill(0);
  const dayBuckets = Array(7).fill(0); // 0 = Sunday
  let totalCommits = 0;

  for (const repo of repos) {
    const nodes = repo.defaultBranchRef?.target?.history?.nodes ?? [];
    for (const node of nodes) {
      const hour = hourFromIso(node.committedDate);
      if (hour === null) continue;
      hourBuckets[hour] += 1;
      const day = new Date(node.committedDate).getUTCDay();
      dayBuckets[day] += 1;
      totalCommits += 1;
    }
  }

  return { hourBuckets, dayBuckets, totalCommits };
}

export function buildContributionCalendar(user) {
  const weeks = user.contributionsCollection?.contributionCalendar?.weeks ?? [];
  const days = weeks.flatMap((w) => w.contributionDays);
  return {
    totalContributions:
      user.contributionsCollection?.contributionCalendar?.totalContributions ?? 0,
    days,
    weeks,
  };
}

export function computeConsistencyScore(weeks) {
  const last26 = weeks.slice(-26);
  const weeklyTotals = last26.map((w) =>
    w.contributionDays.reduce((sum, d) => sum + d.contributionCount, 0)
  );
  const mean = weeklyTotals.reduce((a, b) => a + b, 0) / (weeklyTotals.length || 1);
  const sd = stddev(weeklyTotals);
  // Lower coefficient of variation = more consistent. Map to a 0-100 score.
  const cv = mean === 0 ? 1 : sd / mean;
  const score = Math.max(0, Math.min(100, Math.round(100 - cv * 60)));
  return { score, weeklyTotals, mean: Math.round(mean * 10) / 10 };
}

export function deriveActivityTag({ hourBuckets, dayBuckets }) {
  const nightCommits = hourBuckets
    .slice(22, 24)
    .concat(hourBuckets.slice(0, 5))
    .reduce((a, b) => a + b, 0);
  const morningCommits = hourBuckets.slice(5, 9).reduce((a, b) => a + b, 0);
  const weekendCommits = dayBuckets[0] + dayBuckets[6];
  const totalCommits = hourBuckets.reduce((a, b) => a + b, 0);

  if (totalCommits === 0) {
    return "Quiet Coder";
  }
  if (weekendCommits / totalCommits > 0.4) return "Weekend Warrior";
  if (nightCommits / totalCommits > 0.3) return "Night Owl";
  if (morningCommits / totalCommits > 0.3) return "Early Riser";
  return "Weekday Grinder";
}

function daysSince(dateString) {
  return Math.floor((Date.now() - new Date(dateString).getTime()) / 86400000);
}

export function scoreRepoHealth(repo) {
  const hasReadme = Boolean(repo.readme || repo.readmeLower);
  const staleDays = daysSince(repo.pushedAt);

  const readmeScore = hasReadme ? 30 : 0;
  const freshnessScore = Math.max(0, 40 - Math.floor(staleDays / 14));
  const starScore = Math.min(30, Math.round(Math.log2(repo.stargazerCount + 1) * 8));

  const total = Math.min(100, readmeScore + freshnessScore + starScore);

  return {
    name: repo.name,
    url: repo.url,
    description: repo.description,
    stars: repo.stargazerCount,
    forks: repo.forkCount,
    hasReadme,
    daysSinceLastPush: staleDays,
    language: repo.primaryLanguage?.name ?? null,
    score: total,
  };
}

export function buildGrowthTrend(repos) {
  const sorted = [...repos].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
  let cumulative = 0;
  return sorted.map((repo) => {
    cumulative += 1;
    return { date: repo.createdAt, name: repo.name, cumulativeRepos: cumulative };
  });
}

function categoryOf(languages) {
  const counts = {};
  for (const lang of languages) {
    const cat = LANGUAGE_CATEGORY[lang.name] ?? "other";
    counts[cat] = (counts[cat] ?? 0) + lang.bytes;
  }
  delete counts.other;
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return entries[0]?.[0] ?? "Polyglot";
}

const PERSONA_LABELS = {
  frontend: "Frontend",
  backend: "Backend",
  systems: "Systems",
  mobile: "Mobile",
  data: "Data",
  devops: "DevOps",
  Polyglot: "Polyglot",
};

export function derivePersonaTag({ languages, activityTag, consistencyScore, avgHealth }) {
  const category = categoryOf(languages);
  const stackLabel = PERSONA_LABELS[category] ?? "Polyglot";

  let tier;
  if (consistencyScore >= 70 && avgHealth >= 60) tier = "Consistent";
  else if (avgHealth >= 70) tier = "Meticulous";
  else if (consistencyScore < 30) tier = "Bursty";
  else tier = "Emerging";

  const activityWord = {
    "Night Owl": "Night-Owl",
    "Early Riser": "Early-Bird",
    "Weekend Warrior": "Weekend",
    "Weekday Grinder": "",
    "Quiet Coder": "Quiet",
  }[activityTag] ?? "";

  const parts = [tier, activityWord, stackLabel, "Builder"].filter(Boolean);
  return parts.join(" ");
}

export function runFullAnalysis(user) {
  const repos = user.repositories?.nodes ?? [];

  const languages = buildLanguageFingerprint(repos);
  const heatmap = buildCommitHeatmap(repos);
  const calendar = buildContributionCalendar(user);
  const consistency = computeConsistencyScore(calendar.weeks);
  const activityTag = deriveActivityTag(heatmap);
  const growthTrend = buildGrowthTrend(repos);

  const repoHealth = repos
    .map(scoreRepoHealth)
    .sort((a, b) => b.score - a.score);

  const avgHealth =
    repoHealth.reduce((sum, r) => sum + r.score, 0) / (repoHealth.length || 1);

  const personaTag = derivePersonaTag({
    languages,
    activityTag,
    consistencyScore: consistency.score,
    avgHealth,
  });

  return {
    profile: {
      login: user.login,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      location: user.location,
      company: user.company,
      websiteUrl: user.websiteUrl,
      followers: user.followers?.totalCount ?? 0,
      following: user.following?.totalCount ?? 0,
      publicRepos: user.repositories?.totalCount ?? 0,
    },
    personaTag,
    languages,
    heatmap,
    calendar: { totalContributions: calendar.totalContributions, days: calendar.days },
    consistency,
    activityTag,
    repoHealth: repoHealth.slice(0, 5),
    growthTrend,
    totals: {
      stars: repos.reduce((sum, r) => sum + r.stargazerCount, 0),
      forks: repos.reduce((sum, r) => sum + r.forkCount, 0),
      avgHealth: Math.round(avgHealth),
    },
  };
}
