// Logic checks without a phone: node tests/logic.test.mjs
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const src = new URL("../src/", import.meta.url);
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith("@/")) specifier = new URL(`${specifier.slice(2)}.ts`, src).href;
    return next(specifier, context);
  },
});

const vault = await import("../src/lib/vault.ts");
const transfer = await import("../src/lib/transfer.ts");
const { isSameDream } = await import("../src/lib/dreams.ts");
const random = (n) => new Uint8Array(randomBytes(n));

test("password and recovery code both open the same key", async () => {
  const { vault: v, dataKey, code } = await vault.createVault("heslo-123", random);
  assert.deepEqual(await vault.openWithPassword(v, "heslo-123"), dataKey);
  assert.deepEqual(await vault.openWithCode(v, code.toLowerCase().replaceAll(" ", "")), dataKey);
  assert.match(code, /^([A-Z2-9]{4} ){5}[A-Z2-9]{4}$/);
});

test("wrong secrets open nothing", async () => {
  const { vault: v } = await vault.createVault("heslo-123", random);
  assert.equal(await vault.openWithPassword(v, "ine-heslo"), null);
  assert.equal(await vault.openWithCode(v, "AAAA AAAA AAAA AAAA AAAA AAAA"), null);
});

test("new password keeps the key and retires the old password", async () => {
  const { vault: v, dataKey } = await vault.createVault("stare-heslo", random);
  const next = await vault.withNewPassword(v, dataKey, "nove-heslo", random);
  assert.deepEqual(await vault.openWithPassword(next, "nove-heslo"), dataKey);
  assert.equal(await vault.openWithPassword(next, "stare-heslo"), null);
});

test("new code retires the old code", async () => {
  const { vault: v, dataKey, code } = await vault.createVault("heslo-123", random);
  const next = await vault.withNewCode(v, dataKey, random);
  assert.deepEqual(await vault.openWithCode(next.vault, next.code), dataKey);
  assert.equal(await vault.openWithCode(next.vault, code), null);
});

const dream = { id: "1", date: "2026-11-07", title: "Vlak", text: "Vymyslený sen.", themes: ["voda"] };

test("transfer file survives a round trip", () => {
  assert.deepEqual(transfer.parseTransfer(transfer.serializeTransfer([dream])), [
    { date: dream.date, title: dream.title, text: dream.text, themes: dream.themes },
  ]);
});

test("foreign and broken files are refused", () => {
  for (const bad of ["", "nie json", "{}", '{"app":"the-dreams","version":1,"dreams":[{"date":"7.11."}]}', '{"app":"ine","version":1,"dreams":[]}']) {
    assert.equal(transfer.parseTransfer(bad), null);
  }
});

test("markdown lists dreams oldest first with their themes", () => {
  const older = { ...dream, id: "2", date: "2026-11-01", title: "Dom", themes: [] };
  const text = transfer.buildMarkdown([dream, older], "2026-11");
  assert.ok(text.startsWith("# the Dreams: November 2026"));
  assert.ok(text.indexOf("## Dom") < text.indexOf("## Vlak"));
  assert.ok(text.includes("Témy: voda"));
});

test("same date, title and text count as the same dream", () => {
  assert.ok(isSameDream(dream, { ...dream, id: "9", themes: [] }));
  assert.ok(!isSameDream(dream, { ...dream, text: "Iný." }));
});

test("the converted transfer file is accepted, when present", () => {
  const path = fileURLToPath(new URL("../../output/the-dreams-moje-sny.json", import.meta.url));
  if (!existsSync(path)) return;
  const parsed = transfer.parseTransfer(readFileSync(path, "utf8"));
  assert.ok(parsed && parsed.length > 0);
  assert.ok(parsed.every((item) => item.text && item.title));
});
