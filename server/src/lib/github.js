import { Octokit } from "@octokit/rest";
import { graphql } from "@octokit/graphql";

const PROFILE_ANALYSIS_QUERY = `
query ProfileAnalysis($login: String!, $from: DateTime!) {
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
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 100) {
                nodes { committedDate }
              }
            }
          }
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

function buildClients(token) {
  const auth = token || process.env.GITHUB_TOKEN || undefined;
  const rest = new Octokit({ auth });
  const gql = graphql.defaults({
    headers: auth ? { authorization: `token ${auth}` } : {},
  });
  return { rest, gql };
}

export async function fetchProfileAnalysisData(username, token) {
  const { gql } = buildClients(token);
  const from = new Date();
  from.setFullYear(from.getFullYear() - 1);

  const data = await gql(PROFILE_ANALYSIS_QUERY, {
    login: username,
    from: from.toISOString(),
  });

  if (!data.user) {
    const err = new Error(`GitHub user "${username}" not found`);
    err.status = 404;
    throw err;
  }

  return data.user;
}

export async function fetchRateLimit(token) {
  const { rest } = buildClients(token);
  const { data } = await rest.rateLimit.get();
  return data.rate;
}
