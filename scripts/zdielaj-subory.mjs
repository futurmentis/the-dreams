// Offers files to a phone on the same Wi-Fi, for a short time.
// Usage: node scripts/zdielaj-subory.mjs <file> [<file> ...]
// The address contains a random code, and the server stops after all downloads or after 20 minutes.
import { randomBytes } from "node:crypto";
import { createSocket } from "node:dgram";
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { basename } from "node:path";

const PORT = 19020;
const LIFETIME_MS = 20 * 60 * 1000;
const files = process.argv.slice(2).map((path) => ({
  path,
  type: path.endsWith(".apk") ? "application/vnd.android.package-archive" : "application/json",
  label: path.endsWith(".apk") ? "Aplikácia (APK)" : basename(path),
}));

// Asks the system which address faces the local network. Nothing is sent.
const socket = createSocket("udp4");
socket.connect(53, "192.0.2.1", () => {
  const ip = socket.address().address;
  socket.close();
  start(ip);
});

function start(ip) {
  const code = randomBytes(12).toString("hex");
  const done = new Set();
  const stop = (reason) => {
    console.log(reason);
    process.exit(0);
  };
  const page = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>the Dreams</title>
<body style="margin:0;padding:24px;background:#12141F;color:#ECE6D8;font:18px sans-serif"><h1 style="font-size:28px">the Dreams</h1>
${files.map((file) => `<p><a style="display:block;padding:18px;border-radius:12px;background:#E2BD7A;color:#1B1608;text-decoration:none;font-weight:600;text-align:center" href="/${code}/${basename(file.path)}">${file.label}</a></p>`).join("")}</body>`;

  const server = createServer((request, response) => {
    const path = new URL(request.url, "http://x").pathname;
    if (path === `/${code}/`) return response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }).end(page);
    const file = files.find((item) => path === `/${code}/${basename(item.path)}`);
    if (!file) return response.writeHead(404).end();
    response.writeHead(200, {
      "Content-Type": file.type,
      "Content-Length": statSync(file.path).size,
      "Content-Disposition": `attachment; filename="${basename(file.path)}"`,
      "Cache-Control": "no-store",
    });
    response.on("finish", () => {
      done.add(file.path);
      console.log("downloaded:", file.label);
      if (done.size === files.length) setTimeout(() => stop("all files downloaded, server stopped"), 3000);
    });
    createReadStream(file.path).pipe(response);
  });

  server.listen(PORT, ip, () => console.log(`open: http://${ip}:${PORT}/${code}/`));
  setTimeout(() => stop("time is up, server stopped"), LIFETIME_MS);
}
