#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
    const imgsDir = path.resolve(__dirname, '..', 'PATENT_DRAWINGS');
    const outPdf = path.join(imgsDir, 'Patent_Drawings_Complete.pdf');

    const names = [
        'Figure_2_Node.png', 'Figure_3_Circle.png', 'Figure_4_Square.png', 'Figure_5_Triangle.png',
        'Figure_6_Line.png', 'Figure_7_Arc.png', 'Figure_8_Matrix.png', 'Figure_9_UI_Complete.png'
    ];

    const imgs = names.map(n => path.join(imgsDir, n)).filter(p => fs.existsSync(p));
    if (imgs.length === 0) {
        console.error('No images found in', imgsDir);
        process.exit(1);
    }

    // Create backups of originals before annotating
    const backupDir = path.join(imgsDir, 'originals_backup_' + Date.now());
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);
    imgs.forEach(p => {
        const dest = path.join(backupDir, path.basename(p));
        if (!fs.existsSync(dest)) fs.copyFileSync(p, dest);
    });

    // Short captions for each figure (in same order as 'names')
    const captions = [
        'Figure 2 — Node: represents a single data node or variable in a computation.',
        'Figure 3 — Circle: represents iterative loops or cyclic processes.',
        'Figure 4 — Square: represents structured containers or records.',
        'Figure 5 — Triangle: represents branching or conditional logic.',
        'Figure 6 — Line: represents data flow or sequencing.',
        'Figure 7 — Arc: represents partial connections or curved transitions.',
        'Figure 8 — Matrix: represents arrays, matrices, or tabular data.',
        'Figure 9 — UI Complete: full interface showing shapes, controls, and mappings.'
    ];

    // Use Puppeteer to render each image with an embedded caption and overwrite the original PNG
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    for (let i = 0; i < imgs.length; i++) {
        const p = imgs[i];
        const caption = captions[i] || '';
        const fileData = fs.readFileSync(p).toString('base64');
        const dataUrl = 'data:image/png;base64,' + fileData;

        const singleHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
            body { margin:0; padding:0; display:flex; align-items:center; justify-content:center; background: transparent }
            .wrap { position:relative; display:inline-block }
            img { display:block; max-width:100%; height:auto; border-radius:6px }
            .caption { position:absolute; left:50%; transform:translateX(-50%); bottom:8px; background:rgba(0,0,0,0.6); color:#fff; padding:6px 10px; border-radius:6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; font-size:12px }
        </style></head><body><div class="wrap"><img id="theimg" src="${dataUrl}"/><div class="caption">${caption}</div></div></body></html>`;

        await page.setContent(singleHtml, { waitUntil: 'load', timeout: 10000 });

        // Wait for the <img> to load and report natural dimensions
        await page.waitForSelector('#theimg', { timeout: 10000 });
        await page.waitForFunction(() => {
            const el = document.getElementById('theimg');
            return el && el.naturalWidth && el.naturalWidth > 0;
        }, { timeout: 60000 });

        // Scale factor (30:1 requested)
        const SCALE = 30;

        // Resize the image in-page to SCALE * natural dimensions so the screenshot produces a high-res image
        await page.evaluate((scale) => {
            const img = document.getElementById('theimg');
            if (!img) return;
            const nw = img.naturalWidth || 0;
            const nh = img.naturalHeight || 0;
            const w = Math.max(1, Math.round(nw * scale));
            const h = Math.max(1, Math.round(nh * scale));
            img.style.width = w + 'px';
            img.style.height = h + 'px';
            img.style.maxWidth = 'none';
            img.style.maxHeight = 'none';
            const wrap = document.querySelector('.wrap');
            if (wrap) { wrap.style.width = w + 'px'; wrap.style.height = h + 'px'; }
            const cap = document.querySelector('.caption');
            if (cap) { cap.style.fontSize = Math.max(12, Math.round(12 * scale)) + 'px'; cap.style.padding = Math.max(6, Math.round(6 * scale)) + 'px ' + Math.max(10, Math.round(10 * scale)) + 'px'; }
            // Increase body background to ensure transparent preserved
            document.body.style.background = '#fff';
        }, SCALE);

        // small delay to allow layout to settle
        await new Promise(res => setTimeout(res, 200));

        // Wait for wrapper then screenshot
        const handle = await page.$('.wrap');
        if (!handle) {
            console.warn('Could not render image for', p);
            continue;
        }

        // Overwrite the original file with the annotated high-resolution version
        await handle.screenshot({ path: p, type: 'png' });
    }

    // After annotating images, prepare PDF pages
    const parts = imgs.map((p) => {
        const src = 'file://' + p.replace(/#/g, '%23');
        return `<div class="page"><div class="content"><img src="${src}" class="figure"/></div></div>`;
    });

    const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    @page { size: A4; margin: 20mm; }
    body { margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111 }
    .page { page-break-after: always; display:flex; align-items:flex-start; justify-content:center; height:100vh; padding-top:24mm; box-sizing:border-box }
    .content { width:100%; max-width:800px; text-align:center; margin:0 auto }
    .figure { max-width:100%; height:auto; display:block; margin:0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.35); border-radius:6px }
    .caption { margin-top:12px; font-size:12px; color:#222 }
    header { position:fixed; left:0; right:0; top:8mm; text-align:center; font-weight:700; color:#b33; opacity:0.95 }
    footer { position:fixed; left:0; right:0; bottom:8mm; text-align:center; font-size:11px; color:#666 }
  </style></head><body><header>DRAFT — on my friend</header>${parts.join('\n')}<footer>Generated from Cubit repository — Patent drawings (annotated)</footer></body></html>`;

    await page.setContent(html, { waitUntil: 'load', timeout: 20000 });
    await page.pdf({ path: outPdf, format: 'A4', printBackground: true });
    await browser.close();
    console.log('PDF created at', outPdf);
})();
