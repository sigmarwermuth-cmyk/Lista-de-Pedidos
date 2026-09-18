import React from 'react';
import { Search, Printer, History, X } from 'lucide-react';
import { AppSettings } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  appSettings: AppSettings;
  listCount: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onOpenPrint: () => void;
  onOpenHistory: () => void;
  onClearList: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  appSettings,
  listCount,
  searchTerm,
  setSearchTerm,
  onOpenPrint,
  onOpenHistory,
  onClearList,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Company Title */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                📋
              </div>
              <div>
                <h1 className="font-extrabold text-lg sm:text-xl leading-tight text-white tracking-tight">
                  {appSettings.companyName || 'Lista de Pedidos'}
                </h1>
                <p className="text-xs text-slate-300 font-medium">
                  {appSettings.headerSubtitle || 'Montagem de Pedido de Produtos e Hortifruti'}
                </p>
              </div>
            </div>

            {/* Mobile Header Buttons */}
            <div className="flex md:hidden items-center gap-1.5">
              <PWAInstallButton variant="header" />

              <button
                onClick={onOpenPrint}
                className="relative bg-emerald-500 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir ({listCount})</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar fruta, legume, verdura ou produto..."
              className="w-full pl-10 pr-9 py-2 bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:border-emerald-400 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <PWAInstallButton variant="header" />

            {listCount > 0 && (
              <button
                onClick={onClearList}
                className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition"
                title="Limpar todos os itens da lista atual"
              >
                Nova Lista
              </button>
            )}

            <button
              onClick={onOpenHistory}
              className="px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <History className="w-4 h-4 text-amber-400" />
              <span>Histórico</span>
            </button>

            <button
              onClick={onOpenPrint}
              disabled={listCount === 0}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-lg ${
                listCount > 0
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
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
