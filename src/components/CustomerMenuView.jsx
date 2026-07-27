import React, { useState } from 'react';
import { Search, Phone, Info } from 'lucide-react';
import { ALLERGENS } from '../data/presetMenus';

export default function CustomerMenuView({ restaurant, dishes, isMobileSimulator = false }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Todo' },
    { id: 'primeros', label: 'Primeros' },
    { id: 'segundos', label: 'Segundos' },
    { id: 'postres', label: 'Postres' },
    { id: 'bebidas', label: 'Bebidas' }
  ];

  const query = searchQuery.trim().toLowerCase();
  const allDishes = Array.isArray(dishes) ? dishes : [];

  const filteredDishes = allDishes.filter(dish => {
    if (activeCategory !== 'all' && dish.category !== activeCategory) return false;
    if (query && !(dish.name || '').toLowerCase().includes(query)) return false;
    return true;
  });

  const getCategoryTitle = (catKey) => {
    switch (catKey) {
      case 'primeros': return '🥗 Primeros Platos';
      case 'segundos': return '🥩 Segundos Platos';
      case 'postres': return '🍰 Postres Caseros';
      case 'bebidas': return '🍷 Bebidas & Sugerencias';
      default: return 'Platos';
    }
  };

  const groupedDishes = {
    primeros: filteredDishes.filter(d => d.category === 'primeros'),
    segundos: filteredDishes.filter(d => d.category === 'segundos'),
    postres: filteredDishes.filter(d => d.category === 'postres'),
    bebidas: filteredDishes.filter(d => d.category === 'bebidas')
  };

  return (
    <div className={`w-full ${isMobileSimulator ? 'p-0' : 'max-w-md mx-auto p-0'} bg-[#f0f7fc] min-h-full pb-20`}>
      {/* Cyan Hero Header (Matching Reference Image) */}
      <div className="hero-cyan-banner p-6 text-center space-y-4">
        {/* Profile Pill Badge */}
        <div className="white-profile-pill px-4 py-2 inline-flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#00b4d8] text-white font-black text-sm flex items-center justify-center">
            {restaurant?.icon || '🍷'}
          </div>
          <div className="text-left">
            <h1 className="font-extrabold text-slate-900 text-xs leading-tight">
              {restaurant?.name || 'Paco Mer'}
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold">@pacomer</p>
          </div>
        </div>

        {/* Display Price Metric */}
        <div className="space-y-1">
          <p className="text-white/80 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1">
            <span>Precio del Menú Completo</span>
            <Info className="w-3 h-3" />
          </p>
          <p className="text-3xl font-black text-white tracking-tight">
            {restaurant?.fullPrice || '13.50'} {restaurant?.currency || '€'}
          </p>
          {restaurant?.includesText && (
            <p className="text-[11px] text-white/90 font-medium">
              ✨ {restaurant.includesText}
            </p>
          )}
        </div>
      </div>

      {/* Content Area Below */}
      <div className="p-4 space-y-4">
        {/* Search & Category Pills */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 input-icon-left" />
            <input
              type="text"
              placeholder="Buscar en la carta..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-input form-input-with-icon text-xs font-semibold rounded-full shadow-sm"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar bg-white p-1 rounded-full border border-slate-100 shadow-sm">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#00b4d8] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grouped Dishes */}
        <div className="space-y-4">
          {filteredDishes.length === 0 && (
            <div className="fintech-card p-8 text-center space-y-1">
              <p className="text-sm font-bold text-slate-700">
                {allDishes.length === 0
                  ? 'La carta de hoy todavía no está publicada.'
                  : 'Ningún plato coincide con tu búsqueda.'}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                {allDishes.length === 0
                  ? 'Pregunta a nuestro personal por el menú del día.'
                  : 'Prueba con otra palabra o elige otra sección.'}
              </p>
            </div>
          )}

          {Object.keys(groupedDishes).map(categoryKey => {
            const list = groupedDishes[categoryKey];
            if (list.length === 0) return null;

            return (
              <div key={categoryKey} className="space-y-2">
                <h2 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 pl-1">
                  {getCategoryTitle(categoryKey)}
                </h2>

                <div className="space-y-2">
                  {list.map(dish => (
                    <div
                      key={dish.id}
                      className={`fintech-card p-4 space-y-2 ${
                        !dish.isAvailable ? 'opacity-40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-sm text-slate-900 leading-snug">
                              {dish.name}
                            </h3>
                            {dish.isChefSpecial && (
                              <span className="px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold border border-amber-200">
                                ⭐ Especial
                              </span>
                            )}
                          </div>

                          {dish.description && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {dish.description}
                            </p>
                          )}
                        </div>

                        {parseFloat(dish.supplement) > 0 && (
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#00b4d8] font-extrabold text-xs whitespace-nowrap">
                            +{dish.supplement} €
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                        <div className="flex items-center gap-1 flex-wrap">
                          {dish.allergens && dish.allergens.map(algId => {
                            const alg = ALLERGENS.find(a => a.id === algId);
                            if (!alg) return null;
                            return (
                              <span key={algId} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                                {alg.icon} {alg.label}
                              </span>
                            );
                          })}
                        </div>

                        {!dish.isAvailable && (
                          <span className="text-rose-600 font-bold text-xs">Agotado</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Call the restaurant (real phone call, not a simulated bell) */}
        {restaurant?.phone && (
          <div className="mt-6 p-2 bg-white rounded-full border border-slate-100 shadow-sm">
            <a
              href={`tel:${restaurant.phone.replace(/\s+/g, '')}`}
              className="w-full py-2.5 px-4 rounded-full font-extrabold text-xs flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Llamar y Reservar</span>
            </a>
          </div>
        )}

        <div className="mt-6 text-center text-[11px] text-slate-400 space-y-1 pb-4">
          <p>Avisa a nuestro personal en caso de alergias.</p>
          <p className="font-extrabold text-slate-700">
            {restaurant?.name || 'Paco Mer'} • Menú Digital
          </p>
        </div>
      </div>
    </div>
  );
}
