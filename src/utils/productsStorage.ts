import { Product } from '../types';
import { CATALOG_PRODUCTS } from '../data/products';
import { getIndexedDB, setIndexedDB, removeIndexedDB } from './indexedDBStorage';

const PRODUCTS_STORAGE_KEY = 'pedidos_impressao_catalog_products_v1';

const OBSOLETE_PRODUCT_NAMES = new Set([
  'tomate italiano',
  'tomate andréa / salada',
  'tomate andrea / salada',
  'tomate cereja (bandeja)',
  'cheiro verde (salsa e cebolinha)',
  'espinafre',
  'agrião',
  'agriao',
  'alface crespa',
  'batata monalisa / inglesa',
  'pera willians',
  'alface lisa',
  'banana caturra / nanica',
]);

function mergeCatalogWithStored(stored: Product[]): Product[] {
  // Filter out deprecated removed default items from previous cache
  const cleanedStored = stored.filter(
    (p) => !OBSOLETE_PRODUCT_NAMES.has(p.name.toLowerCase().trim())
  );

  const existingIds = new Set(cleanedStored.map((p) => p.id));
  const existingNames = new Set(cleanedStored.map((p) => p.name.toLowerCase().trim()));
  const missing = CATALOG_PRODUCTS.filter(
    (cp) => !existingIds.has(cp.id) && !existingNames.has(cp.name.toLowerCase().trim())
  );

  const result = [...cleanedStored, ...missing];
  if (cleanedStored.length !== stored.length || missing.length > 0) {
    saveStoredProductsAsync(result);
  }
  return result;
}

export async function loadStoredProductsAsync(): Promise<Product[]> {
  const products = await getIndexedDB<Product[]>(PRODUCTS_STORAGE_KEY, CATALOG_PRODUCTS);
  if (Array.isArray(products) && products.length > 0) {
    return mergeCatalogWithStored(products);
  }
  return CATALOG_PRODUCTS;
}

export async function saveStoredProductsAsync(products: Product[]): Promise<void> {
  await setIndexedDB(PRODUCTS_STORAGE_KEY, products);
}

export async function resetStoredProductsAsync(): Promise<Product[]> {
  await removeIndexedDB(PRODUCTS_STORAGE_KEY);
  return CATALOG_PRODUCTS;
}

// Synchronous fallbacks for fast initial renders
export function getStoredProducts(): Product[] {
  try {
    const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return mergeCatalogWithStored(parsed);
      }
    }
  } catch (e) {
    console.error('Error reading stored products:', e);
  }
  return CATALOG_PRODUCTS;
}

export function saveStoredProducts(products: Product[]): void {
  saveStoredProductsAsync(products);
}

export function resetStoredProducts(): Product[] {
  resetStoredProductsAsync();
  return CATALOG_PRODUCTS;
}

