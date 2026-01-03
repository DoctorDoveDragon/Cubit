const puppeteer = require('puppeteer');
const fs = require('fs');

async function run() {
    const base = process.env.BASE_URL || 'http://localhost:3000';
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultTimeout(30000);

    const clickByText = async (text) => {
        // Find a button or link whose visible text contains `text` and click it.
        // Use page.evaluate (DOM) rather than page.$x for robustness across environments.
        return await page.evaluate((t) => {
            const nodes = Array.from(document.querySelectorAll('button, a'));
            const match = nodes.find(n => (n.textContent || '').trim().includes(t));
            if (match) { match.click(); return true; }
            return false;
        }, text);
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    console.log('Opening', base);
    await page.goto(base, { waitUntil: 'networkidle2' });

    // Try to open the Course/games UI: click the 'Cubit Full Course' button from the home page
    // (some apps use client-side routing, so clicking is more robust than a direct goto)
    await clickByText('Cubit Full Course');
    await sleep(1200);

    // Wait for GameTabs to render (longer timeout because client-side components may hydrate)
    await page.waitForSelector('h1, h2, main, canvas', { timeout: 20000 }).catch(() => { });

    // Click the Solar System tab (by visible text)
    console.log('Selecting Solar System tab...');
    await clickByText('Solar System');
    await sleep(800);

    // Wait for the SolarSystem canvas
    const solarCanvas = await page.waitForSelector('canvas', { timeout: 8000 });
    console.log('Found canvas for Solar System — taking screenshot');
    await solarCanvas.screenshot({ path: 'PATENT_PACKAGE/solar_system_smoke.png' });

    // Try controls: Pause (or Play) and Step
    await clickByText('⏸️ Pause').catch(() => { });
    await sleep(300);
    await clickByText('Step ▶').catch(() => { });
    await sleep(300);
    await clickByText('Reset').catch(() => { });
    await sleep(300);

    // Now switch to Animated Art
    console.log('Selecting Animated Art tab...');
    await clickByText('Animated Art');
    await sleep(800);

    // Wait for AnimatedArt canvas
    const artCanvas = await page.waitForSelector('canvas', { timeout: 8000 });
    console.log('Found canvas for Animated Art — clicking to add a shape');
    const box = await artCanvas.boundingBox();
    if (box) {
        await page.mouse.click(box.x + 50, box.y + 50);
    }
    await sleep(300);

    // If there is a Run Code button, click it to exercise the parser
    const ran = await clickByText('Run Code');
    if (ran) {
        await sleep(600);
    }

    // Take screenshot of animated art
    await artCanvas.screenshot({ path: 'PATENT_PACKAGE/animated_art_smoke.png' });

    console.log('Screenshots saved to PATENT_PACKAGE/');

    await browser.close();
    console.log('Smoke test completed successfully.');
}

run().catch(err => {
    console.error('Smoke test failed:', err);
    process.exit(1);
});
