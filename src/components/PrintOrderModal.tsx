import React, { useState } from 'react';
import { X, Printer, FileDown, Share2, Loader2, ArrowLeft } from 'lucide-react';
import { CustomerDetails, OrderListItem, AppSettings } from '../types';
import { formatQuantityStr, generateWhatsAppOrderList, getWhatsAppUrl } from '../utils/whatsapp';
import { shareOrDownloadPDF } from '../utils/pdfGenerator';

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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfMessage, setPdfMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsAppPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      setPdfMessage(null);

      const cleanCustomerName = customerDetails.name && customerDetails.name.trim() !== '' && customerDetails.name !== 'Não informado'
        ? `_${customerDetails.name.trim().replace(/[^a-zA-Z0-9]/g, '_')}`
        : '';

      const result = await shareOrDownloadPDF(
        'printable-order-sheet',
        customerDetails,
        items,
        appSettings.companyName,
        `Lista_de_Pedido${cleanCustomerName}.pdf`
      );

      if (result.downloaded) {
        setPdfMessage('PDF baixado no dispositivo! Abrindo o WhatsApp...');
        // Open WhatsApp web/app so user can attach
        const text = generateWhatsAppOrderList(customerDetails, items, appSettings.companyName);
        const url = getWhatsAppUrl(appSettings.whatsappNumber, text);
        setTimeout(() => {
          window.open(url, '_blank');
        }, 800);
      } else if (result.shared) {
        setPdfMessage('PDF enviado via compartilhamento!');
      }
    } catch (err) {
      console.error(err);
      alert('Não foi possível gerar o PDF. Tente usar o botão de Imprimir e salvar como PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static animate-fade-in"
    >
      {/* Container */}
      <div 
        className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh] border border-gray-200 print:max-h-none print:shadow-none print:border-none print:rounded-none animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Screen-Only Modal Header */}
        <div className="p-3.5 sm:p-5 bg-[#001b69] text-white flex flex-wrap items-center justify-between gap-2.5 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-2.5 py-1.5 bg-[#001248] hover:bg-[#00185e] text-slate-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1 border border-[#002888] shadow-xs active:scale-95"
              title="Voltar para o aplicativo"
            >
              <ArrowLeft className="w-4 h-4 text-[#f1b500]" />
              <span>Voltar</span>
            </button>
            <div>
              <h2 className="font-bold text-sm sm:text-lg leading-tight">Impressão & Envio do Pedido</h2>
              <p className="text-[11px] sm:text-xs text-sky-200 hidden sm:block">
                Imprima ou envie em formato PDF para o WhatsApp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendWhatsAppPDF}
              disabled={isGeneratingPdf}
              className="px-2.5 sm:px-3 py-2 bg-[#008d36] hover:bg-[#00732d] disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 shadow-md active:scale-95"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
              <span>PDF WhatsApp</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 sm:px-3.5 py-2 bg-[#001248] hover:bg-[#00185e] text-white font-bold text-xs rounded-xl transition flex items-center gap-1 border border-[#002888] shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4 text-[#f1b500]" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#001248] text-white transition active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Notice Banner when PDF downloaded */}
        {pdfMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-2.5 text-center text-xs font-semibold text-[#008d36] print:hidden animate-fade-in">
            ✅ {pdfMessage}
          </div>
        )}

        {/* Printable Paper Document Sheet */}
        <div 
          id="printable-order-sheet"
          className="p-4 sm:p-6 overflow-y-auto bg-white text-slate-900 font-sans print:p-0 print:overflow-visible printable-sheet text-[12px]"
        >
          {/* Top Bar with Total Count & Customer Name */}
          <div className="border-b-2 border-[#001b69] pb-1.5 mb-2 flex items-center justify-between gap-3">
            <h2 className="text-[14px] font-black tracking-tight text-[#001b69]">
              Lista de Pedidos
              {customerDetails.name && customerDetails.name.trim() !== '' && customerDetails.name !== 'Não informado' ? (
                <span className="text-slate-900 font-bold ml-1.5">
                  - {customerDetails.name.trim()}
                </span>
              ) : null}
            </h2>
            <div className="text-right text-[12px] font-black text-[#001b69] uppercase shrink-0">
              Total: {items.length} {items.length === 1 ? 'item' : 'itens'}
            </div>
          </div>

          {/* Compact Customer Details Line (Phone / Address / Delivery Date) */}
          {((customerDetails.phone && customerDetails.phone.trim() !== '' && customerDetails.phone !== 'Não informado') ||
            (customerDetails.address && customerDetails.address.trim() !== '') ||
            (customerDetails.deliveryDate && customerDetails.deliveryDate.trim() !== '')) && (
            <div className="mb-2 pb-1 border-b border-slate-200 text-[11px] text-slate-700 flex flex-wrap gap-x-4 gap-y-0.5">
              {customerDetails.phone && customerDetails.phone.trim() !== '' && customerDetails.phone !== 'Não informado' && (
                <span><strong className="font-semibold text-slate-900">Fone:</strong> {customerDetails.phone.trim()}</span>
              )}
              {customerDetails.deliveryType === 'delivery' && customerDetails.address && customerDetails.address.trim() !== '' && (
                <span><strong className="font-semibold text-slate-900">Entrega:</strong> {customerDetails.address.trim()}</span>
              )}
              {customerDetails.deliveryType === 'pickup' && (
                <span className="font-semibold text-slate-800">Retirada no Local</span>
              )}
              {customerDetails.deliveryDate && customerDetails.deliveryDate.trim() !== '' && (
                <span><strong className="font-semibold text-slate-900">Data/Horário:</strong> {customerDetails.deliveryDate.trim()}</span>
              )}
            </div>
          )}


          {/* Items Table for Separator / Picker */}
          <div className="mb-3">
            <table className="w-full border-collapse text-left text-[12px]">
              <thead>
                <tr className="bg-[#001b69] text-white font-bold text-[12px] uppercase print:bg-[#001b69] print:text-white">
                  <th className="py-0.5 px-2 border border-[#001b69]">Item / Produto</th>
                  <th className="py-0.5 px-2 w-28 text-center border border-[#001b69]">Quantidade</th>
                  <th className="py-0.5 px-2 w-32 border border-[#001b69]">Código</th>
                  <th className="py-0.5 px-2 w-36 border border-[#001b69]">Quantidade Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}
                  >
                    <td className="py-0.5 px-2 border border-slate-300 font-bold text-slate-900 leading-tight">
                      {index + 1}. {item.name}
                    </td>
                    <td className="py-0.5 px-2 border border-slate-300 text-center font-extrabold text-slate-900 bg-slate-100/50 leading-tight">
                      {formatQuantityStr(item.quantity, item.unit)}
                    </td>
                    <td className="py-0.5 px-2 border border-slate-300 font-mono text-[11px] font-bold text-slate-800">
                      {item.barcode || '-'}
                    </td>
                    <td className="py-0.5 px-2 border border-slate-300 text-slate-600 italic leading-tight">
                      {item.note || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Bottom Bar for Screen View */}
        <div className="p-3.5 sm:p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            onClick={onClose}
            className="py-2 px-3.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition flex items-center gap-1.5 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>Voltar / Fechar</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSendWhatsAppPDF}
              disabled={isGeneratingPdf}
              className="py-2.5 px-3.5 sm:px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 active:scale-95"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
              <span>ENVIAR PDF WHATSAPP</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-2.5 px-3.5 sm:px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>IMPRIMIR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
