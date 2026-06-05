# Onboarding Marketing Bot

Static browser-only Cordia app for shaping a 7-day welcome email sequence. Release 0 includes one onboarding email per day, live preview, local autosave, copy, reset, theme selection, and JSON export.

## Structure

- `public/index.html` - app markup and deploy entry point
- `public/global.css` - global styling
- `src/app.ts` - typed browser-only application source
- `public/app.js` - compiled browser application logic
- `public/_redirects` - static-host SPA fallback
- `public/_headers` - basic static security headers

## Run locally

Install dependencies, compile TypeScript, then serve the `public` folder with any static file server:

```sh
npm install
npm run build
python3 -m http.server 4173 --directory public
```

Then open `http://localhost:4173`.

## Deploy

Use these static-host settings:

- Build command: `npm run build`
- Build output directory: `public`

This app does not require bundling or server functions.
