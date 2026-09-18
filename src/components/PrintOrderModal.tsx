import React from 'react';
import { X, Printer, Send, CheckSquare, Calendar, User, Phone, MapPin, FileText } from 'lucide-react';
import { CustomerDetails, OrderListItem, AppSettings } from '../types';
import { formatQuantityStr, generateWhatsAppOrderList, getWhatsAppUrl } from '../utils/whatsapp';

interface PrintOrderModalProps {
  isOpen: boolean;
  customerDetails: CustomerDetails;
  items: OrderListItem[];
  appSettings: AppSettings;
  onClose: () => void;
}

export const PrintOrderModal: React.FC<PrintOrderModalProps> = ({
  isOpen,
  customerDetails,
  items,
  appSettings,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const text = generateWhatsAppOrderList(customerDetails, items, appSettings.companyName);
    const url = getWhatsAppUrl(appSettings.whatsappNumber, text);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in overflow-y-auto">
      {/* Container */}
      <div 
        className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh] border border-gray-200 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Screen-Only Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-emerald-400">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Pré-visualização para Impressão</h2>
              <p className="text-xs text-slate-300">
                Lista pronta para impressão ou envio ao separador
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendWhatsApp}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Enviar WhatsApp</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Agora</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-white transition ml-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Printable Paper Document Sheet */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-white text-slate-900 font-sans print:p-0 print:overflow-visible printable-sheet">
          {/* Header Banner */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
                {appSettings.companyName || 'PEDIDO DE PRODUTOS'}
              </h1>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mt-0.5">
                {appSettings.headerSubtitle || 'LISTA DE SEPARAÇÃO E ENTREGA'}
              </p>
            </div>
            <div className="text-right sm:text-right text-xs text-slate-500 font-medium">
              <div><strong>Data do Pedido:</strong> {new Date().toLocaleDateString('pt-BR')}</div>
              <div><strong>Hora:</strong> {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
              <div className="text-slate-800 font-bold mt-0.5">Total: {items.length} itens</div>
            </div>
          </div>

          {/* Customer Details Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 mb-6 text-xs sm:text-sm space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-500 shrink-0 print:hidden" />
                <span><strong>Cliente:</strong> {customerDetails.name || 'Não informado'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-slate-500 shrink-0 print:hidden" />
                <span><strong>Telefone/Zap:</strong> {customerDetails.phone || 'Não informado'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 print:hidden" />
                <span>
                  <strong>Modalidade:</strong>{' '}
                  {customerDetails.deliveryType === 'delivery'
                    ? 'Entrega em Domicílio 🚚'
                    : 'Retirada no Local 🏬'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-500 shrink-0 print:hidden" />
                <span><strong>Data/Horário Desejado:</strong> {customerDetails.deliveryDate || 'O quanto antes'}</span>
              </div>
            </div>

            {customerDetails.deliveryType === 'delivery' && customerDetails.address && (
              <div className="pt-1 border-t border-slate-200">
                <strong>Endereço Completo:</strong> {customerDetails.address}
              </div>
            )}

            {customerDetails.generalNotes && (
              <div className="pt-1 border-t border-slate-200 text-slate-700 italic">
                <strong>Observações do Cliente:</strong> "{customerDetails.generalNotes}"
              </div>
            )}
          </div>

          {/* Items Table for Separator / Picker */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
              <span>Lista de Itens Solicitados ({items.length})</span>
              <span className="text-[10px] text-slate-400 font-normal">[  ] Marque ao separar na prateleira</span>
            </h3>

            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-900 text-white font-bold text-xs uppercase">
                  <th className="py-2.5 px-3 w-12 text-center border border-slate-900">OK</th>
                  <th className="py-2.5 px-3 border border-slate-900">Item / Produto</th>
                  <th className="py-2.5 px-3 w-28 text-center border border-slate-900">Quantidade</th>
                  <th className="py-2.5 px-3 border border-slate-900">Observações do Item</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}
                  >
                    <td className="py-2.5 px-3 text-center border border-slate-300 font-bold">
                      <div className="w-5 h-5 border-2 border-slate-400 rounded-sm mx-auto flex items-center justify-center">
                        <span className="text-[10px] text-slate-300">✓</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 border border-slate-300 font-bold text-slate-900">
                      {index + 1}. {item.name}
                    </td>
                    <td className="py-2.5 px-3 border border-slate-300 text-center font-extrabold text-slate-900 bg-slate-100/50">
                      {formatQuantityStr(item.quantity, item.unit)}
                    </td>
                    <td className="py-2.5 px-3 border border-slate-300 text-slate-600 italic">
                      {item.note || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Notes & Signatures */}
          <div className="border-t-2 border-slate-300 pt-4 text-xs text-slate-500 flex flex-col sm:flex-row justify-between gap-6 print:flex-row">
            <div>
              <p className="font-semibold text-slate-700">Instruções para a Separação:</p>
              <p className="mt-0.5">{appSettings.printInstructions}</p>
            </div>

            <div className="flex gap-8 text-center pt-2">
              <div className="border-t border-slate-400 pt-1 w-32">
                <span className="text-[10px] uppercase font-bold block">Conferido por</span>
              </div>
              <div className="border-t border-slate-400 pt-1 w-32">
                <span className="text-[10px] uppercase font-bold block">Assinatura Cliente</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar for Screen View */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-500 font-medium">
            💡 Dica: Clique em "Imprimir Agora" para usar a impressora do sistema ou salvar em PDF.
          </span>
          <button
            onClick={handlePrint}
            className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg transition flex items-center gap-2"
          >
            <Printer className="w-5 h-5" />
            <span>IMPRIMIR ESTA LISTA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
