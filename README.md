<p align="center">
  <img src="docs/cover.jpg" alt="VERRA Estates — premium real estate website" width="860">
</p>

<h1 align="center">VERRA Estates</h1>

<p align="center">
  Premium real-estate website for a boutique agency in Kyiv.<br>
  <a href="https://verra-orcin.vercel.app"><b>Live demo</b></a> ·
  <a href="docs/demo.mp4"><b>Watch the video</b></a>
</p>

<p align="center">
  <a href="docs/demo.mp4"><img src="docs/demo.gif" alt="Demo" width="320"></a>
</p>

<p align="center">
  React 19 · TypeScript · Vite · Tailwind CSS v4 · Vercel
</p>

---

A premium real-estate site for a boutique agency in Kyiv: large photography, expressive typography, glass-effect cards and scroll-driven motion.

> Student design project. Properties, prices, contacts and testimonials are fictional placeholders.

## Stack

- **React 19** + **TypeScript** (strict)
- **Vite** for dev server and build
- **Tailwind CSS v4** (tokens + utilities; the existing design styles are kept as plain CSS files in `src/styles`, and can be moved to utilities gradually)

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

## Project structure

```
index.html              SEO / Open Graph tags, intro flag, <noscript> fallback
public/                 favicon
src/
  main.tsx, App.tsx     entry + page composition, shared state (filters, inquiry dialog)
  data/                 typed content: properties, locations, testimonials, media URLs
  lib/                  catalog filtering, motion helpers (scroll velocity, easing)
  hooks/                useReveal, useRiser, useCountUp, useDeck, useHeroLens
  components/           Intro, Hero, About, Why, Residences (+PropertyCard), Locations,
                        Contact, Footer, InquiryDialog, Photo
  styles/               design CSS split by section, imported from index.css
```

## Motion system

| Hook | What it does |
| --- | --- |
| `useReveal` | adds `in` (and `fast` after a quick scroll) when a section approaches the viewport |
| `useRiser` | smoothed scroll-linked "section slides up over the previous one" |
| `useCountUp` | exponential ease-out counter for the statistics |
| `useDeck` | catalog entrance: one pile of six cards dealt out in two rows |
| `useHeroLens` | hover lens on the hero video drawn on a canvas, with touch support |

Everything respects `prefers-reduced-motion`.

## Before going live

- [ ] Replace the placeholder phone, e-mail, address and social links in `src/data/content.ts`
- [ ] Set `VITE_TELEGRAM_URL` / `VITE_WHATSAPP_URL` in Vercel to show the Telegram and WhatsApp buttons (hidden when empty)
- [ ] Replace placeholder photos for the last properties with real ones
- [ ] Optional: `RESEND_API_KEY` + `MAIL_FROM`, `FORM_WEBHOOK_URL`, `VITE_GA_ID`

After deploy: [PageSpeed Insights](https://pagespeed.web.dev) and [opengraph.xyz](https://www.opengraph.xyz) for the link preview.

## License

All rights reserved. Photos and video are AI-generated placeholders for the demo.

## Features

**Catalog and search**
- 15 residences; the home page shows 6 with a link to the full catalog (`/catalog`)
- Filters by location, type, price and bedrooms, plus text search; the filters live in the URL, so any result can be shared
- Map view (`/catalog?view=map`): a custom OpenStreetMap slippy map with no map library, quick presets for Kyiv, the region and Odesa

**Property page** (`/property/:id`)
- Photo gallery, key facts, description, features list and a location map
- Mortgage calculator (price, down payment, term, rate) with the monthly payment
- Similar properties

**Tools for buyers**
- Favourites (`/favorites`) and compare list (`/compare`, up to 3 properties side by side), saved in the browser
- Viewing request form: date picker, ready-made question chips or a custom question, honeypot spam protection

**Backend** (`api/inquiry.js`, Vercel serverless function)
- Sends each enquiry to Telegram through the Bot API
- Optional confirmation email to the visitor (Resend)
- Optional Google Sheets or webhook export (see `docs/google-sheets.md`)

**Content and pages**
- UA / EN switcher (dictionary in `src/data/ua.ts`), with typography tuned separately for Ukrainian
- `/team`, `/journal`, `/journal/:slug`, `/privacy`, `/terms`
- Hand-written History API router, `vercel.json` rewrites all routes to `index.html`
- Per-page titles and meta tags, sitemap, robots.txt, Open Graph image

**Quality**
- Accessibility: skip link, focus rings, keyboard-friendly menus, `prefers-reduced-motion`
- `ErrorBoundary` instead of a blank page
- `npm test` runs unit tests for filters, URL round trip and the mortgage maths; `.github/workflows/ci.yml` runs tests and the build on every push
- Optional Google Analytics 4

## Environment variables (Vercel → Settings → Environment Variables)
| name | purpose |
| --- | --- |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | enquiries to Telegram |
| `RESEND_API_KEY`, `MAIL_FROM` | confirmation email to the visitor (optional) |
| `FORM_WEBHOOK_URL` | Google Sheets or any webhook (optional) |
| `VITE_GA_ID` | Google Analytics 4 (optional) |
| `VITE_TELEGRAM_URL`, `VITE_WHATSAPP_URL` | contact buttons (hidden when empty) |

## How to add a property
Add one object to `properties` in `src/data/properties.ts` (id, name, type, location, price, photos, coordinates, description in EN and UA) and add its URL to `public/sitemap.xml`.
