import React, { useState } from 'react';
import { Download, Smartphone, X, Share, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'modal';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running inside installed standalone app, hide install buttons
  if (isInstalled) {
    return null;
  }

  // Handle click logic
  const handleClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      {variant === 'banner' ? (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-lg border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h4 className="font-bold text-sm leading-tight text-white">
                Instalar App no Celular 📲
              </h4>
              <p className="text-xs text-emerald-100">
                Acesse rápido sem precisar abrir o navegador! Funciona offline.
              </p>
            </div>
          </div>

          <button
            onClick={handleClick}
            className="w-full sm:w-auto px-4 py-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>INSTALAR AGORA</span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md active:scale-95 print:hidden"
          title="Instalar este aplicativo no seu celular"
        >
          <Smartphone className="w-4 h-4" />
          <span>Instalar App</span>
        </button>
      )}

      {/* Manual Installation Guide Modal (For iOS / Desktop / when browser auto-prompt is pending) */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in print:hidden">
          <div 
            className="bg-slate-900 text-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-700 space-y-4 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Como Instalar no Celular</h3>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1 text-slate-400 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs text-slate-300">
                <p className="font-semibold text-white">
                  No iPhone ou iPad (Safari):
                </p>
                <ol className="space-y-2 list-decimal list-inside bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <li className="flex items-center gap-2">
                    <Share className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Toque no botão <strong>Compartilhar</strong> na barra do Safari.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <PlusSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.</span>
                  </li>
                  <li>Pronto! O ícone ficará junto aos seus outros aplicativos.</li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-slate-300">
                <p className="font-semibold text-white">
                  No Android ou Chrome:
                </p>
                <ol className="space-y-2.5 list-decimal list-inside bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <li>Toque no menu do navegador (os <strong>3 pontinhos ⋮</strong> no canto superior).</li>
                  <li>Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</li>
                  <li>Confirme em <strong>Instalar</strong>.</li>
                </ol>
              </div>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
