const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export async function fetchAnalysis(username, token) {
  const res = await fetch(`${API_BASE_URL}/api/user/${encodeURIComponent(username)}/analysis`, {
    headers: token ? { "x-github-token": token } : {},
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}
