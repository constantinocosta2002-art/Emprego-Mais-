import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>App Instalado</span>
      </div>
    );
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-lg bg-[#FF8A00] hover:bg-[#e67a00] text-white px-3 py-1.5 text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
        title="Instalar aplicativo EMPREGO+ no seu telemóvel ou computador"
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Instalar App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-orange-400/40 bg-orange-500/10 hover:bg-orange-500/20 px-3 py-1.5 text-xs font-semibold text-white transition-all cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#FF8A00]" />
          <span>Instalar no iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 border border-slate-200 shadow-2xl relative text-slate-800">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-[#FF8A00] mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#102B55] font-display">Instalar EMPREGO+ no iPhone / iPad</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Para ter o <strong>EMPREGO+</strong> no seu ecrã principal como um aplicativo nativo:
              </p>
              <ol className="mt-4 space-y-2.5 text-xs text-slate-700 list-decimal list-inside bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <li>Toque no botão de <strong>Partilhar</strong> (ícone do quadrado com a seta para cima no Safari).</li>
                <li>Deslize para baixo e escolha <strong>Adicionar ao Ecrã Principal</strong>.</li>
                <li>Toque em <strong>Adicionar</strong> no canto superior direito.</li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-[#102B55] hover:bg-[#FF8A00] text-white font-bold py-2.5 text-xs transition cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
