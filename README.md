# Verra Estates

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

## Before deploying

Search for `TODO` in `index.html` and `src/`:

- [ ] Replace `YOUR-DOMAIN.com` (`canonical`, `og:url`, `og:image`, `twitter:image`)
- [ ] Add a 1200×630 `og-image.jpg`, `apple-touch-icon.png` (180×180) and real favicons to `public/`
- [ ] Connect the inquiry form (`src/components/InquiryDialog.tsx`) to a backend / CRM / email service
- [ ] Replace placeholder phone, e-mail, address and social links (`src/data/content.ts`)
- [ ] Add GA4 / Meta Pixel at the marked comments in `index.html`
- [ ] Optimise Cloudinary media (`f_auto,q_auto`) and compress the hero video

After deploy: [PageSpeed Insights](https://pagespeed.web.dev) and a link-preview checker such as [opengraph.xyz](https://www.opengraph.xyz).

## License

All rights reserved. Photos and video are AI-generated placeholders for the demo.

## Pages and features
- `/` landing · `/catalog` all 15 residences (filters live in the URL) · `/property/:id` detail page (gallery, map, mortgage calculator, similar) · `/favorites` · `/compare`
- UA / EN switcher (dictionary in `src/data/ua.ts`), favourites and compare list saved in the browser
- Enquiry form posts to `api/inquiry.js` (Vercel function) → Telegram. Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in Vercel → Settings → Environment Variables. Optional: `FORM_WEBHOOK_URL`, `VITE_GA_ID` (GA4).
- `vercel.json` rewrites all routes to `index.html`.

## More features
- `/catalog?view=map`: all residences on an OpenStreetMap map (no map library), search by name or district
- `/team`, `/journal`, `/journal/:slug`, `/privacy`, `/terms` (UA / EN content lives in `src/data/*.ts`)
- Enquiry form: date + time, question chips, honeypot, Telegram delivery, optional confirmation email (Resend) and Google Sheets (see `docs/google-sheets.md`)
- Accessibility: skip link, focus rings, keyboard-friendly menus; `ErrorBoundary` instead of a blank page
- `npm test` runs unit tests for filters, URL round trip and the mortgage maths; `.github/workflows/ci.yml` runs tests and the build on every push

## Environment variables (Vercel → Settings → Environment Variables)
| name | purpose |
| --- | --- |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | enquiries to Telegram |
| `RESEND_API_KEY`, `MAIL_FROM` | confirmation email to the visitor (optional) |
| `FORM_WEBHOOK_URL` | Google Sheets or any webhook (optional) |
| `VITE_GA_ID` | Google Analytics 4 (optional) |

## How to add a property
Add one object to `properties` in `src/data/properties.ts` (id, name, type, location, price, photos, coordinates, description in EN and UA) and add its URL to `public/sitemap.xml`.
