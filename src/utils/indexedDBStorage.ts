import { get, set, del } from 'idb-keyval';

/**
 * Unlimited IndexedDB Storage Helper
 * Solves the 5MB localStorage limit using IndexedDB with persistent storage.
 */

// Request persistent storage from the browser so data is never evicted
if (typeof window !== 'undefined' && navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then((persistent) => {
    if (persistent) {
      console.log('[Storage] Armazenamento persistente ilimitado concedido pelo navegador!');
    } else {
      console.log('[Storage] Armazenamento IndexedDB ativo em modo padrão.');
    }
  }).catch((err) => {
    console.warn('[Storage] Erro ao solicitar armazenamento persistente:', err);
  });
}

/**
 * Returns estimated storage quota usage (in MB and GB)
 */
export async function getStorageQuotaEstimate(): Promise<{ usageMB: number; quotaGB: number }> {
  if (typeof window !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      const usageMB = Math.round(((estimate.usage || 0) / (1024 * 1024)) * 100) / 100;
      const quotaGB = Math.round(((estimate.quota || 0) / (1024 * 1024 * 1024)) * 100) / 100;
      return { usageMB, quotaGB };
    } catch (e) {
      console.error('Error estimating storage:', e);
    }
  }
  return { usageMB: 0, quotaGB: 0 };
}

export async function getIndexedDB<T>(key: string, defaultValue: T): Promise<T> {
  try {
    // 1. Read directly from IndexedDB (Unlimited Capacity)
    const val = await get<T>(key);
    if (val !== undefined && val !== null) {
      return val;
    }

    // 2. Legacy migration from localStorage (5MB) if first run
    const legacyVal = localStorage.getItem(key);
    if (legacyVal) {
      try {
        const parsed = JSON.parse(legacyVal) as T;
        await set(key, parsed);
        return parsed;
      } catch (e) {
        console.error(`Error parsing legacy key "${key}":`, e);
      }
    }
  } catch (error) {
    console.warn(`[IndexedDB] Error reading key "${key}":`, error);
  }
  return defaultValue;
}

export async function setIndexedDB<T>(key: string, value: T): Promise<void> {
  try {
    // Save to IndexedDB (No 5MB limit!)
    await set(key, value);
    
    // Attempt best-effort update to localStorage for legacy sync readers,
    // ignoring any 5MB QuotaExceededError if localStorage fills up.
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (quotaError) {
      // Ignored: IndexedDB is our primary unlimited storage engine
    }
  } catch (error) {
    console.error(`[IndexedDB] Error saving key "${key}":`, error);
  }
}

export async function removeIndexedDB(key: string): Promise<void> {
  try {
    await del(key);
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // ignore
    }
  } catch (error) {
    console.error(`[IndexedDB] Error deleting key "${key}":`, error);
  }
}

