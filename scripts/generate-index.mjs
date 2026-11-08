import { writeFileSync, readdirSync, statSync, unlinkSync } from "fs";
import { join } from "path";

const publicDir = join(process.cwd(), ".output", "public");
const assetsDir = join(publicDir, "assets");

const files = readdirSync(assetsDir);

// Pick the NEWEST client bundle (client-*.js) and newest styles-*.css
const newest = (prefix, ext) => {
  const matches = files
    .filter((f) => f.startsWith(prefix) && f.endsWith(ext))
    .map((f) => ({ f, mtime: statSync(join(assetsDir, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  return matches[0]?.f;
};

const jsFile =
  newest("client-", ".js") ||
  newest("index-", ".js");
const cssFile = newest("styles-", ".css");

if (!jsFile) {
  console.error("No client JS bundle found!");
  process.exit(1);
}

// Remove stale client-*.js bundles that are NOT the chosen one.
for (const f of files) {
  if (f.startsWith("client-") && f.endsWith(".js") && f !== jsFile) {
    try {
      unlinkSync(join(assetsDir, f));
    } catch {}
  }
}
// Remove stale styles-*.css that are NOT the chosen one.
for (const f of files) {
  if (f.startsWith("styles-") && f.endsWith(".css") && f !== cssFile) {
    try {
      unlinkSync(join(assetsDir, f));
    } catch {}
  }
}
// Remove TanStack Start client bundles we don't use (we ship client-*.js only).
for (const f of files) {
  if ((f.startsWith("index-") && f.endsWith(".js")) || (f.startsWith("routes-") && f.endsWith(".js"))) {
    try {
      unlinkSync(join(assetsDir, f));
    } catch {}
  }
}

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rei Ayanami — Tema NERV para Nintendo DSi</title>
  <meta name="description" content="Baixe grátis o tema Evangelion da Rei Ayanami para Nintendo DSi." />
  <meta property="og:title" content="Rei Ayanami — DSi Theme" />
  <meta property="og:description" content="Free Evangelion Rei Ayanami theme for Nintendo DSi." />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; object-src 'none'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://api.github.com https://ipapi.co;" />
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <link rel="icon" href="/rei.ico" type="image/x-icon" />
  <link rel="apple-touch-icon" href="/rei.ico" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600&display=swap" rel="stylesheet" />
  ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ""}
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/assets/${jsFile}"></script>
</body>
</html>`;

writeFileSync(join(publicDir, "index.html"), html);
console.log("Generated index.html with:", jsFile, cssFile);