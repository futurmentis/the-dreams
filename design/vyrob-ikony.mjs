// Draws the crescent moon as PNG files for the app icon and splash. Usage: node design/vyrob-ikony.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const out = new URL("../app/assets/images/", import.meta.url);
mkdirSync(out, { recursive: true });
const gold = [0xe2, 0xbd, 0x7a], night = [0x12, 0x14, 0x1f], white = [255, 255, 255];

function crc32(buf) {
  let c, crc = ~0;
  for (const b of buf) { c = (crc ^ b) & 255; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crc = (crc >>> 8) ^ c; }
  return ~crc >>> 0;
}
function chunk(type, data) {
  const body = Buffer.concat([Buffer.from(type), data]);
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function png(size, pixels) {
  const head = Buffer.alloc(13); head.writeUInt32BE(size, 0); head.writeUInt32BE(size, 4); head[8] = 8; head[9] = 6;
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) pixels.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", head), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}
function inMoon(x, y, r) {
  const a = x * x + y * y <= r * r;
  const bx = x - 0.42 * r, by = y + 0.26 * r, br = 0.8 * r;
  return a && bx * bx + by * by > br * br;
}
function draw(name, size, scale, fg, bg) {
  const px = Buffer.alloc(size * size * 4), r = (size * scale) / 2, S = 4;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    let hit = 0;
    for (let i = 0; i < S; i++) for (let j = 0; j < S; j++) {
      if (inMoon(x + (i + 0.5) / S - size / 2 + r * 0.08, y + (j + 0.5) / S - size / 2, r)) hit++;
    }
    const t = hit / (S * S), o = (y * size + x) * 4;
    const c = bg ? bg.map((v, k) => Math.round(v + (fg[k] - v) * t)) : fg;
    px[o] = c[0]; px[o + 1] = c[1]; px[o + 2] = c[2]; px[o + 3] = bg ? 255 : Math.round(t * 255);
  }
  writeFileSync(new URL(name, out), png(size, px));
}
draw("icon.png", 1024, 0.56, gold, night);
draw("android-icon-foreground.png", 1024, 0.46, gold, null);
draw("android-icon-monochrome.png", 1024, 0.46, white, null);
draw("splash-icon.png", 512, 0.8, gold, null);
draw("favicon.png", 48, 0.7, gold, night);
