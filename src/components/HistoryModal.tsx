import React, { useState } from 'react';
import { X, History, Calendar, Trash2 } from 'lucide-react';
import { SavedOrderList } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  lists: SavedOrderList[];
  onClose: () => void;
  onLoadList: (list: SavedOrderList) => void;
  onDeleteList: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  lists,
  onClose,
  onLoadList,
  onDeleteList,
  onClearAll,
}) => {
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs print:hidden animate-fade-in"
    >
      <div 
        className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] border border-slate-200 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#001b69] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <History className="w-6 h-6 text-[#f1b500]" />
            <div>
              <h2 className="font-bold text-lg leading-tight">Histórico de Pedidos Salvos</h2>
              <p className="text-xs text-sky-200">
                {lists.length} {lists.length === 1 ? 'pedido salvo' : 'pedidos salvos'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {lists.length > 0 && (
              <button
                onClick={() => setConfirmClearAll(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-200 hover:bg-red-500 hover:text-white rounded-xl text-xs font-semibold transition active:scale-95"
                title="Limpar Todo o Histórico"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Limpar Tudo
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#001248] text-white transition active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Confirmation Banner for Clear All */}
        {confirmClearAll && (
          <div className="bg-red-50 p-4 border-b border-red-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-red-900 text-xs overflow-hidden animate-fade-in">
            <span className="font-semibold text-center sm:text-left">
              Tem certeza que deseja apagar TODO o histórico? Esta ação não pode ser desfeita.
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  onClearAll();
                  setConfirmClearAll(false);
                }}
                className="px-3 py-1.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition active:scale-95"
              >
                Sim, Apagar Tudo
              </button>
              <button
                onClick={() => setConfirmClearAll(false)}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition active:scale-95"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

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
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 hover:border-slate-300 transition group relative"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2 pr-8">
                  <span className="font-bold text-slate-900">
                    Cliente: {order.customerDetails.name || 'Não informado'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')} {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="text-xs text-slate-700 font-medium pr-8">
                  {order.items.length} itens: {order.items.slice(0, 4).map(i => i.name).join(', ')}
                  {order.items.length > 4 && '...'}
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onDeleteList(order.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-1 text-xs font-semibold active:scale-95"
                    title="Excluir este pedido do histórico"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                    <span className="hidden sm:inline">Excluir</span>
                  </button>

                  <button
                    onClick={() => {
                      onLoadList(order);
                      onClose();
                    }}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition shadow-xs active:scale-95"
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

