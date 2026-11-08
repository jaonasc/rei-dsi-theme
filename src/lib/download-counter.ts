const REPO = "jaonasc/rei-dsi-theme";
const RELEASE_TAG = "v1";
const ASSET_NAME = "rei-nerv-dsi-theme.zip";
const CACHE_KEY = "gh_download_count";
const CACHE_TTL_MS = 60 * 1000; // 1 minuto — reflete downloads recentes sem estourar rate limit

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
 * Uses cache-busting so we always fetch the freshest number, and a short
 * TTL so new downloads show up quickly without hitting GitHub's rate limit.
 * No visitor data (IP, etc.) is collected or stored.
 */
export async function getDownloadCount(): Promise<number | null> {
  const cached = readCache();
  if (cached !== null) return cached;

  try {
    const url = `https://api.github.com/repos/${REPO}/releases/tags/${RELEASE_TAG}?t=${Date.now()}`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        // Cache-busting header so intermediate caches return fresh data
        "Cache-Control": "no-cache",
      },
    });
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
