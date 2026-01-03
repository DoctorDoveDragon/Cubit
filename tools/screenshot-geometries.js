#!/usr/bin/env node
// tools/screenshot-geometries.js
// Headless screenshot tool using Puppeteer
// Usage:
//   1) Start your frontend dev server: cd frontend && npm run dev
//   2) From repo root: npm install puppeteer --save-dev
//   3) Run this script: node tools/screenshot-geometries.js

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
    const URL = process.env.TARGET_URL || 'http://localhost:3000';
    const OUTDIR = path.resolve(__dirname, '..', 'PATENT_DRAWINGS');
    if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });

    console.log('Opening', URL);
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    page.setViewport({ width: 1400, height: 900 });

    try {
        await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
        console.log('Page loaded');

        // Navigate to Games -> Computational Geometry if needed using link text
        // Attempt to click navigation elements by visible text if they exist
        async function clickByText(selector, text) {
            const elements = await page.$$(selector);
            for (const el of elements) {
                const txt = await page.evaluate(e => e.textContent, el);
                if (txt && txt.trim().toLowerCase().includes(text.toLowerCase())) {
                    await el.click();
                    return true;
                }
            }
            return false;
        }

        // Try to navigate via common patterns
        await clickByText('a, button', 'games');
        await new Promise(r => setTimeout(r, 400));
        await clickByText('a, button', 'computational');
        await new Promise(r => setTimeout(r, 800));

        // List of shapes to capture. Filenames follow Figure_2...Figure_8, Figure_9 for UI
        const shapes = [
            { name: 'Node', file: 'Figure_2_Node.png' },
            { name: 'Circle', file: 'Figure_3_Circle.png' },
            { name: 'Square', file: 'Figure_4_Square.png' },
            { name: 'Triangle', file: 'Figure_5_Triangle.png' },
            { name: 'Line', file: 'Figure_6_Line.png' },
            { name: 'Arc', file: 'Figure_7_Arc.png' },
            { name: 'Matrix', file: 'Figure_8_Matrix.png' }
        ];

        // Helper to click a button by its visible text (DOM-based to avoid $x issues)
        async function pressButtonWithText(text) {
            const clicked = await page.evaluate((t) => {
                const candidates = Array.from(document.querySelectorAll('button, a, div, span'));
                const el = candidates.find(e => e.textContent && e.textContent.trim().toLowerCase().includes(t.toLowerCase()));
                if (!el) return false;
                el.click();
                return true;
            }, text);
            return clicked;
        }

        // Wait for canvas to appear
        async function getCanvasBox() {
            await page.waitForSelector('canvas', { timeout: 10000 });
            const canvas = await page.$('canvas');
            const box = await canvas.boundingBox();
            return box;
        }

        for (const shape of shapes) {
            console.log('Selecting shape:', shape.name);
            const ok = await pressButtonWithText(shape.name);
            if (!ok) {
                console.warn(`Could not find a clickable element with text '${shape.name}'. Trying again by partial match...`);
                // Try partial lower-case matching by scanning buttons
                const buttons = await page.$$('button');
                let clicked = false;
                for (const b of buttons) {
                    const txt = await page.evaluate(e => e.textContent || '', b);
                    if (txt && txt.toLowerCase().includes(shape.name.toLowerCase())) {
                        await b.click();
                        clicked = true;
                        break;
                    }
                }
                if (!clicked) console.warn(`No button found for shape ${shape.name}.`);
            }

            // Wait a bit for canvas to update
            await new Promise(r => setTimeout(r, 700));

            try {
                const box = await getCanvasBox();
                if (!box) {
                    console.warn('Canvas bounding box not found; taking full page screenshot instead.');
                    await page.screenshot({ path: path.join(OUTDIR, shape.file), fullPage: true });
                } else {
                    // Expand box slightly for padding
                    const padding = 6;
                    const clip = {
                        x: Math.max(0, Math.floor(box.x - padding)),
                        y: Math.max(0, Math.floor(box.y - padding)),
                        width: Math.min(Math.ceil(box.width + padding * 2), page.viewport().width),
                        height: Math.min(Math.ceil(box.height + padding * 2), page.viewport().height)
                    };
                    await page.screenshot({ path: path.join(OUTDIR, shape.file), clip });
                }
                console.log('Saved', shape.file);
            } catch (err) {
                console.error('Error capturing shape', shape.name, err.message);
            }
        }

        // Full UI screenshot
        console.log('Taking full UI screenshot...');
        await page.screenshot({ path: path.join(OUTDIR, 'Figure_9_UI_Complete.png'), fullPage: true });
        console.log('Saved Figure_9_UI_Complete.png');

        console.log('All done. Files saved to', OUTDIR);
    } catch (err) {
        console.error('Error during run:', err);
    } finally {
        await browser.close();
    }
})();
