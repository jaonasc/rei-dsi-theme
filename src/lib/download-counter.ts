const REPO = "jaonasc/rei-dsi-theme";
const RELEASE_TAG = "v1";
const ASSET_NAME = "rei-nerv-dsi-theme.zip";

// Curto TTL: atualiza o número em até 1 minuto, sem saturar a API do GitHub
// (limite sem autenticação: 60 req/hora).
const CACHE_TTL_MS = 60 * 1000;

type Cached = { count: number; at: number };

function readCache(): number | null {
  try {
    const raw = sessionStorage.getItem("gh_download_count");
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
    sessionStorage.setItem(
      "gh_download_count",
      JSON.stringify({ count, at: Date.now() }),
    );
  } catch {
    /* storage blocked */
  }
}

/**
 * Real download count mantido pelo GitHub para o asset da release.
 * Sempre tenta buscar o valor mais fresco (com cache-busting na URL).
 * Não coleta IP nem dados do visitante.
 */
export async function getDownloadCount(): Promise<number | null> {
  const cached = readCache();
  if (cached !== null) return cached;

  try {
    const url = `https://api.github.com/repos/${REPO}/releases/tags/${RELEASE_TAG}?t=${Date.now()}`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
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
