import React from 'react';
import { Share2 } from 'lucide-react';

const TABS = [
  { id: 'admin', label: 'Gestión de Menú' },
  { id: 'customer', label: 'Carta Móvil (QR)' },
  { id: 'qrstand', label: 'Cartel Mesa' }
];

export default function Navbar({ activeTab, setActiveTab, onShare }) {
  return (
    <header className="no-print bg-gradient-to-r from-[#00b4d8] to-[#0077b6] text-white sticky top-0 z-40 px-4 py-3 shadow-md">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <button
          type="button"
          className="flex items-center gap-2.5 bg-white text-slate-900 px-3.5 py-1.5 rounded-full shadow-sm"
          onClick={() => setActiveTab('admin')}
        >
          <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
            P
          </div>
          <div className="text-left">
            <h1 className="font-extrabold text-slate-900 text-sm leading-tight">
              Paco <span className="text-[#00b4d8]">Mer</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold">@pacomer</p>
          </div>
        </button>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md p-1 rounded-full text-xs font-semibold border border-white/30">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-md font-extrabold'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Share */}
        <div className="flex items-center gap-2">
          <button
            onClick={onShare}
            className="btn btn-sm bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs shadow-md"
            title="Compartir la carta con tus clientes"
          >
            <Share2 className="w-3.5 h-3.5 text-[#00b4d8]" />
            <span>Compartir QR</span>
          </button>
        </div>
      </div>
    </header>
  );
}
