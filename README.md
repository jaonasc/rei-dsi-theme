# Rei Ayanami — DSi Theme

A one-page site in Portuguese and English to download a Nintendo DSi theme inspired by Rei Ayanami (Neon Genesis Evangelion).

**Creator:** [@jaonasc](https://github.com/jaonasc)

---

## How to run it locally / Como rodar localmente

You need Node.js 20 or newer.

```sh
npm install
npm run dev
```

Open the address the terminal prints (usually http://localhost:8080).

Build a production version:

```sh
npm run build
npm run preview
```

---

## O que tem aqui

- `src/routes/index.tsx` — a página inteira (textos em PT e EN, botão de download, troca de idioma).
- `src/assets/` — as duas fotos da Rei usadas na página.
- `public/downloads/rei-nerv-dsi-theme.zip` — o arquivo que o botão de download entrega.
- `src/styles.css` — as cores do site.

## Idioma automático

O site escolhe o idioma sozinho pelo país do visitante: Brasil, Portugal, Angola e Moçambique abrem em português; os demais países abrem em inglês. O visitante pode trocar no seletor no topo, e o site lembra da escolha.

## Trocar o arquivo do tema

Substitua `public/downloads/rei-nerv-dsi-theme.zip` pelo seu arquivo de tema verdadeiro. O botão aponta para esse caminho.

---

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
