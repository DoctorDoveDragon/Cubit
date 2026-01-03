#!/usr/bin/env node
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    const url = 'http://localhost:3000';
    const outDir = path.resolve(__dirname, '..', 'PATENT_DRAWINGS');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    console.log('Opening', url);
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    } catch (e) {
        console.error('Failed to open', url, e.message);
        await browser.close();
        process.exit(2);
    }

    // Wait a bit for the UI to hydrate and the component to mount
    await new Promise(r => setTimeout(r, 1500));

    // Try clicking the Export SVG button by text using in-page DOM (avoid page.$x)
    const clicked = await page.evaluate(() => {
        try {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => b.textContent && /Export SVG|📐 Export SVG|Export/.test(b.textContent));
            if (btn) { try { btn.click(); } catch (e) { } return true; }
            return false;
        } catch (e) {
            return false;
        }
    });

    if (!clicked) {
        console.warn('Export button not found by text; ensure the app is running and the Computational Geometry page is active.');
    }

    // Wait for the window.__lastExportSVG to appear
    try {
        await page.waitForFunction(() => {
            // @ts-ignore
            return typeof window !== 'undefined' && !!window.__lastExportSVG;
        }, { timeout: 15000 });
    } catch (e) {
        console.error('Timed out waiting for exported SVG on page.');
        await browser.close();
        process.exit(3);
    }

    const svg = await page.evaluate(() => {
        // @ts-ignore
        return window.__lastExportSVG || null;
    });

    if (!svg) {
        console.error('No SVG found in window.__lastExportSVG');
        await browser.close();
        process.exit(4);
    }

    // Try to read figure number input value if present
    const figNum = await page.evaluate(() => {
        const el = document.querySelector('input[placeholder="Fig #"]');
        if (el && el.value !== undefined) return (el.value) || null;
        return null;
    });

    const time = new Date().toISOString().replace(/[:.]/g, '-');
    const figPart = figNum ? `Figure_${String(figNum).padStart(2, '0')}_` : '';
    const outName = `${figPart}ComputationalGeometry_Export_${time}.svg`;
    const outPath = path.join(outDir, outName);

    fs.writeFileSync(outPath, svg, 'utf8');
    console.log('Saved SVG to', outPath);

    await browser.close();
})();
