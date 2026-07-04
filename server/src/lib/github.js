import { Octokit } from "@octokit/rest";
import { graphql } from "@octokit/graphql";

// Profile + repo metadata only. Commit history is fetched separately for a
// subset of repos — asking for 100 repos x 100 commits in one query makes
// GitHub's GraphQL endpoint time out (502) on very large accounts.
const PROFILE_QUERY = `
query Profile($login: String!, $from: DateTime!) {
  user(login: $login) {
    login
    name
    bio
    avatarUrl
    createdAt
    location
    company
    websiteUrl
    followers { totalCount }
    following { totalCount }
    repositories(
      first: 100
      ownerAffiliations: OWNER
      isFork: false
      orderBy: { field: PUSHED_AT, direction: DESC }
    ) {
      totalCount
      nodes {
        id
        name
        description
        url
        stargazerCount
        forkCount
        pushedAt
        createdAt
        primaryLanguage { name color }
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges { size node { name color } }
        }
        readme: object(expression: "HEAD:README.md") { id }
        readmeLower: object(expression: "HEAD:readme.md") { id }
      }
    }
    contributionsCollection(from: $from) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays { date contributionCount weekday }
        }
      }
    }
  }
}
`;

const COMMITS_QUERY = `
query CommitHistory($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on Repository {
      id
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 60) {
              nodes { committedDate }
            }
          }
        }
      }
    }
  }
}
`;

const COMMIT_REPO_LIMIT = 20;

function buildClients(token) {
  const auth = token || process.env.GITHUB_TOKEN || undefined;
  const rest = new Octokit({ auth });
  const gql = graphql.defaults({
    headers: auth ? { authorization: `token ${auth}` } : {},
  });
  return { rest, gql };
}

function sanitizeGitHubError(err) {
  const raw = String(err.message || "");
  if (raw.includes("<html>") || raw.includes("502") || raw.includes("Bad Gateway")) {
    const friendly = new Error(
      "GitHub's API timed out answering for this profile (it can happen on very large accounts). Please try again in a moment."
    );
    friendly.status = 503;
    return friendly;
  }
  if (raw.includes("Could not resolve to a User")) {
    const friendly = new Error("GitHub user not found");
    friendly.status = 404;
    return friendly;
  }
  if (raw.includes("Bad credentials") || raw.includes("401")) {
    const friendly = new Error("GitHub rejected the API token — check the server's GITHUB_TOKEN.");
    friendly.status = 502;
    return friendly;
  }
  // Never leak raw HTML or huge payloads to the client
  const friendly = new Error(raw.replace(/<[^>]*>/g, "").slice(0, 200) || "GitHub API error");
  friendly.status = err.status || 500;
  return friendly;
}

async function withRetry(fn, attempts = 2) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const msg = String(err.message || "");
      const transient = msg.includes("502") || msg.includes("<html>") || msg.includes("timeout");
      if (!transient || i === attempts - 1) throw err;
      await new Promise((r) => setTimeout(r, 800));
    }
  }
  throw lastErr;
}

export async function fetchProfileAnalysisData(username, token) {
  const { gql } = buildClients(token);
  const from = new Date();
  from.setFullYear(from.getFullYear() - 1);

  let data;
  try {
    data = await withRetry(() =>
      gql(PROFILE_QUERY, { login: username, from: from.toISOString() })
    );
  } catch (err) {
    throw sanitizeGitHubError(err);
  }

  if (!data.user) {
    const err = new Error(`GitHub user "${username}" not found`);
    err.status = 404;
    throw err;
  }

  const user = data.user;
  const repos = user.repositories?.nodes ?? [];

  // Commit timestamps for the hour-of-day heatmap: most recently pushed repos
  // are enough signal without tripping GitHub's query cost limits.
  const targets = repos.slice(0, COMMIT_REPO_LIMIT);
  if (targets.length > 0) {
    try {
      const commitData = await withRetry(() =>
        gql(COMMITS_QUERY, { ids: targets.map((r) => r.id) })
      );
      const historyById = new Map(
        (commitData.nodes ?? [])
          .filter(Boolean)
          .map((n) => [n.id, n.defaultBranchRef])
      );
      for (const repo of repos) {
        repo.defaultBranchRef = historyById.get(repo.id) ?? null;
      }
    } catch {
      // Heatmap degrades gracefully — the contribution calendar still renders.
      for (const repo of repos) repo.defaultBranchRef = null;
    }
  }

  return user;
}

export async function fetchRateLimit(token) {
  const { rest } = buildClients(token);
  const { data } = await rest.rateLimit.get();
  return data.rate;
}
