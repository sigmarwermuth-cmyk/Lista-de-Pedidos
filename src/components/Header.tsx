import React from 'react';
import { Printer, History, PackagePlus } from 'lucide-react';
import { AppSettings } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  appSettings: AppSettings;
  listCount: number;
  onOpenPrint: () => void;
  onOpenHistory: () => void;
  onOpenProductManager: () => void;
  onClearList: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  appSettings,
  listCount,
  onOpenPrint,
  onOpenHistory,
  onOpenProductManager,
  onClearList,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#001b69] text-white shadow-md print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Company Title */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#008d36] text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-[#008d36]/20 transition-transform active:scale-95"
              >
                📋
              </div>
              <div>
                <h1 className="font-extrabold text-lg sm:text-xl leading-tight text-white tracking-tight">
                  {appSettings.companyName || 'Pedidos Hortifruti'}
                </h1>
                <p className="text-xs text-sky-200 font-medium">
                  {appSettings.headerSubtitle || 'Montagem de Pedido de Produtos e Hortifruti'}
                </p>
              </div>
            </div>

            {/* Mobile Header Buttons */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                onClick={onOpenHistory}
                className="bg-[#001248] text-[#f1b500] font-bold px-2.5 py-2 rounded-xl text-xs flex items-center gap-1 border border-[#002888] active:scale-95 transition"
                title="Histórico de Pedidos"
              >
                <History className="w-4 h-4" />
                <span className="text-[11px]">Histórico</span>
              </button>

              <button
                onClick={onOpenProductManager}
                className="bg-[#001248] text-sky-300 font-bold p-2 rounded-xl text-xs flex items-center justify-center border border-[#002888] active:scale-95 transition"
                title="Cadastrar e Editar Produtos"
              >
                <PackagePlus className="w-4 h-4" />
              </button>

              <PWAInstallButton variant="header" />

              <button
                onClick={onOpenPrint}
                className="relative bg-[#008d36] hover:bg-[#00732d] text-white font-extrabold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shadow-md active:scale-95 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir ({listCount})</span>
              </button>
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onOpenProductManager}
              className="px-3 py-2 text-xs font-semibold text-sky-100 hover:text-white bg-[#001248] hover:bg-[#00185e] rounded-xl border border-[#002888] transition flex items-center gap-1.5 active:scale-95"
              title="Cadastrar, editar ou remover produtos do catálogo"
            >
              <PackagePlus className="w-4 h-4 text-sky-300" />
              <span>Produtos</span>
            </button>

            <PWAInstallButton variant="header" />

            {listCount > 0 && (
              <button
                onClick={onClearList}
                className="px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-[#001248] hover:bg-[#00185e] rounded-xl border border-[#002888] transition active:scale-95"
                title="Limpar todos os itens da lista atual"
              >
                Nova Lista
              </button>
            )}

            <button
              onClick={onOpenHistory}
              className="px-3 py-2 text-xs font-semibold text-[#f1b500] hover:text-amber-200 bg-[#001248] hover:bg-[#00185e] rounded-xl border border-[#002888] transition flex items-center gap-1.5 active:scale-95"
            >
              <History className="w-4 h-4 text-[#f1b500]" />
              <span>Histórico</span>
            </button>

            <button
              onClick={onOpenPrint}
              disabled={listCount === 0}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-lg ${
                listCount > 0
                  ? 'bg-[#008d36] hover:bg-[#00732d] text-white active:scale-95'
                  : 'bg-[#001248] text-slate-400 cursor-not-allowed border border-[#002888]'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>IMPRIMIR LISTA ({listCount})</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
