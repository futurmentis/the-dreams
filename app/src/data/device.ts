import * as Crypto from 'expo-crypto';
import { Directory, File, Paths } from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

import { Dream } from '@/lib/dreams';
import { VaultFile } from '@/lib/vault';

// Everything that touches the phone itself. The web preview uses device.web.ts instead.

const DATABASE = 'dreams.db';
const vaultFile = () => new File(Paths.document, 'vault.json');
const newVaultFile = () => new File(Paths.document, 'vault.new.json');

let database: SQLite.SQLiteDatabase | null = null;

const db = () => {
  if (!database) throw new Error('The database is closed.');
  return database;
};

export const randomBytes = (length: number) => Crypto.getRandomBytes(length);
export const newId = () => Crypto.randomUUID();

export async function readVault(): Promise<VaultFile | null> {
  const file = [vaultFile(), newVaultFile()].find((item) => item.exists);
  return file ? JSON.parse(await file.text()) : null;
}

/** The new file is complete before the old one goes away, so a dead battery cannot lose the key. */
export async function writeVault(vault: VaultFile): Promise<void> {
  const next = newVaultFile();
  if (next.exists) next.delete();
  next.create();
  next.write(JSON.stringify(vault));
  const current = vaultFile();
  if (current.exists) current.delete();
  next.move(current);
}

export async function openDatabase(keyHex: string): Promise<Dream[]> {
  database = await SQLite.openDatabaseAsync(DATABASE);
  await database.execAsync(`PRAGMA key = "x'${keyHex}'";`);
  // Without SQLCipher the key above would be silently ignored, so refuse to continue.
  const cipher = await database.getFirstAsync<{ cipher_version: string }>('PRAGMA cipher_version');
  if (!cipher?.cipher_version) throw new Error('The database is not encrypted.');
  await database.execAsync(
    'CREATE TABLE IF NOT EXISTS dreams (id TEXT PRIMARY KEY NOT NULL, date TEXT NOT NULL, title TEXT NOT NULL, text TEXT NOT NULL, themes TEXT NOT NULL);',
  );
  const rows = await database.getAllAsync<Omit<Dream, 'themes'> & { themes: string }>('SELECT * FROM dreams ORDER BY date DESC, id DESC');
  return rows.map((row) => ({ ...row, themes: JSON.parse(row.themes) }));
}

export async function closeDatabase(): Promise<void> {
  await database?.closeAsync();
  database = null;
}

export async function insertDreams(dreams: Dream[]): Promise<void> {
  await db().withTransactionAsync(async () => {
    for (const dream of dreams) {
      await db().runAsync('INSERT INTO dreams (id, date, title, text, themes) VALUES (?, ?, ?, ?, ?)', dream.id, dream.date, dream.title, dream.text, JSON.stringify(dream.themes));
    }
  });
}

export async function updateDreams(dreams: Dream[]): Promise<void> {
  await db().withTransactionAsync(async () => {
    for (const dream of dreams) {
      await db().runAsync('UPDATE dreams SET date = ?, title = ?, text = ?, themes = ? WHERE id = ?', dream.date, dream.title, dream.text, JSON.stringify(dream.themes), dream.id);
    }
  });
}

export async function removeDream(id: string): Promise<void> {
  await db().runAsync('DELETE FROM dreams WHERE id = ?', id);
}

/** Asks for a folder and saves the file there. False when the person cancelled. */
export async function saveTextFile(name: string, mimeType: string, content: string): Promise<boolean> {
  let folder: Directory;
  try {
    folder = await Directory.pickDirectoryAsync();
  } catch {
    return false;
  }
  folder.createFile(name, mimeType).write(content);
  return true;
}

/** Asks for a file and returns its name and text, or null when the person cancelled. */
export async function pickTextFile(): Promise<{ name: string; content: string } | null> {
  const picked = await File.pickFileAsync();
  if (picked.canceled) return null;
  return { name: picked.result.name, content: await picked.result.text() };
}
