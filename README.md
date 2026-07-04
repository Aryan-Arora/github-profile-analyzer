# GitHub Profile Analyzer

Enter a GitHub username, get back a visual breakdown of their coding identity:
tech stack fingerprint, commit activity heatmap, repo health scores, growth
trend, and a rule-based "developer persona" tag.

## Stack

- **client/** — React + Vite, Tailwind, Recharts, GSAP
- **server/** — Node.js + Express, hitting the GitHub GraphQL API

## Running locally

```bash
# terminal 1
cd server
npm install
cp .env.example .env
npm run dev        # http://localhost:4000

# terminal 2
cd client
npm install
cp .env.example .env
npm run dev         # http://localhost:5173
```

## GitHub token

GitHub's GraphQL API requires authentication for every request, even for
public data — so a personal access token is required to run an analysis.
Paste one into the "Add a GitHub token" field in the UI (it's kept in
`localStorage` and sent only to your own server). No scopes are needed for
public profiles — a classic PAT with no scopes checked, or a fine-grained
token with read-only public repo access, both work.

Alternatively, set `GITHUB_TOKEN` in `server/.env` to use one token
server-side for all requests.

## API

`GET /api/user/:username/analysis` — returns the full aggregated analysis
(profile, persona tag, language fingerprint, commit heatmap, repo health
scores, growth trend). Pass the token via the `x-github-token` header.
