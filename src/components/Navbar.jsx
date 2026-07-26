import React from 'react';
import { Utensils, QrCode, Smartphone, Share2, Check } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onCopyShareLink, showCopiedToast }) {
  return (
    <header className="bg-gradient-to-r from-[#00b4d8] to-[#0077b6] text-white sticky top-0 z-40 px-4 py-3 shadow-md">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand logo & Live status pill matching reference top left card */}
        <div
          className="flex items-center gap-2.5 cursor-pointer bg-white text-slate-900 px-3.5 py-1.5 rounded-full shadow-sm"
          onClick={() => setActiveTab('admin')}
        >
          <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
            P
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-sm leading-tight">
              Paco <span className="text-[#00b4d8]">Mer</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold">@pacomer</p>
          </div>
        </div>

        {/* Tab Switcher - Glass Pill Bar matching reference */}
        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md p-1 rounded-full text-xs font-semibold border border-white/30">
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-1.5 rounded-full transition-all ${
              activeTab === 'admin' ? 'bg-white text-slate-900 shadow-md font-extrabold' : 'text-white hover:bg-white/10'
            }`}
          >
            Gestión de Menú
          </button>

          <button
            onClick={() => setActiveTab('customer')}
            className={`px-4 py-1.5 rounded-full transition-all ${
              activeTab === 'customer' ? 'bg-white text-slate-900 shadow-md font-extrabold' : 'text-white hover:bg-white/10'
            }`}
          >
            Carta Móvil (QR)
          </button>

          <button
            onClick={() => setActiveTab('qrstand')}
            className={`px-4 py-1.5 rounded-full transition-all ${
              activeTab === 'qrstand' ? 'bg-white text-slate-900 shadow-md font-extrabold' : 'text-white hover:bg-white/10'
            }`}
          >
            Cartel Mesa
          </button>
        </div>

        {/* Action: Copy Share Link */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCopyShareLink}
            className="btn btn-sm bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs shadow-md"
            title="Copiar enlace web para clientes"
          >
            {showCopiedToast ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#00b4d8]" />
                <span>Compartir QR</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
