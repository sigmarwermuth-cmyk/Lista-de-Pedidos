export type ProductCategory = 
  | 'todos'
  | 'frutas'
  | 'verduras'
  | 'legumes'
  | 'laticinios'
  | 'acougue'
  | 'bebidas'
  | 'mercearia'
  | 'limpeza';

export type UnitType = 'kg' | 'g' | 'unid' | 'maço' | 'dz' | 'pct' | 'L' | 'caixa';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  unit: UnitType;
  step: number;
  minQty: number;
  description?: string;
  image?: string;
  icon?: string;
}

export interface OrderListItem {
  id: string; // product id or custom item id
  name: string;
  category: string;
  quantity: number | string; // e.g. 2, 1.5 or "2 kg", "1 maço"
  unit: string;
  note?: string;
  isCustom?: boolean;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  deliveryType: 'delivery' | 'pickup';
  address: string;
  deliveryDate: string;
  generalNotes: string;
}

export interface SavedOrderList {
  id: string;
  createdAt: string;
  customerDetails: CustomerDetails;
  items: OrderListItem[];
}

export interface AppSettings {
  companyName: string;
  whatsappNumber: string; // number to send to if WhatsApp button used
  headerSubtitle: string;
  printInstructions: string;
}
