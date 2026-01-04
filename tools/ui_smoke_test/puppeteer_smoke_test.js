const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

async function run() {
    const base = process.env.BASE_URL || 'http://localhost:3000'
    const outDir = path.resolve(__dirname, '../../PATENT_PACKAGE/screenshots')
    fs.mkdirSync(outDir, { recursive: true })

    console.log('Launching browser...')
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()
    page.setViewport({ width: 1280, height: 800 })
    page.setDefaultTimeout(30000)

    const list = [
        { url: base, name: 'home' },
        { url: `${base}/examples/basic`, name: 'examples_basic' }
    ]

    for (const item of list) {
        try {
            console.log('Loading', item.url)
            await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 60000 })
            const file = path.join(outDir, `${item.name}.png`)
            await page.screenshot({ path: file, fullPage: true })
            console.log('Saved screenshot:', file)
            await new Promise(r => setTimeout(r, 800))
        } catch (err) {
            console.error('Error capturing', item.url, err && err.message ? err.message : err)
        }
    }

    // Extra interactions: open GameTabs and capture specific game canvases
    const clickByText = async (text) => {
        return await page.evaluate((t) => {
            const nodes = Array.from(document.querySelectorAll('button, a'))
            const match = nodes.find(n => (n.textContent || '').trim().includes(t))
            if (match) { (match).click(); return true }
            return false
        }, text)
    }

    // Try Flowchart Builder
    console.log('Selecting Flowchart Builder tab...')
    await clickByText('Flowchart Builder')
    // Capture full-page state after selecting the tab
    {
        const file = path.join(outDir, `flowchart_full.png`)
        await page.screenshot({ path: file, fullPage: true })
        console.log('Saved screenshot:', file)
    }
    try {
        await page.waitForSelector('svg, canvas', { timeout: 8000 })
        const file = path.join(outDir, `flowchart.png`)
        await page.screenshot({ path: file, fullPage: true })
        console.log('Saved screenshot:', file)
    } catch (err) {
        console.warn('Flowchart canvas not found:', err && err.message ? err.message : err)
    }

    // Try Solar System
    console.log('Selecting Solar System tab...')
    await clickByText('Solar System')
    // Capture full-page state after selecting the tab
    {
        const file = path.join(outDir, `solar_system_full.png`)
        await page.screenshot({ path: file, fullPage: true })
        console.log('Saved screenshot:', file)
    }
    try {
        await page.waitForSelector('canvas', { timeout: 8000 })
        const canvas = await page.$('canvas')
        if (canvas) {
            const file = path.join(outDir, `solar_system.png`)
            await canvas.screenshot({ path: file })
            console.log('Saved screenshot:', file)
        }
    } catch (err) {
        console.warn('Solar System canvas not found:', err && err.message ? err.message : err)
    }

    // Try Animated Art
    console.log('Selecting Animated Art tab...')
    await clickByText('Animated Art')
    // Capture full-page state after selecting the tab
    {
        const file = path.join(outDir, `animated_art_full.png`)
        await page.screenshot({ path: file, fullPage: true })
        console.log('Saved screenshot:', file)
    }
    try {
        await page.waitForSelector('canvas', { timeout: 8000 })
        const artCanvas = await page.$('canvas')
        if (artCanvas) {
            const box = await artCanvas.boundingBox()
            if (box) {
                await page.mouse.click(box.x + 20, box.y + 20)
            }
            const file = path.join(outDir, `animated_art.png`)
            await artCanvas.screenshot({ path: file })
            console.log('Saved screenshot:', file)
        }
    } catch (err) {
        console.warn('Animated Art canvas not found:', err && err.message ? err.message : err)
    }

    await browser.close()
    console.log('Smoke test finished. Screenshots saved to', outDir)
}

run().catch(err => {
    console.error('Smoke test failed:', err)
    process.exit(1)
})
