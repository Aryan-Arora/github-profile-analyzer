# GitHub Profile Analyzer

Enter a GitHub username, get back a visual breakdown of their coding identity:
tech stack fingerprint, commit activity heatmap, repo health scores, growth
trend, and a rule-based "developer persona" tag — or put two profiles
head-to-head in Compare mode. Ships with an amber-terminal dark theme and a
light mode, switchable from the header.

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
public data — that's a GitHub platform rule, not something this app adds.

For end users (e.g. HR/recruiters using this to look up candidates), this is
handled entirely server-side: set `GITHUB_TOKEN` in `server/.env` to a
personal access token (no scopes needed for public profiles — a classic PAT
with nothing checked, or a fine-grained token with read-only public repo
access, both work). Every analysis request then runs on that one shared
token, and users never see or need a token of their own.

The "Advanced: use your own GitHub token" field in the UI is optional — it
lets a power user substitute their own token (kept in `localStorage`, sent
only to this app's own server) if the shared server token is rate-limited.

## API

`GET /api/user/:username/analysis` — returns the full aggregated analysis
(profile, persona tag, language fingerprint, commit heatmap, repo health
scores, growth trend, aggregate totals). An optional `x-github-token`
header overrides the server-side token for that request.

## Deploying

**Backend (Render / Railway / any Node host)**

- Root directory: `server`
- Build: `npm install` · Start: `npm start`
- Environment variables:
  - `GITHUB_TOKEN` — required (see above)
  - `CLIENT_ORIGIN` — your deployed frontend URL (CORS allowlist)
  - `PORT` — usually injected by the host automatically

**Frontend (Vercel / Netlify)**

- Root directory: `client`
- Build: `npm run build` · Output: `dist`
- Environment variable: `VITE_API_BASE_URL` — your deployed backend URL
  (baked in at build time)

Deploy the backend first, then point the frontend's `VITE_API_BASE_URL` at
it and set the backend's `CLIENT_ORIGIN` to the frontend's URL.
