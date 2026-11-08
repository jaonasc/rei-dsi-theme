import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import top from "@/assets/rei_top.png";
import bottom from "@/assets/rei_bottom.png";
import { getDownloadCount } from "@/lib/download-counter";

const DOWNLOAD_URL =
  "https://github.com/jaonasc/rei-dsi-theme/releases/download/v1/rei-nerv-dsi-theme.zip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rei Ayanami — Tema NERV para Nintendo DSi" },
      { name: "description", content: "Baixe grátis o tema Evangelion da Rei Ayanami para Nintendo DSi." },
      { property: "og:title", content: "Rei Ayanami — DSi Theme" },
      { property: "og:description", content: "Free Evangelion Rei Ayanami theme for Nintendo DSi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Lang = "pt" | "en";
const T = {
  pt: {
    tag: "Tema para Nintendo DSi",
    sub: "Um tema minimalista inspirado na First Children. Branco, azul-gelo e o vermelho dos olhos da Rei.",
    dl: "Baixar tema",
    size: "ZIP · grátis",
    f1: "Tela superior", f1d: "Rei com o logo da NERV.",
    f2: "Tela inferior", f2d: "Pauta musical em tons de azul.",
    how: "Como instalar", steps: ["Baixe e extraia o arquivo .zip", "Copie para a pasta de temas do seu cartão SD", "Selecione o tema no seu DSi"],
    by: "Criado por",
    count: "downloads",
    quote: "God's in his heaven. All's right with the world.",
  },
  en: {
    tag: "Nintendo DSi Theme",
    sub: "A minimalist theme inspired by the First Children. White, ice blue and the red of Rei's eyes.",
    dl: "Download theme",
    size: "ZIP · free",
    f1: "Top screen", f1d: "Rei with the NERV logo.",
    f2: "Bottom screen", f2d: "Musical staff in shades of blue.",
    how: "How to install", steps: ["Download and extract the .zip file", "Copy it to your SD card's themes folder", "Select the theme on your DSi"],
    by: "Created by",
    count: "downloads",
    quote: "God's in his heaven. All's right with the world.",
  },
};

function Index() {
  const [lang, setLang] = useState<Lang>("pt");
  const [downloads, setDownloads] = useState<number | null>(null);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved) return setLang(saved);
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((d) => setLang(["BR", "PT", "AO", "MZ"].includes(d.country_code) ? "pt" : "en"))
      .catch(() => setLang(navigator.language.startsWith("pt") ? "pt" : "en"));
  }, []);

  // Load the real download counter (GitHub release asset downloads).
  useEffect(() => {
    let active = true;
    getDownloadCount().then((n) => {
      if (active) setDownloads(n);
    });
    return () => {
      active = false;
    };
  }, []);

  // Auto-scroll to download button on load (runs once, after paint)
  useEffect(() => {
    const id = window.setTimeout(() => {
      downloadRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 250);
    return () => window.clearTimeout(id);
  }, []);

  const choose = (l: Lang) => { setLang(l); localStorage.setItem("lang", l); };
  const t = T[lang];

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 sm:py-5 max-w-6xl mx-auto">
        <span className="font-display tracking-[0.3em] text-xs sm:text-sm">NERV · 00</span>
        <div className="flex border border-border rounded-full p-1 text-xs font-mono shrink-0">
          {(["pt", "en"] as Lang[]).map((l) => (
            <button key={l} onClick={() => choose(l)}
              className={`px-3 py-1 rounded-full uppercase transition ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              {l}
            </button>
          ))}
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 md:gap-12 items-center py-10 md:py-20">
        <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-accent-red">{t.tag}</p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-8xl leading-[0.9]">REI<br /><span className="text-primary">AYANAMI</span></h1>
          <p className="text-muted-foreground max-w-md text-sm sm:text-base">{t.sub}</p>
          <a ref={downloadRef} id="download" href={DOWNLOAD_URL}
            target="_blank" rel="noreferrer"
            className="scroll-mt-24 inline-flex w-full sm:w-auto justify-center items-center gap-3 bg-primary text-primary-foreground px-6 sm:px-8 py-4 rounded-sm font-display tracking-widest shadow-glow hover:-translate-y-0.5 transition">
            ↓ {t.dl}
          </a>
          <p className="font-mono text-xs text-muted-foreground">
            {t.size} · <span className="text-primary font-semibold">{downloads === null ? "—" : downloads.toLocaleString()}</span> {t.count}
          </p>
        </div>
        <div className="relative">
          <div className="absolute -inset-3 sm:-inset-6 bg-secondary rounded-sm -rotate-2" />
          <div className="relative bg-card p-2 sm:p-3 rounded-lg shadow-glow border border-border">
            <img src={top} alt="Rei top" className="w-full rounded" />
            <div className="h-3 my-2 mx-auto w-16 rounded-full bg-muted" />
            <img src={bottom} alt="Rei bottom" className="w-full rounded" />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 py-10 sm:py-12 border-t border-border">
        {[[t.f1, t.f1d], [t.f2, t.f2d]].map(([a, b], i) => (
          <div key={i} className="p-5 sm:p-6 bg-card border border-border rounded-sm">
            <p className="font-mono text-xs text-accent-red">0{i + 1}</p>
            <h3 className="font-display text-2xl mt-2">{a}</h3>
            <p className="text-sm text-muted-foreground mt-1">{b}</p>
          </div>
        ))}
        <div className="p-5 sm:p-6 bg-secondary rounded-sm sm:col-span-2 md:col-span-1">
          <h3 className="font-display text-2xl">{t.how}</h3>
          <ol className="text-sm mt-2 space-y-1 list-decimal list-inside text-secondary-foreground">
            {t.steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col md:flex-row justify-between gap-3 sm:gap-4 text-sm text-muted-foreground">
        <span className="italic">{t.quote}</span>
        <span>{t.by}{" "}
          <a href="https://github.com/jaonasc" target="_blank" rel="noreferrer" className="text-primary font-semibold hover:text-accent-red">@jaonasc</a>
        </span>
      </footer>
    </main>
  );
}
