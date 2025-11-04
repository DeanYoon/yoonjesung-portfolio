# Dean Yoon – Pixel Clock Portfolio (Next.js)

A creative frontend portfolio that showcases an innovative "pixel clock" concept where analog clocks arrange to form digital numbers. Built with Next.js, TypeScript, and modern web animation techniques.

## Live Preview
- Deployed: coming soon (replace with your production URL)

## Features
- Pixel Clock Interface: Analog clocks compose readable digital digits in real time
- Modern Stack: Next.js 14, React, TypeScript, CSS Modules/Tailwind (project styles)
- SEO & Social: Open Graph/Twitter meta, JSON-LD, canonical links
- PWA Essentials: Web App Manifest, theme color, touch icons
- Favicon Suite: Multi-size PNGs, ICO, Apple touch icon, Android Chrome icons

## Tech Stack
- Framework: Next.js (App Router), React, TypeScript
- Tooling: ESLint, Prettier (if configured), Vercel (recommended hosting)
- Styling: Tailwind CSS or CSS Modules (check project)

## Getting Started
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Project Structure
```
app/
  layout.tsx      # Metadata, icons, manifest wiring
  page.tsx        # Entry page (pixel clock demo and sections)
public/
  logo.svg        # Source logo (Space Silver)
  favicon.ico     # Multi-size ICO (16/32/48)
  favicon-16x16.png
  favicon-32x32.png
  apple-touch-icon.png
  android-chrome-192x192.png
  android-chrome-512x512.png
  site.webmanifest
```

## SEO & PWA
- Metadata wired in `app/layout.tsx`:
  - icons: favicon (ICO/PNG), apple-touch-icon, shortcut icon, mask-icon
  - manifest: `/site.webmanifest`
  - themeColor: light mode `#B3B3B3` (matches logo), dark mode `#1e293b`
- Social previews: Open Graph & Twitter card fields prepared (add images: `/og-image.png`, `/twitter-image.png`)

## Development Notes
- The favicon set was generated from `public/logo.svg` and registered in Next metadata.
- For pixel-perfect rasterization from SVG, consider a pipeline with SVGO + sharp/librsvg.
- Add maskable icons for Android adaptive icons if needed.

## About the Author
**Jesung (Dean) Yoon** — Frontend Developer based in Minato, Tokyo, Japan.

- Current: Frontend Web Developer at NC Japan (Jul 2024 – Present), Roppongi, Tokyo (On-site)
  - React.js, Next.js, and modern frontend tooling
- Past: Back Office Engineer at Danal (Apr 2023 – Oct 2023)
  - Began as frontend; expanded to DB server ops, data extraction, and stored procedures for bond-related workflows (MS SQL Server, Confluence, etc.)
- Education: B.S. in Industrial Engineering, Hanyang Univ ERICA (2016–2023), GPA 3.54/4.5
- Languages: English (Limited working), Japanese (Limited working)
- Skills: JavaScript, React, Next.js, TypeScript, SQL Server, Confluence
- LinkedIn: https://www.linkedin.com/in/jesung-yoon-123287235/

## Roadmap
- [ ] Publish live demo link and add OG/Twitter images
- [ ] Add maskable icons and install banner
- [ ] Extract Pixel Clock into a standalone package/component
- [ ] Write technical blog post on layout/animation techniques

## License
This project is for portfolio demonstration purposes. If you want to use the pixel clock concept or code, please open an issue to discuss licensing/attribution first.
