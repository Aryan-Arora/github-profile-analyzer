import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { fetchAnalysis } from "./api";
import SearchBar from "./components/SearchBar";
import ProfileHeader from "./components/ProfileHeader";
import PersonaCard from "./components/PersonaCard";
import LanguageChart from "./components/LanguageChart";
import CommitHeatmap from "./components/CommitHeatmap";
import RepoHealthList from "./components/RepoHealthList";
import GrowthTrend from "./components/GrowthTrend";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("gh_token") || "");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("gh_token", token);
  }, [token]);

  useEffect(() => {
    if (data && resultsRef.current) {
      const cards = resultsRef.current.querySelectorAll(".reveal");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
      );
    }
  }, [data]);

  async function handleSearch(username) {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const analysis = await fetchAnalysis(username, token);
      setData(analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-10">
          <span className="w-7 h-7 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[16px]">data_object</span>
          </span>
          <span className="font-heading font-semibold text-text tracking-tight">
            GitHub Profile Analyzer
          </span>
        </div>

        {!data && !loading && (
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-data uppercase tracking-wider px-3 py-1 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Real-time repository indexing
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text leading-tight">
              Trace the impact of any <span className="text-primary">GitHub profile.</span>
            </h1>
            <p className="text-text-muted text-sm mt-3 max-w-md mx-auto">
              High-density code metrics, contribution analysis, and a
              developer persona tag — for any public GitHub username.
            </p>
          </div>
        )}

        <SearchBar
          onSearch={handleSearch}
          loading={loading}
          token={token}
          onTokenChange={setToken}
        />

        {error && (
          <p className="mt-6 text-center text-sm text-rose-400">{error}</p>
        )}

        {data && (
          <div ref={resultsRef} className="mt-10 grid grid-cols-1 gap-5">
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
            <GrowthTrend growthTrend={data.growthTrend} />
          </div>
        )}
      </div>
    </div>
  );
}
