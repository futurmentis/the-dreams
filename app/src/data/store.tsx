import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';

import * as device from '@/data/device';
import { today } from '@/lib/dates';
import { Dream, DreamFilter, emptyFilter, isSameDream, sortNewestFirst } from '@/lib/dreams';
import { IncomingDream } from '@/lib/transfer';
import { bytesToHex, createVault, openWithCode, openWithPassword, VaultFile, withNewCode, withNewPassword } from '@/lib/vault';

export type DreamDraft = Omit<Dream, 'id'>;

/** New keys waiting until the recovery code has been written down. `dataKey` is set when the database should open afterwards. */
type Prepared = { vault: VaultFile; code: string; dataKey: Uint8Array | null };

const LOCK_AFTER_MS = 60_000;

const emptyDraft = (): DreamDraft => ({ date: today(), title: '', text: '', themes: [] });

type Store = {
  ready: boolean;
  hasPassword: boolean;
  unlocked: boolean;
  prepared: Prepared | null;
  unlock: (password: string) => Promise<boolean>;
  lock: () => Promise<void>;
  prepareNew: (password: string) => Promise<void>;
  prepareRestore: (code: string, password: string) => Promise<boolean>;
  prepareNewCode: (password: string) => Promise<boolean>;
  commitPrepared: () => Promise<void>;
  changePassword: (current: string, password: string) => Promise<boolean>;
  dreams: Dream[];
  addDream: (dream: DreamDraft) => Promise<string>;
  updateDream: (id: string, dream: DreamDraft) => Promise<void>;
  deleteDream: (id: string) => Promise<void>;
  addThemeTo: (ids: string[], theme: string) => Promise<void>;
  incoming: { name: string; dreams: IncomingDream[] } | null;
  setIncoming: (incoming: { name: string; dreams: IncomingDream[] } | null) => void;
  importDreams: (dreams: IncomingDream[]) => Promise<number>;
  word: string;
  setWord: (word: string) => void;
  filter: DreamFilter;
  setFilter: (filter: DreamFilter) => void;
  draft: DreamDraft;
  setDraft: (draft: DreamDraft) => void;
  clearDraft: () => void;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [vault, setVault] = useState<VaultFile | null>(null);
  const [prepared, setPrepared] = useState<Prepared | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [incoming, setIncoming] = useState<Store['incoming']>(null);
  const [word, setWord] = useState('');
  const [filter, setFilter] = useState<DreamFilter>(emptyFilter);
  const [draft, setDraft] = useState<DreamDraft>(emptyDraft);
  const leftAt = useRef<number | null>(null);

  useEffect(() => {
    device.readVault().then((stored) => {
      setVault(stored);
      setReady(true);
    });
  }, []);

  const value = useMemo<Store>(() => {
    const enter = async (dataKey: Uint8Array) => {
      setDreams(await device.openDatabase(bytesToHex(dataKey)));
      setUnlocked(true);
    };

    return {
      ready,
      hasPassword: vault !== null,
      unlocked,
      prepared,
      unlock: async (password) => {
        const dataKey = vault && (await openWithPassword(vault, password));
        if (!dataKey) return false;
        await enter(dataKey);
        return true;
      },
      lock: async () => {
        await device.closeDatabase();
        setUnlocked(false);
        setDreams([]);
        setIncoming(null);
        setWord('');
        setFilter(emptyFilter);
      },
      prepareNew: async (password) => {
        const created = await createVault(password, device.randomBytes);
        setPrepared({ vault: created.vault, code: created.code, dataKey: created.dataKey });
      },
      prepareRestore: async (code, password) => {
        const dataKey = vault && (await openWithCode(vault, code));
        if (!dataKey || !vault) return false;
        const renewed = await withNewPassword(vault, dataKey, password, device.randomBytes);
        const coded = await withNewCode(renewed, dataKey, device.randomBytes);
        setPrepared({ vault: coded.vault, code: coded.code, dataKey });
        return true;
      },
      prepareNewCode: async (password) => {
        const dataKey = vault && (await openWithPassword(vault, password));
        if (!dataKey || !vault) return false;
        const coded = await withNewCode(vault, dataKey, device.randomBytes);
        setPrepared({ vault: coded.vault, code: coded.code, dataKey: null });
        return true;
      },
      commitPrepared: async () => {
        if (!prepared) return;
        await device.writeVault(prepared.vault);
        setVault(prepared.vault);
        if (prepared.dataKey) await enter(prepared.dataKey);
        setPrepared(null);
      },
      changePassword: async (current, password) => {
        const dataKey = vault && (await openWithPassword(vault, current));
        if (!dataKey || !vault) return false;
        const renewed = await withNewPassword(vault, dataKey, password, device.randomBytes);
        await device.writeVault(renewed);
        setVault(renewed);
        return true;
      },
      dreams,
      addDream: async (dream) => {
        const saved = { ...dream, id: device.newId() };
        await device.insertDreams([saved]);
        setDreams((current) => sortNewestFirst([saved, ...current]));
        return saved.id;
      },
      updateDream: async (id, dream) => {
        const saved = { ...dream, id };
        await device.updateDreams([saved]);
        setDreams((current) => sortNewestFirst(current.map((item) => (item.id === id ? saved : item))));
      },
      deleteDream: async (id) => {
        await device.removeDream(id);
        setDreams((current) => current.filter((item) => item.id !== id));
      },
      addThemeTo: async (ids, theme) => {
        const changed = dreams
          .filter((item) => ids.includes(item.id) && !item.themes.includes(theme))
          .map((item) => ({ ...item, themes: [...item.themes, theme] }));
        await device.updateDreams(changed);
        setDreams((current) => current.map((item) => changed.find((next) => next.id === item.id) ?? item));
      },
      incoming,
      setIncoming,
      importDreams: async (items) => {
        const fresh = items
          .filter((item) => !dreams.some((existing) => isSameDream(existing, item)))
          .map((item) => ({ ...item, id: device.newId() }));
        await device.insertDreams(fresh);
        setDreams((current) => sortNewestFirst([...fresh, ...current]));
        return fresh.length;
      },
      word,
      setWord,
      filter,
      setFilter,
      draft,
      setDraft,
      clearDraft: () => setDraft(emptyDraft()),
    };
  }, [ready, vault, unlocked, prepared, dreams, incoming, word, filter, draft]);

  // Locks when the app comes back after being away for a while. The draft stays, so nothing written is lost.
  const lock = value.lock;
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'background') {
        leftAt.current = Date.now();
      } else if (state === 'active') {
        if (leftAt.current !== null && Date.now() - leftAt.current >= LOCK_AFTER_MS && unlocked) lock();
        leftAt.current = null;
      }
    });
    return () => subscription.remove();
  }, [lock, unlocked]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore needs StoreProvider');
  return store;
}
