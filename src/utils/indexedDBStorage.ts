import { get, set, del } from 'idb-keyval';

/**
 * Robust IndexedDB Storage Helper with localStorage Fallback & Migration
 */

export async function getIndexedDB<T>(key: string, defaultValue: T): Promise<T> {
  try {
    // 1. Try reading from IndexedDB
    const val = await get<T>(key);
    if (val !== undefined && val !== null) {
      return val;
    }

    // 2. Fallback / Migration from localStorage
    const legacyVal = localStorage.getItem(key);
    if (legacyVal) {
      const parsed = JSON.parse(legacyVal) as T;
      // Migrate to IndexedDB
      await set(key, parsed);
      return parsed;
    }
  } catch (error) {
    console.warn(`[IndexedDB] Error reading key "${key}", falling back to localStorage:`, error);
    try {
      const legacyVal = localStorage.getItem(key);
      if (legacyVal) return JSON.parse(legacyVal) as T;
    } catch (e) {
      console.error(`[localStorage] Error reading key "${key}":`, e);
    }
  }
  return defaultValue;
}

export async function setIndexedDB<T>(key: string, value: T): Promise<void> {
  try {
    // Save to IndexedDB
    await set(key, value);
    // Also update localStorage as a fallback copy
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // localStorage might quota exceed, which is why IndexedDB is superior
    }
  } catch (error) {
    console.error(`[IndexedDB] Error saving key "${key}":`, error);
    // Fallback to localStorage if IndexedDB fails
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`[localStorage] Fallback error saving key "${key}":`, e);
    }
  }
}

export async function removeIndexedDB(key: string): Promise<void> {
  try {
    await del(key);
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`[IndexedDB] Error deleting key "${key}":`, error);
    localStorage.removeItem(key);
  }
}
