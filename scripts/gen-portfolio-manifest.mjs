// Run: node scripts/gen-portfolio-manifest.mjs
// Outputs: src/assets/portfolio.manifest.json
import fg from "fast-glob";
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const SRC_GLOB = "src/assets/portfolio/**/*.{png,jpg,jpeg,gif,webp,avif}";
const OUT = "src/assets/portfolio.manifest.json";

// tiny preview width (balance size vs quality)
const PREVIEW_W = 24;

const files = await fg(SRC_GLOB, { dot: false });
const out = [];

for (const file of files) {
  try {
    const img = sharp(file);
    const meta = await img.metadata();
    if (!meta.width || !meta.height) continue;

    // tiny blurred preview (JPEG for best size; adjust quality if you like)
    const buf = await img
      .resize({ width: PREVIEW_W })
      .jpeg({ quality: 50 })
      .toBuffer();
    const base64 = `data:image/jpeg;base64,${buf.toString("base64")}`;

    out.push({
      path: "/src/" + file.replace(/^src\//, ""), // matches Vite glob key style
      name: file.split("/").pop(),
      width: meta.width,
      height: meta.height,
      ratio: +(meta.width / meta.height).toFixed(6),
      placeholder: base64,
    });
  } catch (e) {
    console.warn("skip:", file, e?.message);
  }
}

await writeFile(OUT, JSON.stringify(out, null, 2));
console.log(`Wrote ${out.length} entries → ${OUT}`);
