UI smoke test (Puppeteer)

Quick start

1. From the repo root, install puppeteer as a dev dependency (this will download a headless Chromium):

```bash
cd frontend
npm install --save-dev puppeteer
```

2. Make sure the dev server is running at http://localhost:3000 (or set BASE_URL env var to your URL).

3. Run the smoke test:

```bash
node ../tools/ui_smoke_test/puppeteer_smoke_test.js
```

Output
- PATENT_PACKAGE/solar_system_smoke.png
- PATENT_PACKAGE/animated_art_smoke.png

Notes
- If your Games route is not `/course`, edit the top of the script and change the `courseUrl` variable.
- The script is intentionally lightweight: it clicks the visible game tabs, finds the first canvas, clicks a few controls, and saves screenshots. Expand as needed for more assertions.
