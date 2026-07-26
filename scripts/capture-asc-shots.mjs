/**
 * Capture /app-store-shots export slides into public/app-store/asc/
 * at exact App Store Connect pixel sizes.
 *
 * Usage: node scripts/capture-asc-shots.mjs [baseUrl]
 */
import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public/app-store/asc");

const BASE = process.argv[2] || "http://localhost:3000";

const SHOTS = [
  { asc: "hero", file: "01-hero" },
  { asc: "capture", file: "02-capture" },
  { asc: "daily", file: "03-daily" },
  { asc: "pray", file: "04-prayed" },
  { asc: "footprints", file: "05-footprints" },
];

const TARGETS = [
  { prefix: "iphone-65", w: 1284, h: 2778 },
  { prefix: "ipad-13", w: 2048, h: 2732 },
];

async function waitForServer(url, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 200) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Server not ready: ${url}`);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  await waitForServer(`${BASE}/app-store-shots`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  for (const t of TARGETS) {
    for (const s of SHOTS) {
      const url = `${BASE}/app-store-shots?export=1&lang=en&asc=${s.asc}&w=${t.w}&h=${t.h}`;
      const outPath = path.join(OUT, `${t.prefix}-${s.file}.png`);
      console.log(`Capture ${outPath}`);
      await page.setViewportSize({ width: t.w, height: t.h });
      await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForSelector("#store-export-slide", { timeout: 30000 });
      // Hide Next.js / browser chrome that must not appear in ASC assets
      await page.addStyleTag({
        content: `
          nextjs-portal, [data-nextjs-toast], #__next-build-watcher,
          [data-next-badge], [data-nextjs-dev-overlay] { display: none !important; }
        `,
      });
      await page.evaluate(() => {
        document
          .querySelectorAll("nextjs-portal, [data-next-badge]")
          .forEach((el) => el.remove());
      });
      // Allow fonts / images to settle
      await page.waitForTimeout(700);
      const slide = page.locator("#store-export-slide");
      await slide.screenshot({
        path: outPath,
        type: "png",
        animations: "disabled",
      });
      const meta = await page.evaluate(() => {
        const el = document.getElementById("store-export-slide");
        const r = el.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height) };
      });
      console.log(`  slide CSS ${meta.w}x${meta.h}`);
    }
  }

  await browser.close();
  console.log("Done — verify with: sips -g pixelWidth -g pixelHeight public/app-store/asc/*.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
