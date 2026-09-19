import React, { useEffect } from 'react';
import { Barcode, CheckCircle2, AlertCircle, Plus, X, Volume2, VolumeX } from 'lucide-react';
import { Product } from '../types';

export interface BarcodeScanResult {
  code: string;
  timestamp: number;
  product?: Product;
  quantity?: number;
  unit?: string;
  isNotFound?: boolean;
}

interface BarcodeScannerBannerProps {
  scanResult: BarcodeScanResult | null;
  onClear: () => void;
  onRegisterBarcode: (barcode: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const BarcodeScannerBanner: React.FC<BarcodeScannerBannerProps> = ({
  scanResult,
  onClear,
  onRegisterBarcode,
  soundEnabled,
  onToggleSound,
}) => {
  useEffect(() => {
    if (!scanResult) return;
    const timer = setTimeout(() => {
      onClear();
    }, scanResult.isNotFound ? 7000 : 3500);

    return () => clearTimeout(timer);
  }, [scanResult, onClear]);

  if (!scanResult) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed top-5 right-4 sm:right-6 z-50 max-w-md w-full animate-bounce-short drop-shadow-2xl print:hidden pointer-events-auto"
    >
      {scanResult.isNotFound ? (
        // NOT FOUND NOTIFICATION
        <div className="bg-amber-950 text-amber-50 rounded-2xl p-4 border-2 border-amber-500/80 shadow-2xl space-y-3 backdrop-blur-md">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Barcode className="w-4 h-4 text-amber-400" />
                  <span>Código não cadastrado</span>
                </h4>
                <p className="text-xs text-amber-200 font-mono mt-0.5 font-semibold">
                  EAN: {scanResult.code}
                </p>
              </div>
            </div>

            <button
              onClick={onClear}
              className="text-amber-300 hover:text-white p-1 rounded-lg transition"
              title="Fechar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-amber-200/90 leading-relaxed">
            Este código de barras ainda não está associado a nenhum item do seu catálogo.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                onRegisterBarcode(scanResult.code);
                onClear();
              }}
              className="flex-1 px-3 py-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Novo Produto com este Código</span>
            </button>
          </div>
        </div>
      ) : (
        // SUCCESS NOTIFICATION
        <div className="bg-[#002511] text-emerald-50 rounded-2xl p-3.5 border-2 border-emerald-500/80 shadow-2xl flex items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-2xl shrink-0 shadow-inner">
              {scanResult.product?.icon || '📦'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Bipado via Leitor 1D (+1)</span>
              </div>
              <h4 className="font-bold text-sm text-white truncate">
                {scanResult.product?.name}
              </h4>
              <p className="text-[11px] text-emerald-200 font-mono truncate">
                Total na lista: <strong className="text-white">{scanResult.quantity} {scanResult.unit}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={onToggleSound}
              className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/50 transition"
              title={soundEnabled ? 'Silenciar som do leitor' : 'Ativar som do leitor'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-50" />}
            </button>
            <button
              type="button"
              onClick={onClear}
              className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/50 transition"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
