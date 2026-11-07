import { sampleDreams } from '@/data/sample-dreams';
import { Dream } from '@/lib/dreams';
import { serializeTransfer } from '@/lib/transfer';
import { VaultFile } from '@/lib/vault';

// Browser preview only: invented dreams, kept in memory. The phone uses device.ts.

let vault: VaultFile | null = null;
let dreams: Dream[] = [];

export const randomBytes = (length: number) => crypto.getRandomValues(new Uint8Array(length));
export const newId = () => crypto.randomUUID();

export async function readVault(): Promise<VaultFile | null> {
  return vault;
}

export async function writeVault(next: VaultFile): Promise<void> {
  vault = next;
}

export async function openDatabase(_keyHex: string): Promise<Dream[]> {
  return [...dreams].sort((a, b) => b.date.localeCompare(a.date));
}

export async function closeDatabase(): Promise<void> {}

export async function insertDreams(items: Dream[]): Promise<void> {
  dreams = [...items, ...dreams];
}

export async function updateDreams(items: Dream[]): Promise<void> {
  dreams = dreams.map((dream) => items.find((item) => item.id === dream.id) ?? dream);
}

export async function removeDream(id: string): Promise<void> {
  dreams = dreams.filter((dream) => dream.id !== id);
}

export async function saveTextFile(_name: string, _mimeType: string, _content: string): Promise<boolean> {
  return true;
}

export async function pickTextFile(): Promise<{ name: string; content: string } | null> {
  return { name: 'ukazkove-sny.json', content: serializeTransfer(sampleDreams) };
}
