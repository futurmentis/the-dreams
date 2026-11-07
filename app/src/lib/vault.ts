import { xchacha20poly1305 } from '@noble/ciphers/chacha.js';
import { scryptAsync } from '@noble/hashes/scrypt.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';

// The database has one random key. That key is stored twice, each copy locked:
// once by the password and once by the recovery code. Neither secret is ever stored.

export type Random = (length: number) => Uint8Array;

type Box = { salt: string; nonce: string; data: string };
export type VaultFile = { version: 1; password: Box; recovery: Box };

const KDF = { N: 2 ** 14, r: 8, p: 1, dkLen: 32 };
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 24;

async function deriveKey(secret: string, salt: Uint8Array): Promise<Uint8Array> {
  return scryptAsync(secret.normalize('NFKC'), salt, KDF);
}

async function seal(secret: string, dataKey: Uint8Array, random: Random): Promise<Box> {
  const salt = random(16);
  const nonce = random(24);
  const key = await deriveKey(secret, salt);
  const data = xchacha20poly1305(key, nonce).encrypt(dataKey);
  return { salt: bytesToHex(salt), nonce: bytesToHex(nonce), data: bytesToHex(data) };
}

async function open(secret: string, box: Box): Promise<Uint8Array | null> {
  const key = await deriveKey(secret, hexToBytes(box.salt));
  try {
    return xchacha20poly1305(key, hexToBytes(box.nonce)).decrypt(hexToBytes(box.data));
  } catch {
    return null;
  }
}

function createRecoveryCode(random: Random): string {
  const letters = [...random(CODE_LENGTH)].map((byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]);
  return letters.join('').replace(/(.{4})(?=.)/g, '$1 ');
}

/** Paper codes are typed by hand, so spaces and small letters do not matter. */
function cleanCode(code: string): string {
  return code.replace(/\s/g, '').toUpperCase();
}

export async function createVault(password: string, random: Random) {
  const dataKey = random(32);
  const code = createRecoveryCode(random);
  const vault: VaultFile = {
    version: 1,
    password: await seal(password, dataKey, random),
    recovery: await seal(cleanCode(code), dataKey, random),
  };
  return { vault, dataKey, code };
}

export function openWithPassword(vault: VaultFile, password: string): Promise<Uint8Array | null> {
  return open(password, vault.password);
}

export function openWithCode(vault: VaultFile, code: string): Promise<Uint8Array | null> {
  return open(cleanCode(code), vault.recovery);
}

export async function withNewPassword(vault: VaultFile, dataKey: Uint8Array, password: string, random: Random): Promise<VaultFile> {
  return { ...vault, password: await seal(password, dataKey, random) };
}

export async function withNewCode(vault: VaultFile, dataKey: Uint8Array, random: Random) {
  const code = createRecoveryCode(random);
  return { vault: { ...vault, recovery: await seal(cleanCode(code), dataKey, random) }, code };
}

export { bytesToHex };
