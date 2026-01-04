const { firefox } = require('playwright');
const fs = require('fs');
const path = require('path');

async function run() {
    const outDir = path.resolve(__dirname, '..', '..', 'PATENT_PACKAGE', 'screenshots');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const base = process.env.SMOKE_BASE || 'http://127.0.0.1:3000';
    console.log('Using base URL:', base);

    const browser = await firefox.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    try {
        const captures = [
            { url: '/', name: 'home.png' },
            { url: '/examples/basic', name: 'examples_basic.png' },
        ];

        for (const c of captures) {
            const url = base + c.url;
            console.log('Loading', url);
            await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(err => {
                console.warn('Warning: failed to load', url, err && err.message);
            });
            const out = path.join(outDir, c.name);
            console.log('Saving', out);
            await page.screenshot({ path: out, fullPage: true }).catch(err => console.warn('screenshot failed', err && err.message));
            await page.waitForTimeout(400);
        }

        // Try to navigate into Game tabs if present
        try {
            await page.goto(base + '/examples/basic', { waitUntil: 'networkidle', timeout: 30000 });
            // Click Flowchart Builder tab by visible text, then screenshot
            const tabTexts = ['Flowchart Builder', 'Flowchart', 'Solar System', 'Animated Art'];
            for (const t of tabTexts) {
                try {
                    const el = await page.$(`text="${t}"`);
                    if (el) {
                        console.log('Clicking tab:', t);
                        await el.click();
                        await page.waitForTimeout(800);
                        const safeName = t.toLowerCase().replace(/[^a-z0-9]+/g, '_') + '.png';
                        const out = path.join(outDir, safeName);
                        await page.screenshot({ path: out, fullPage: true });
                        console.log('Saved', out);
                    } else {
                        console.log('Tab not found:', t);
                    }
                } catch (err) {
                    console.warn('Error interacting with tab', t, err && err.message);
                }
            }
        } catch (err) {
            console.warn('Game tabs step failed:', err && err.message);
        }

        console.log('Smoke test finished. Screenshots saved to', outDir);
    } finally {
        await browser.close();
    }
}

run().catch(err => {
    console.error('Smoke test failed:', err && err.stack ? err.stack : err);
    process.exit(1);
});
