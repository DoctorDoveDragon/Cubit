Screenshot automation tool (Puppeteer)

How to use

1. Start the frontend dev server:

```bash
cd frontend
npm run dev
```

2. Install Puppeteer from the repo root (so the tools script can find it):

```bash
cd /Users/imac/CUBIT/Cubit-1
npm install puppeteer --save-dev
```

3. Run the script from the repo root:

```bash
node tools/screenshot-geometries.js
```

Optional environment variables:
- TARGET_URL - default is http://localhost:3000

Output:
- PNG files saved into `/Users/imac/CUBIT/Cubit-1/PATENT_DRAWINGS/`
- Filenames: Figure_2_Node.png ... Figure_9_UI_Complete.png

Notes:
- The script attempts to click UI elements by visible text (e.g., buttons labeled "Node", "Circle"). If your UI uses different labels or elements, you may need to update the script to use specific selectors.
- Puppeteer will run headless by default. If you want to see the browser, modify the launch options in the script.
