const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function run() {
    const drawingsDir = path.resolve(__dirname, '..', 'PATENT_DRAWINGS');
    const outPdf = path.join(drawingsDir, 'Patent_Figures_Letter.pdf');

    const files = fs.readdirSync(drawingsDir).filter(f => f.endsWith('.svg')).sort();
    if (files.length === 0) {
        console.error('No SVGs found in', drawingsDir);
        process.exit(1);
    }

    // Build an HTML document that places each SVG into a letter-sized page
    const parts = [];
    parts.push('<!doctype html><html><head><meta charset="utf-8"><style>');
    parts.push('@page { size: 8.5in 11in; margin: 0.5in; }');
    parts.push('body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; }');
    parts.push('.page { width: calc(8.5in - 1in); height: calc(11in - 1in); display:flex; align-items:center; justify-content:center; page-break-after: always; background: #fff; }');
    parts.push('.page svg { max-width: 100%; max-height: 100%; }');
    parts.push('</style></head><body>');

    for (const f of files) {
        const p = path.join(drawingsDir, f);
        const svg = fs.readFileSync(p, 'utf8');
        // Embed the raw SVG inside the page
        parts.push('<div class="page">');
        parts.push(svg);
        parts.push('</div>');
    }

    parts.push('</body></html>');

    const html = parts.join('\n');

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        // Print to letter-sized PDF
        await page.pdf({ path: outPdf, format: 'Letter', printBackground: true, preferCSSPageSize: true });
        console.log('Wrote PDF to', outPdf);
    } finally {
        await browser.close();
    }
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
