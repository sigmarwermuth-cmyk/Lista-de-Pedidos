import { Product } from '../types';
import { CATALOG_PRODUCTS } from '../data/products';
import { getIndexedDB, setIndexedDB, removeIndexedDB } from './indexedDBStorage';

const PRODUCTS_STORAGE_KEY = 'pedidos_impressao_catalog_products_v1';

export async function loadStoredProductsAsync(): Promise<Product[]> {
  const products = await getIndexedDB<Product[]>(PRODUCTS_STORAGE_KEY, CATALOG_PRODUCTS);
  if (Array.isArray(products) && products.length > 0) {
    return products;
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
        return parsed;
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

