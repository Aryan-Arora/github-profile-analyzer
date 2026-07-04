import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { fetchAnalysis } from "./api";
import SearchBar from "./components/SearchBar";
import CompareBar from "./components/CompareBar";
import CompareView from "./components/CompareView";
import Skeleton from "./components/Skeleton";
import ProfileHeader from "./components/ProfileHeader";
import PersonaCard from "./components/PersonaCard";
import LanguageChart from "./components/LanguageChart";
import CommitHeatmap from "./components/CommitHeatmap";
import RepoHealthList from "./components/RepoHealthList";
import GrowthTrend from "./components/GrowthTrend";

const MODES = [
  { id: "single", label: "Analyze", icon: "person_search" },
  { id: "compare", label: "Compare", icon: "compare_arrows" },
];

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("gh_token") || "");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [mode, setMode] = useState("single");
  const [data, setData] = useState(null);
  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("gh_token", token);
  }, [token]);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if ((data || compareData) && resultsRef.current) {
      const cards = resultsRef.current.querySelectorAll(".reveal");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
      );
    }
  }, [data, compareData]);

  function switchMode(next) {
    setMode(next);
    setError(null);
  }

  async function handleSearch(username) {
    setLoading(true);
    setError(null);
    setData(null);
    setCompareData(null);
    try {
      setData(await fetchAnalysis(username, token));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCompare(userA, userB) {
    setLoading(true);
    setError(null);
    setData(null);
    setCompareData(null);
    try {
      const [left, right] = await Promise.all([
        fetchAnalysis(userA, token),
        fetchAnalysis(userB, token),
      ]);
      setCompareData({ left, right });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const showHero = !data && !compareData && !loading;

  return (
    <div className="min-h-screen relative">
      {/* decorative backdrop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-hero-glow" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-grid" />

      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => {
              setData(null);
              setCompareData(null);
              setError(null);
            }}
            className="flex items-center gap-2.5"
          >
            <span className="w-7 h-7 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[16px]">data_object</span>
            </span>
            <span className="font-heading font-semibold tracking-tight text-sm">
              GitHub Profile Analyzer
            </span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              className="w-8 h-8 rounded-full border border-border bg-surface flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/40 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">
                {theme === "light" ? "dark_mode" : "light_mode"}
              </span>
            </button>
            <a
              href="https://github.com/Aryan-Arora/github-profile-analyzer"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors font-data"
            >
              <span className="material-symbols-outlined text-[15px]">code</span>
              Source
            </a>
          </div>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-4 pb-20">
        {showHero && (
          <div className="text-center pt-16 pb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-data uppercase tracking-wider px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Real-time repository indexing
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
              Trace the impact of any
              <br />
              <span className="text-gradient">GitHub profile.</span>
            </h1>
            <p className="text-text-muted text-sm mt-4 max-w-md mx-auto leading-relaxed">
              High-density code metrics, contribution analysis, and a developer
              persona tag — or put two profiles head-to-head.
            </p>
          </div>
        )}

        {!showHero && <div className="pt-8" />}

        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-full border border-border bg-surface p-1">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => switchMode(m.id)}
                className={`flex items-center gap-1.5 rounded-full px-5 py-1.5 text-xs font-heading font-semibold transition-colors ${
                  mode === m.id
                    ? "bg-primary text-canvas"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {mode === "single" ? (
          <SearchBar
            onSearch={handleSearch}
            loading={loading}
            token={token}
            onTokenChange={setToken}
          />
        ) : (
          <CompareBar onCompare={handleCompare} loading={loading} />
        )}

        {error && (
          <div className="mt-6 max-w-xl mx-auto flex items-center gap-2.5 rounded-lg border border-rose-400/30 bg-rose-400/5 px-4 py-3 text-sm text-rose-300">
            <span className="material-symbols-outlined text-[18px] text-rose-400">error</span>
            {error}
          </div>
        )}

        {loading && <Skeleton compare={mode === "compare"} />}

        {(data || compareData) && (
          <div ref={resultsRef} className="mt-10">
            {data && (
              <div className="grid grid-cols-1 gap-5">
                <ProfileHeader profile={data.profile} />
                <PersonaCard
                  personaTag={data.personaTag}
                  activityTag={data.activityTag}
                  consistency={data.consistency}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <LanguageChart languages={data.languages} />
                  <RepoHealthList repos={data.repoHealth} />
                </div>
                <CommitHeatmap calendar={data.calendar} hourBuckets={data.heatmap.hourBuckets} />
                <GrowthTrend growthTrend={data.growthTrend} theme={theme} />
              </div>
            )}
            {compareData && <CompareView left={compareData.left} right={compareData.right} />}
          </div>
        )}
      </main>

      <footer className="relative border-t border-border">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-data text-text-muted">
          <span>GITHUB PROFILE ANALYZER</span>
          <span>Built on the GitHub GraphQL API · React · Recharts</span>
        </div>
      </footer>
    </div>
  );
}
