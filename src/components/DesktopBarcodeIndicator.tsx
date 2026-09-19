import React, { useState } from 'react';
import { Barcode, Volume2, VolumeX, HelpCircle, Check, Info } from 'lucide-react';

interface DesktopBarcodeIndicatorProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  lastScannedCode?: string;
  lastScannedTime?: number;
}

export const DesktopBarcodeIndicator: React.FC<DesktopBarcodeIndicatorProps> = ({
  soundEnabled,
  onToggleSound,
  lastScannedCode,
  lastScannedTime,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const isRecentScan = lastScannedTime ? Date.now() - lastScannedTime < 2500 : false;

  return (
    <div className="relative">
      <div
        className={`flex items-center justify-between gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border ${
          isRecentScan
            ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg scale-[1.01]'
            : 'bg-emerald-50/80 text-emerald-900 border-emerald-200/90 shadow-2xs hover:bg-emerald-50'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0">
            <Barcode className={`w-4 h-4 ${isRecentScan ? 'text-white animate-bounce' : 'text-emerald-700'}`} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 truncate">
            <span className="font-bold flex items-center gap-1 text-emerald-950 truncate">
              {isRecentScan ? (
                <span className="text-white flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Bipado com sucesso!
                </span>
              ) : (
                <>Leitor 1D Desktop Ativo</>
              )}
            </span>
            <span className={`text-[11px] hidden md:inline truncate ${isRecentScan ? 'text-emerald-100' : 'text-emerald-700'}`}>
              Bipe qualquer produto direto no leitor USB/sem fio para adicionar à lista
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onToggleSound}
            className={`p-1 rounded-lg transition text-xs flex items-center gap-1 ${
              isRecentScan
                ? 'text-white hover:bg-emerald-700'
                : 'text-emerald-700 hover:text-emerald-950 hover:bg-emerald-100'
            }`}
            title={soundEnabled ? 'Silenciar bipe do leitor' : 'Ativar bipe sonoro do leitor'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-60" />}
            <span className="hidden xl:inline text-[10px]">{soundEnabled ? 'Som' : 'Mudo'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowInfo(!showInfo)}
            className={`p-1 rounded-lg transition ${
              isRecentScan
                ? 'text-white hover:bg-emerald-700'
                : 'text-emerald-700 hover:text-emerald-950 hover:bg-emerald-100'
            }`}
            title="Como funciona o leitor de código de barras no computador"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Info popover */}
      {showInfo && (
        <div 
          className="absolute right-0 top-full mt-2 z-40 w-80 sm:w-96 bg-white p-4 rounded-2xl shadow-xl border border-slate-200 text-slate-700 text-xs space-y-2.5 animate-fade-in"
        >
          <div className="flex items-center justify-between font-bold text-slate-900 border-b pb-2">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <Info className="w-4 h-4 text-emerald-600" />
              <span>Como usar o Leitor 1D no Computador</span>
            </span>
            <button
              onClick={() => setShowInfo(false)}
              className="text-slate-400 hover:text-slate-600 text-xs px-1"
            >
              ✕
            </button>
          </div>

          <ul className="space-y-1.5 text-[11px] leading-relaxed list-disc list-inside">
            <li>
              <strong>Totalmente Automático:</strong> Você não precisa clicar na busca nem selecionar nenhum campo.
            </li>
            <li>
              <strong>Adição Direta:</strong> Aponte o leitor de código de barras para o produto e aperte o gatilho; o item será adicionado na hora com aviso sonoro.
            </li>
            <li>
              <strong>Incremento:</strong> Bipar o mesmo produto várias vezes aumentará a quantidade dele na lista.
            </li>
            <li>
              <strong>Cadastrar Novos Códigos:</strong> Se bipar um código que ainda não está no catálogo, o sistema oferecerá um botão rápido para cadastrá-lo.
            </li>
          </ul>

          <div className="bg-emerald-50 p-2 rounded-xl text-emerald-800 text-[10px] font-medium border border-emerald-100">
            Compatível com qualquer leitor USB ou sem fio padrão (Honeywell, Elgin, Zebra, Bematech, etc.).
          </div>
        </div>
      )}
    </div>
  );
};
