const REPO = "jaonasc/rei-dsi-theme";
const RELEASE_TAG = "v1";
const ASSET_NAME = "rei-nerv-dsi-theme.zip";
const CACHE_KEY = "gh_download_count";
const CACHE_TTL_MS = 5 * 60 * 1000;

type Cached = { count: number; at: number };

function readCache(): number | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Cached;
    if (Date.now() - parsed.at > CACHE_TTL_MS) return null;
    return typeof parsed.count === "number" ? parsed.count : null;
  } catch {
    return null;
  }
}

function writeCache(count: number): void {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ count, at: Date.now() }));
  } catch {
    /* storage blocked */
  }
}

/**
 * Real download count maintained by GitHub for the release asset.
 * No visitor data is collected or stored. The value is cached for a few
 * minutes to stay well inside GitHub's unauthenticated rate limit.
 */
export async function getDownloadCount(): Promise<number | null> {
  const cached = readCache();
  if (cached !== null) return cached;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/releases/tags/${RELEASE_TAG}`,
      { headers: { Accept: "application/vnd.github+json" } },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as {
      assets?: Array<{ name?: string; download_count?: number }>;
    };
    const asset = data.assets?.find((a) => a.name === ASSET_NAME);
    if (typeof asset?.download_count !== "number") return null;

    writeCache(asset.download_count);
    return asset.download_count;
  } catch {
    return null;
  }
}
