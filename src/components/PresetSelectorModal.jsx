import React, { useEffect } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { PRESET_MENUS } from '../data/presetMenus';

export default function PresetSelectorModal({ isOpen, onClose, onApplyPreset }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Cargar Ejemplos de Menú</span>
          </h2>
          <button onClick={onClose} className="btn btn-secondary btn-icon">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Haz clic en cualquier menú para cargarlo en tu editor. Luego podrás modificar o ajustar lo que quieras.
        </p>

        <div className="space-y-3">
          {PRESET_MENUS.map(preset => (
            <div
              key={preset.id}
              className="p-4 rounded-lg border border-slate-200 hover:border-slate-400 bg-white cursor-pointer transition-all space-y-2"
              onClick={() => {
                onApplyPreset(preset);
                onClose();
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">
                  {preset.title}
                </h3>
                <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                  {preset.fullPrice} €
                </span>
              </div>
              <p className="text-xs text-slate-500">{preset.description}</p>

              <div className="pt-2 flex justify-end">
                <button className="btn btn-sm btn-primary">
                  <Check className="w-3.5 h-3.5" />
                  <span>Cargar Menú</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
