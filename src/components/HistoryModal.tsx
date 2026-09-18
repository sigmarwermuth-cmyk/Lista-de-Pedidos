import React from 'react';
import { X, History, Printer, Send, Calendar, CheckCircle } from 'lucide-react';
import { SavedOrderList } from '../types';
import { formatQuantityStr, generateWhatsAppOrderList, getWhatsAppUrl } from '../utils/whatsapp';

interface HistoryModalProps {
  isOpen: boolean;
  lists: SavedOrderList[];
  onClose: () => void;
  onLoadList: (list: SavedOrderList) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  lists,
  onClose,
  onLoadList,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in print:hidden">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] border border-slate-200 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <History className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="font-bold text-lg leading-tight">Histórico de Pedidos Salvos</h2>
              <p className="text-xs text-slate-300">
                Listas geradas e salvas neste navegador
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* List Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          {lists.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <History className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-bold text-slate-700">Nenhum histórico encontrado</p>
              <p className="text-xs text-slate-400">
                Sua lista de compras/pedidos será gravada aqui quando você imprimir ou enviar via WhatsApp.
              </p>
            </div>
          ) : (
            lists.map((order) => (
              <div
                key={order.id}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900">
                    Cliente: {order.customerDetails.name || 'Não informado'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')} {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="text-xs text-slate-700 font-medium">
                  {order.items.length} itens: {order.items.slice(0, 4).map(i => i.name).join(', ')}
                  {order.items.length > 4 && '...'}
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      onLoadList(order);
                      onClose();
                    }}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
                  >
                    Carregar Esta Lista na Tela
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
