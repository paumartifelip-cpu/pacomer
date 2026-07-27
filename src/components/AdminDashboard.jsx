import React, { useState } from 'react';
import {
  Plus, Edit2, Trash2, ArrowUp, ArrowDown, Sparkles,
  Smartphone, Share2, Search, X, QrCode, Info
} from 'lucide-react';
import CustomerMenuView from './CustomerMenuView';

const CATEGORIES = [
  { id: 'primeros', title: 'Primeros Platos', icon: '🥗', colorBg: 'bg-purple-100 text-purple-700' },
  { id: 'segundos', title: 'Segundos Platos', icon: '🥩', colorBg: 'bg-amber-100 text-amber-700' },
  { id: 'postres', title: 'Postres Caseros', icon: '🍰', colorBg: 'bg-emerald-100 text-emerald-700' },
  { id: 'bebidas', title: 'Bebidas & Sugerencias', icon: '🍷', colorBg: 'bg-[#F5D6D4] text-[#8B2320]' }
];

export default function AdminDashboard({
  restaurant,
  setRestaurant,
  dishes,
  setDishes,
  onOpenDishModal,
  onOpenPresetModal,
  onOpenShareModal,
  onShowToast
}) {
  const [showMobilePreviewModal, setShowMobilePreviewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRestaurantChange = (field, value) => {
    setRestaurant(prev => ({ ...prev, [field]: value }));
  };

  const toggleDishAvailability = (id) => {
    setDishes(prev => prev.map(dish => {
      if (dish.id === id) {
        return { ...dish, isAvailable: !dish.isAvailable };
      }
      return dish;
    }));
  };

  const handleDeleteDish = (id) => {
    setDishes(prev => prev.filter(d => d.id !== id));
    onShowToast('Plato eliminado');
  };

  // Reorder within the dish's own section. Swapping by global index would trade
  // places with a dish from another category, which looks like nothing happened.
  const moveDish = (dish, direction) => {
    setDishes(prev => {
      const sameCategory = prev.filter(d => d.category === dish.category);
      const position = sameCategory.findIndex(d => d.id === dish.id);
      const target = direction === 'up' ? position - 1 : position + 1;
      if (position === -1 || target < 0 || target >= sameCategory.length) return prev;

      const from = prev.findIndex(d => d.id === dish.id);
      const to = prev.findIndex(d => d.id === sameCategory[target].id);
      const next = [...prev];
      next[from] = prev[to];
      next[to] = prev[from];
      return next;
    });
  };

  const handleClearAll = () => {
    if (window.confirm('¿Vaciar todos los platos del menú de hoy?')) {
      setDishes([]);
      onShowToast('Menú vaciado');
    }
  };

  const getDishesByCategory = (catKey) => {
    const query = searchQuery.trim().toLowerCase();
    return dishes
      .filter(d => d.category === catKey)
      .filter(d => !query || (d.name || '').toLowerCase().includes(query));
  };

  // Position inside the section, ignoring the search filter, so the up/down
  // arrows stay correct while searching.
  const getPositionInCategory = (dish) => {
    const sameCategory = dishes.filter(d => d.category === dish.category);
    return { index: sameCategory.findIndex(d => d.id === dish.id), total: sameCategory.length };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Hero Cyan Banner (Matches reference top card exactly) */}
      <div className="hero-meson p-6 sm:p-8 space-y-6">
        {/* Top Profile Pill (Matching Reference) */}
        <div className="flex items-center justify-between">
          <div className="white-profile-pill px-4 py-2 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#8B2320] text-white font-black flex items-center justify-center text-base shadow-sm">
              {restaurant?.icon || '🍷'}
            </div>
            <div>
              <h2 className="font-extrabold text-stone-900 text-sm leading-tight">
                {restaurant?.name || 'Paco Mer'}
              </h2>
              <p className="text-[11px] text-stone-400 font-semibold">@pacomer</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenShareModal}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30 transition-all border border-white/30"
              title="Compartir QR"
            >
              <QrCode className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowMobilePreviewModal(true)}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30 transition-all border border-white/30"
              title="Ver Vista Móvil"
            >
              <Smartphone className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Display Metric (Matching Reference Total Balance) */}
        <div className="pt-2 space-y-1">
          <div className="flex items-center gap-1.5 text-white/80 text-xs font-bold uppercase tracking-wider">
            <span>Precio del Menú Completo</span>
            <Info className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              {restaurant?.fullPrice || '13.50'} {restaurant?.currency || '€'}
            </span>
            {restaurant?.halfPrice && (
              <span className="text-sm font-bold text-white/70">
                (Medio: {restaurant.halfPrice} €)
              </span>
            )}
          </div>
          {restaurant?.includesText && (
            <p className="text-xs text-white/90 font-medium pt-1">
              ✨ {restaurant.includesText}
            </p>
          )}
        </div>

        {/* Hero Action Buttons (Matching Reference + Deposit & Send Buttons) */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => onOpenDishModal(null, 'primeros')}
            className="btn-hero-white flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4 text-[#8B2320]" />
            <span>+ Añadir Plato</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="btn-hero-glass flex items-center gap-2 text-sm"
          >
            <Share2 className="w-4 h-4 text-white" />
            <span>↗ Compartir QR</span>
          </button>

          <button
            onClick={onOpenPresetModal}
            className="btn-hero-glass hidden sm:flex items-center gap-2 text-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Ejemplos</span>
          </button>
        </div>
      </div>

      {/* Main Content Area Below (Matching Reference Pure White Rounded Cards) */}
      <div className="px-4 sm:px-0 space-y-6">
        {/* Search Bar & Preset Quick Button */}
        <div className="meson-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-80 relative">
            <Search className="w-4 h-4 text-stone-400 input-icon-left" />
            <input
              type="text"
              placeholder="Buscar plato en la carta..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-input form-input-with-icon text-xs font-semibold rounded-full"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onOpenPresetModal}
              className="btn btn-secondary text-xs sm:hidden"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Cargar Ejemplo</span>
            </button>
          </div>
        </div>

        {/* Restaurant Configuration Details */}
        <div className="meson-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-stone-900 text-sm">
                Datos del Restaurante
              </h3>
              <Info className="w-3.5 h-3.5 text-stone-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Nombre del Local</label>
              <input
                type="text"
                value={restaurant?.name ?? ''}
                onChange={e => handleRestaurantChange('name', e.target.value)}
                className="form-input font-bold text-stone-900"
              />
            </div>

            <div>
              <label className="form-label">Precio Menú Completo (€)</label>
              <input
                type="text"
                value={restaurant?.fullPrice ?? ''}
                onChange={e => handleRestaurantChange('fullPrice', e.target.value)}
                className="form-input font-extrabold text-[#8B2320]"
              />
            </div>

            <div>
              <label className="form-label">Qué Incluye el Menú</label>
              <input
                type="text"
                value={restaurant?.includesText ?? ''}
                onChange={e => handleRestaurantChange('includesText', e.target.value)}
                className="form-input text-xs"
                placeholder="Ej: Incluye Pan, 1 Bebida y Postre/Café"
              />
            </div>

            <div>
              <label className="form-label">Teléfono de Reservas</label>
              <input
                type="text"
                value={restaurant?.phone ?? ''}
                onChange={e => handleRestaurantChange('phone', e.target.value)}
                className="form-input text-xs"
              />
            </div>
          </div>
        </div>

        {/* Menu Section Cards (Matching Reference Accounts Section) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-1.5">
              <span>Secciones del Menú de Hoy</span>
              <Info className="w-4 h-4 text-stone-400" />
            </h3>
          </div>

          {CATEGORIES.map(cat => {
            const catDishes = getDishesByCategory(cat.id);
            return (
              <div key={cat.id} className="meson-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${cat.colorBg} flex items-center justify-center font-bold text-base shadow-sm`}>
                      {cat.icon}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-stone-900 text-base">
                        {cat.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 font-semibold">
                        {catDishes.length} {catDishes.length === 1 ? 'opción disponible' : 'opciones disponibles'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenDishModal(null, cat.id)}
                    className="btn btn-sm btn-meson font-bold text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir</span>
                  </button>
                </div>

                {catDishes.length === 0 ? (
                  <div className="py-4 text-center text-xs text-stone-400 font-medium">
                    Sin platos en esta sección. Haz clic en "+ Añadir".
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {catDishes.map((dish) => {
                      const { index: posInCategory, total: categoryTotal } = getPositionInCategory(dish);
                      return (
                        <div
                          key={dish.id}
                          className={`py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                            !dish.isAvailable ? 'opacity-40' : ''
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-stone-900">
                                {dish.name}
                              </span>
                              {dish.isChefSpecial && (
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold border border-amber-200">
                                  ⭐ Especial
                                </span>
                              )}
                              {parseFloat(dish.supplement) > 0 && (
                                <span className="px-2.5 py-0.5 rounded-full bg-[#FBEDEC] text-[#8B2320] font-extrabold text-xs">
                                  +{dish.supplement}€
                                </span>
                              )}
                            </div>
                            {dish.description && (
                              <p className="text-xs text-stone-500">
                                {dish.description}
                              </p>
                            )}
                          </div>

                          {/* Controls */}
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <div className="flex items-center gap-2 mr-2">
                              <span className={`text-xs font-bold ${dish.isAvailable ? 'text-[#8B2320]' : 'text-stone-400'}`}>
                                {dish.isAvailable ? 'Disponible' : 'Agotado'}
                              </span>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={dish.isAvailable}
                                  onChange={() => toggleDishAvailability(dish.id)}
                                />
                                <span className="slider"></span>
                              </label>
                            </div>

                            <div className="flex items-center border border-stone-200 rounded-full overflow-hidden">
                              <button
                                onClick={() => moveDish(dish, 'up')}
                                disabled={posInCategory <= 0}
                                className="px-2.5 py-1 bg-white hover:bg-stone-50 text-stone-600 disabled:opacity-30 border-r border-stone-200"
                                title="Subir"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => moveDish(dish, 'down')}
                                disabled={posInCategory === categoryTotal - 1}
                                className="px-2.5 py-1 bg-white hover:bg-stone-50 text-stone-600 disabled:opacity-30"
                                title="Bajar"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              onClick={() => onOpenDishModal(dish, dish.category)}
                              className="btn btn-secondary btn-icon btn-sm"
                              title="Editar"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-stone-600" />
                            </button>

                            <button
                              onClick={() => handleDeleteDish(dish.id)}
                              className="btn btn-danger btn-icon btn-sm"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={handleClearAll} className="btn btn-sm btn-danger text-xs">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Vaciar Menú de Hoy</span>
          </button>
        </div>
      </div>

      {/* Mobile Preview Modal */}
      {showMobilePreviewModal && (
        <div className="modal-overlay">
          <div className="modal-content max-w-md p-4">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-200">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#8B2320]" />
                <span>Vista Previa Carta Móvil</span>
              </h3>
              <button onClick={() => setShowMobilePreviewModal(false)} className="btn btn-secondary btn-icon btn-sm">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="phone-simulator-frame">
              <CustomerMenuView restaurant={restaurant} dishes={dishes} isMobileSimulator={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
