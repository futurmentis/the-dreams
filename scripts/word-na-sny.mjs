// One-time conversion of the Word dream journal into the app's transfer file.
// Usage: node scripts/word-na-sny.mjs <file.docx> <output.json>
// Prints only counts, never the text of a dream.
import { readFileSync, writeFileSync } from "node:fs";
import { inflateRawSync } from "node:zlib";

const [source, target] = process.argv.slice(2);
const zip = readFileSync(source);
let eocd = zip.length - 22;
while (zip.readUInt32LE(eocd) !== 0x06054b50) eocd--;
let at = zip.readUInt32LE(eocd + 16);
let entry;
for (let i = 0, n = zip.readUInt16LE(eocd + 10); i < n; i++) {
  const nameLength = zip.readUInt16LE(at + 28);
  if (zip.toString("utf8", at + 46, at + 46 + nameLength) === "word/document.xml") {
    entry = { method: zip.readUInt16LE(at + 10), size: zip.readUInt32LE(at + 20), offset: zip.readUInt32LE(at + 42) };
  }
  at += 46 + nameLength + zip.readUInt16LE(at + 30) + zip.readUInt16LE(at + 32);
}
const start = entry.offset + 30 + zip.readUInt16LE(entry.offset + 26) + zip.readUInt16LE(entry.offset + 28);
const raw = zip.subarray(start, start + entry.size);
const xml = (entry.method === 8 ? inflateRawSync(raw) : raw).toString("utf8");

const unescape = (text) =>
  text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, "&");

const paragraphs = [...xml.matchAll(/<w:p(?: [^>]*)?>[\s\S]*?<\/w:p>/g)]
  .map(([p]) => ({
    text: [...p.matchAll(/<w:t(?: [^>]*)?>([^<]*)<\/w:t>|<w:br\/>|<w:tab\/>/g)]
      .map((m) => (m[1] !== undefined ? unescape(m[1]) : m[0] === "<w:br/>" ? "\n" : " "))
      .join("")
      .trim(),
    bold: /<w:b\/>|<w:b /.test(p),
  }))
  .filter((p) => p.text);

const dreams = [];
const problems = { noDate: 0, noText: 0, badDate: 0 };
let current = null;
const finish = () => {
  if (!current) return;
  if (!current.date) problems.noDate++;
  if (!current.parts.length) problems.noText++;
  dreams.push({ date: current.date, title: current.title, text: current.parts.join("\n\n"), themes: current.themes });
};

for (const p of paragraphs) {
  const heading = p.bold ? p.text.match(/^\d+\.\s+(.+)$/s) : null;
  if (heading) {
    finish();
    current = { title: heading[1], date: null, themes: [], parts: [] };
    continue;
  }
  if (!current) continue;
  const dateLine = current.date ? null : p.text.match(/^(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})(?:\s*•\s*Nálada:\s*(.+))?$/s);
  if (dateLine) {
    const [, day, month, year, mood] = dateLine;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    if (date.getMonth() !== Number(month) - 1) problems.badDate++;
    current.date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    if (mood) current.themes.push(mood.trim().toLowerCase());
    continue;
  }
  current.parts.push(p.text);
}
finish();

writeFileSync(target, JSON.stringify({ app: "the-dreams", version: 1, dreams }, null, 2));
console.log("dreams:", dreams.length, "with a theme:", dreams.filter((d) => d.themes.length).length, "problems:", JSON.stringify(problems));
