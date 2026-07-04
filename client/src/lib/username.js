// Accepts anything a user might paste — a bare username, "@username", or any
// github.com URL (profile, repo, with query params/trailing slash) — and
// returns the username portion.
export function extractUsername(input) {
  let value = (input || "").trim();
  if (!value) return "";

  const urlMatch = value.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/?#\s]+)/i);
  if (urlMatch) value = urlMatch[1];

  return value.replace(/^@/, "");
}
