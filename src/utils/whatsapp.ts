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

  lines.push(`📝 *LISTA DE PEDIDO DE PRODUTOS*`);
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
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

// Storage helpers
const ORDERS_LIST_STORAGE_KEY = 'pedidos_impressao_lists_v2';
const APP_SETTINGS_STORAGE_KEY = 'pedidos_impressao_settings_v2';

export const DEFAULT_APP_SETTINGS: AppSettings = {
  companyName: 'Hortifruti & Distribuidora de Produtos',
  whatsappNumber: '5511999998888',
  headerSubtitle: 'Montador de Lista para Separação e Impressão',
  printInstructions: 'Verifique os itens colhidos na lista e marque a caixa ao separar.',
};

export function getStoredAppSettings(): AppSettings {
  try {
    const saved = localStorage.getItem(APP_SETTINGS_STORAGE_KEY);
    if (saved) return { ...DEFAULT_APP_SETTINGS, ...JSON.parse(saved) };
  } catch (e) {
    console.error('Error reading settings:', e);
  }
  return DEFAULT_APP_SETTINGS;
}

export function saveAppSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
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
    const updated = [orderList, ...current].slice(0, 50);
    localStorage.setItem(ORDERS_LIST_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving order list history:', e);
  }
}
