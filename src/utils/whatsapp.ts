import { OrderListItem, CustomerDetails, SavedOrderList, AppSettings } from '../types';

export function formatQuantityStr(qty: number | string, unit: string): string {
  if (typeof qty === 'string') return `${qty} ${unit}`.trim();
  if (unit === 'kg') {
    if (qty < 1) return `${Math.round(qty * 1000)}g`;
    return `${qty.toString().replace('.', ',')} kg`;
  }
  if (unit === 'maço' || unit === 'maços') {
    return `${qty} maço${qty > 1 ? 's' : ''}`;
  }
  if (unit === 'unid' || unit === 'unidades') {
    return `${qty} unid${qty > 1 ? 's' : ''}`;
  }
  if (unit === 'dz' || unit === 'dúzia') {
    return `${qty} dúzia${qty > 1 ? 's' : ''}`;
  }
  return `${qty} ${unit}`;
}

export function generateWhatsAppOrderList(
  customerDetails: CustomerDetails,
  items: OrderListItem[],
  companyName: string
): string {
  const lines: string[] = [];

  lines.push(`📝 *LISTA DE PEDIDOS*`);
  if (companyName) {
    lines.push(`🏢 *Para:* ${companyName.toUpperCase()}`);
  }
  lines.push(`📅 *Data do Pedido:* ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`);
  lines.push(`─────────────────────────`);
  lines.push(`👤 *Cliente:* ${customerDetails.name || 'Não informado'}`);
  lines.push(`📱 *Telefone/Zap:* ${customerDetails.phone || 'Não informado'}`);
  if (customerDetails.deliveryType === 'delivery') {
    lines.push(`🚚 *Tipo:* Entrega em Domicílio`);
    if (customerDetails.address) {
      lines.push(`📍 *Endereço:* ${customerDetails.address}`);
    }
  } else {
    lines.push(`🏬 *Tipo:* Retirada no Local`);
  }
  if (customerDetails.deliveryDate) {
    lines.push(`⏰ *Data/Horário Desejado:* ${customerDetails.deliveryDate}`);
  }
  lines.push(`─────────────────────────`);

  lines.push(`📋 *PRODUTOS DA LISTA (${items.length} ITENS):*`);
  items.forEach((item, idx) => {
    const qtyFormatted = formatQuantityStr(item.quantity, item.unit);
    lines.push(`${idx + 1}. *${item.name}* — ${qtyFormatted}`);
    if (item.note && item.note.trim() !== '') {
      lines.push(`   └ 💬 *Obs:* _"${item.note.trim()}"_`);
    }
  });

  if (customerDetails.generalNotes && customerDetails.generalNotes.trim() !== '') {
    lines.push(`─────────────────────────`);
    lines.push(`📝 *OBSERVAÇÕES GERAIS:*`);
    lines.push(`_${customerDetails.generalNotes.trim()}_`);
  }

  lines.push(`─────────────────────────`);
  lines.push(`Pedido enviado para separação e impressão. Obrigado! 🙏`);

  return lines.join('\n');
}

export function getWhatsAppUrl(phone: string, text: string): string {
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 10 || cleanPhone.length === 11) {
    cleanPhone = `55${cleanPhone}`;
  }
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

import { getIndexedDB, setIndexedDB } from './indexedDBStorage';

// Storage helpers
const ORDERS_LIST_STORAGE_KEY = 'pedidos_impressao_lists_v2';
const APP_SETTINGS_STORAGE_KEY = 'pedidos_impressao_settings_v2';
const DRAFT_ITEMS_STORAGE_KEY = 'pedidos_impressao_draft_items_v2';
const DRAFT_CUSTOMER_STORAGE_KEY = 'pedidos_impressao_draft_customer_v2';

export async function getStoredDraftItemsAsync(): Promise<OrderListItem[]> {
  return await getIndexedDB<OrderListItem[]>(DRAFT_ITEMS_STORAGE_KEY, []);
}

export function getStoredDraftItems(): OrderListItem[] {
  try {
    const saved = localStorage.getItem(DRAFT_ITEMS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading draft items:', e);
  }
  return [];
}

export function saveDraftItems(items: OrderListItem[]): void {
  setIndexedDB(DRAFT_ITEMS_STORAGE_KEY, items);
}

export async function getStoredDraftCustomerAsync(): Promise<CustomerDetails> {
  const defaultCustomer: CustomerDetails = {
    name: '',
    phone: '',
    deliveryType: 'delivery',
    address: '',
    deliveryDate: '',
    generalNotes: '',
  };
  return await getIndexedDB<CustomerDetails>(DRAFT_CUSTOMER_STORAGE_KEY, defaultCustomer);
}

export function getStoredDraftCustomer(): CustomerDetails {
  try {
    const saved = localStorage.getItem(DRAFT_CUSTOMER_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading draft customer:', e);
  }
  return {
    name: '',
    phone: '',
    deliveryType: 'delivery',
    address: '',
    deliveryDate: '',
    generalNotes: '',
  };
}

export function saveDraftCustomer(customer: CustomerDetails): void {
  setIndexedDB(DRAFT_CUSTOMER_STORAGE_KEY, customer);
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  companyName: 'Hortifruti & Distribuidora de Produtos',
  whatsappNumber: '5549999501606',
  headerSubtitle: 'Montador de Lista para Separação e Impressão',
  printInstructions: 'Verifique os itens colhidos na lista e marque a caixa ao separar.',
};

export async function getStoredAppSettingsAsync(): Promise<AppSettings> {
  const parsed = await getIndexedDB<AppSettings>(APP_SETTINGS_STORAGE_KEY, DEFAULT_APP_SETTINGS);
  if (parsed.whatsappNumber === '5511999998888' || parsed.whatsappNumber === '5549998043552' || !parsed.whatsappNumber) {
    parsed.whatsappNumber = '5549999501606';
  }
  return { ...DEFAULT_APP_SETTINGS, ...parsed };
}

export function getStoredAppSettings(): AppSettings {
  try {
    const saved = localStorage.getItem(APP_SETTINGS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.whatsappNumber === '5511999998888' || parsed.whatsappNumber === '5549998043552' || !parsed.whatsappNumber) {
        parsed.whatsappNumber = '5549999501606';
      }
      return { ...DEFAULT_APP_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Error reading settings:', e);
  }
  return DEFAULT_APP_SETTINGS;
}

export function saveAppSettings(settings: AppSettings): void {
  setIndexedDB(APP_SETTINGS_STORAGE_KEY, settings);
}

export async function getStoredOrderListsAsync(): Promise<SavedOrderList[]> {
  return await getIndexedDB<SavedOrderList[]>(ORDERS_LIST_STORAGE_KEY, []);
}

export function getStoredOrderLists(): SavedOrderList[] {
  try {
    const saved = localStorage.getItem(ORDERS_LIST_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading order lists:', e);
  }
  return [];
}

export function saveOrderListToHistory(orderList: SavedOrderList): void {
  try {
    const current = getStoredOrderLists();
    const updated = [orderList, ...current];
    setIndexedDB(ORDERS_LIST_STORAGE_KEY, updated);
  } catch (e) {
    console.error('Error saving order list history:', e);
  }
}

