import React from 'react';
import { 
  Printer, 
  Trash2, 
  Plus, 
  Minus, 
  FileText, 
  User
} from 'lucide-react';
import { CustomerDetails, OrderListItem, AppSettings } from '../types';
import { formatQuantityStr } from '../utils/whatsapp';

interface OrderListSidebarProps {
  items: OrderListItem[];
  customerDetails: CustomerDetails;
  setCustomerDetails: (details: CustomerDetails) => void;
  appSettings: AppSettings;
  onUpdateQuantity: (id: string, delta: number) => void;
  onSetQuantity?: (id: string, newQty: number | string) => void;
  onUpdateUnit?: (id: string, newUnit: string) => void;
  onRemoveItem: (id: string) => void;
  onClearList: () => void;
  onOpenPrintModal: () => void;
}

export const OrderListSidebar: React.FC<OrderListSidebarProps> = ({
  items,
  customerDetails,
  setCustomerDetails,
  appSettings,
  onUpdateQuantity,
  onSetQuantity,
  onUpdateUnit,
  onRemoveItem,
  onClearList,
  onOpenPrintModal,
}) => {

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between print:hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-[#001b69] text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FileText className="w-6 h-6 text-[#f1b500]" />
          <div>
            <h2 className="font-bold text-lg leading-tight">Lista Atual de Pedido</h2>
            <p className="text-xs text-sky-200 font-medium">
              {items.length} {items.length === 1 ? 'item adicionado' : 'itens adicionados'}
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={onClearList}
            className="text-xs text-sky-200 hover:text-red-300 font-medium underline px-2 py-1"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 space-y-5 overflow-y-auto max-h-[calc(100vh-220px)]">
        {/* Customer Details Form */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#008d36]" />
            Dados do Cliente / Pedido
          </h3>

          <div>
            <input
              type="text"
              value={customerDetails.name}
              onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
              placeholder="Nome do Cliente (ex: João Silva)"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#008d36]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="tel"
              value={customerDetails.phone}
              onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
              placeholder="WhatsApp / Fone"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#008d36]"
            />

            <select
              value={customerDetails.deliveryType}
              onChange={(e) => setCustomerDetails({ ...customerDetails, deliveryType: e.target.value as any })}
              className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#008d36]"
            >
              <option value="delivery">🚚 Entrega</option>
              <option value="pickup">🏬 Retirada</option>
            </select>
          </div>

          {customerDetails.deliveryType === 'delivery' && (
            <div>
              <input
                type="text"
                value={customerDetails.address}
                onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                placeholder="Endereço (Rua, Nº, Bairro)"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#008d36]"
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-2">
            <input
              type="text"
              value={customerDetails.deliveryDate}
              onChange={(e) => setCustomerDetails({ ...customerDetails, deliveryDate: e.target.value })}
              placeholder="Data/Horário (ex: Hoje às 15h)"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#008d36]"
            />
          </div>
        </div>

        {/* Selected Items List */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
            Itens Selecionados ({items.length})
          </h3>

          {items.length === 0 ? (
            <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl p-4">
              <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-xs text-slate-600">Sua lista está vazia</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Clique nos produtos do catálogo ao lado para ir montando sua lista de pedido!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex items-center justify-between gap-2 overflow-hidden animate-fade-in"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-xs text-slate-900">
                        {idx + 1}. {item.name}
                      </span>
                      {item.barcode && (
                        <span className="font-mono text-[9px] bg-slate-100 border border-slate-200 px-1 py-0.2 rounded font-semibold text-slate-700">
                          [{item.barcode}]
                        </span>
                      )}
                      {item.isCustom && (
                        <span className="px-1.5 py-0.2 text-[9px] bg-amber-100 text-amber-800 rounded font-bold">
                          Personalizado
                        </span>
                      )}
                    </div>
                    
                    {/* Unit Switcher (kg / un) */}
                    <div className="flex items-center gap-1 mt-1">
                      <div className="inline-flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                        <button
                          type="button"
                          onClick={() => onUpdateUnit && onUpdateUnit(item.id, 'kg')}
                          className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase transition ${
                            item.unit === 'kg' ? 'bg-[#001b69] text-white' : 'text-slate-500 hover:text-slate-900'
                          }`}
                          title="Unidade kg"
                        >
                          kg
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateUnit && onUpdateUnit(item.id, 'unid')}
                          className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase transition ${
                            item.unit === 'unid' ? 'bg-[#001b69] text-white' : 'text-slate-500 hover:text-slate-900'
                          }`}
                          title="Unidade un"
                        >
                          un
                        </button>
                      </div>
                    </div>

                    {item.note && (
                      <span className="text-[11px] text-slate-500 block truncate italic mt-0.5">
                        Obs: "{item.note}"
                      </span>
                    )}
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold text-xs shrink-0 active:scale-90 transition"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          if (onSetQuantity) onSetQuantity(item.id, '');
                        } else {
                          const parsed = parseFloat(val.replace(',', '.'));
                          if (!isNaN(parsed) && onSetQuantity) {
                            onSetQuantity(item.id, parsed);
                          }
                        }
                      }}
                      onBlur={(e) => {
                        const parsed = parseFloat(e.target.value.replace(',', '.'));
                        if (isNaN(parsed) || parsed <= 0) {
                          onRemoveItem(item.id);
                        }
                      }}
                      className="w-14 py-0.5 px-1 bg-slate-50 border border-slate-300 focus:border-[#001b69] focus:bg-white rounded font-extrabold text-xs text-[#001b69] text-center focus:outline-none focus:ring-1 focus:ring-[#001b69]"
                    />

                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded bg-[#001b69] text-white hover:bg-[#00134f] flex items-center justify-center font-bold text-xs shrink-0 active:scale-90 transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded active:scale-90 transition"
                      title="Remover item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions Footer */}
      {items.length > 0 && (
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onOpenPrintModal}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#008d36] hover:bg-[#00732d] text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 active:scale-98"
          >
            <Printer className="w-5 h-5" />
            <span>GERAR PDF / IMPRIMIR FICHA 📄</span>
          </button>
        </div>
      )}
    </div>
  );
};
