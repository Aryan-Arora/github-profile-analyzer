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
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">GitHub Profile Analyzer</h1>
          <p className="text-white/50 text-sm mt-2">
            See your coding identity: activity patterns, tech stack, repo health, and a shareable persona.
          </p>
        </div>

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
