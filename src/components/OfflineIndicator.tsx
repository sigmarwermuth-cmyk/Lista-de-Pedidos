import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 border border-amber-500/40 text-amber-300 px-4 py-2.5 text-xs font-bold shadow-2xl animate-fade-in print:hidden">
      <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
      <span>Modo Offline — Você pode continuar montando sua lista!</span>
    </div>
  );
};
