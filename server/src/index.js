import "dotenv/config";
import express from "express";
import cors from "cors";
import { fetchProfileAnalysisData, fetchRateLimit } from "./lib/github.js";
import { runFullAnalysis } from "./lib/analyze.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());

function getToken(req) {
  const header = req.get("x-github-token");
  return header && header.trim() ? header.trim() : undefined;
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/rate-limit", async (req, res) => {
  try {
    const rate = await fetchRateLimit(getToken(req));
    res.json(rate);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.get("/api/user/:username/analysis", async (req, res) => {
  try {
    const user = await fetchProfileAnalysisData(req.params.username, getToken(req));
    const analysis = runFullAnalysis(user);
    res.json(analysis);
  } catch (err) {
    const status = err.status || (err.message?.includes("Could not resolve") ? 404 : 500);
    res.status(status).json({ error: err.message || "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`GitHub Analyzer API listening on http://localhost:${PORT}`);
});
