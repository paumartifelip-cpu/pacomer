import React, { useState, useEffect, useRef, Component } from 'react';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import CustomerMenuView from './components/CustomerMenuView';
import QrStandGenerator from './components/QrStandGenerator';
import DishFormModal from './components/DishFormModal';
import PresetSelectorModal from './components/PresetSelectorModal';
import ShareMenuModal from './components/ShareMenuModal';
import { INITIAL_RESTAURANT, INITIAL_DISHES } from './data/presetMenus';
import { parseMenuFromCurrentUrl, currentUrlHasMenu } from './utils/urlEncoder';
import {
  broadcastMenuUpdate,
  persistMenu,
  loadPersistedMenu,
  subscribeToMenuUpdates
} from './utils/syncChannel';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error('React Component Error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-slate-700 space-y-3">
          <p className="font-bold">Ha ocurrido un problema al cargar esta sección.</p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            className="btn btn-primary btn-sm"
          >
            Recargar Sección
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  // A link with an embedded menu always lands on the customer view.
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const hash = window.location.hash;
      return hash === '#view' || hash.includes('menu=') ? 'customer' : 'admin';
    } catch (e) {
      return 'admin';
    }
  });

  // Lazy initialisers: localStorage is read on mount only, never on re-render.
  const [restaurant, setRestaurant] = useState(
    () => loadPersistedMenu().restaurant || INITIAL_RESTAURANT
  );
  const [dishes, setDishes] = useState(
    () => loadPersistedMenu().dishes || INITIAL_DISHES
  );

  // A shared menu is decoded asynchronously; hold the customer view until then
  // so nobody sees the demo menu flash before the real one.
  const [isDecodingSharedMenu, setIsDecodingSharedMenu] = useState(() => currentUrlHasMenu());

  const [toastMessage, setToastMessage] = useState('');

  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [defaultCategory, setDefaultCategory] = useState('primeros');
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Marks state changes that came from outside this tab, so we save them
  // locally but never echo them back and start a broadcast loop.
  const skipBroadcastRef = useRef(true);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Load a menu embedded in the URL (a scanned QR or a shared link).
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const urlMenu = await parseMenuFromCurrentUrl();
        if (cancelled || !urlMenu) return;
        skipBroadcastRef.current = true;
        if (urlMenu.restaurant) setRestaurant(urlMenu.restaurant);
        if (Array.isArray(urlMenu.dishes)) setDishes(urlMenu.dishes);
      } catch (e) {
        console.error('Could not read the menu from the URL:', e);
      } finally {
        if (!cancelled) setIsDecodingSharedMenu(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // Live sync with other tabs of this same browser.
  useEffect(() => {
    return subscribeToMenuUpdates((newRestaurant, newDishes) => {
      skipBroadcastRef.current = true;
      setRestaurant(newRestaurant);
      setDishes(newDishes);
      triggerToast('✨ ¡Menú actualizado en tiempo real!');
    });
  }, []);

  // Single place where the menu is saved and published. Keeping this out of the
  // state updaters means no duplicate broadcasts under StrictMode and no risk
  // of publishing a stale restaurant alongside fresh dishes.
  useEffect(() => {
    if (skipBroadcastRef.current) {
      skipBroadcastRef.current = false;
      persistMenu(restaurant, dishes);
      return;
    }
    broadcastMenuUpdate(restaurant, dishes);
  }, [restaurant, dishes]);

  const handleOpenDishModal = (dish = null, category = 'primeros') => {
    setEditingDish(dish);
    setDefaultCategory(category);
    setIsDishModalOpen(true);
  };

  const handleSaveDish = (dishData) => {
    if (editingDish) {
      setDishes(prev => prev.map(d => (d.id === editingDish.id ? { ...d, ...dishData } : d)));
      triggerToast('Plato actualizado correctamente');
    } else {
      setDishes(prev => [...prev, { id: 'd_' + Date.now(), ...dishData }]);
      triggerToast('Nuevo plato añadido al menú');
    }
  };

  const handleApplyPreset = (preset) => {
    if (preset.fullPrice) {
      setRestaurant(prev => ({ ...prev, fullPrice: preset.fullPrice }));
    }
    setDishes(preset.dishes.map((dish, i) => ({
      id: 'd_preset_' + Date.now() + '_' + i,
      ...dish
    })));
    triggerToast(`Plantilla "${preset.title}" cargada`);
  };

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onShare={() => setIsShareModalOpen(true)} />

      <main className="flex-1">
        <ErrorBoundary>
          {activeTab === 'admin' && (
            <AdminDashboard
              restaurant={restaurant}
              setRestaurant={setRestaurant}
              dishes={dishes}
              setDishes={setDishes}
              onOpenDishModal={handleOpenDishModal}
              onOpenPresetModal={() => setIsPresetModalOpen(true)}
              onOpenShareModal={() => setIsShareModalOpen(true)}
              onShowToast={triggerToast}
            />
          )}

          {activeTab === 'customer' && (
            isDecodingSharedMenu ? (
              <div className="py-24 text-center text-sm font-bold text-slate-400">
                Cargando la carta…
              </div>
            ) : (
              <CustomerMenuView restaurant={restaurant} dishes={dishes} />
            )
          )}

          {activeTab === 'qrstand' && (
            <QrStandGenerator
              restaurant={restaurant}
              dishes={dishes}
              onShowToast={triggerToast}
            />
          )}
        </ErrorBoundary>
      </main>

      <DishFormModal
        isOpen={isDishModalOpen}
        onClose={() => setIsDishModalOpen(false)}
        onSave={handleSaveDish}
        editingDish={editingDish}
        defaultCategory={defaultCategory}
      />

      <PresetSelectorModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onApplyPreset={handleApplyPreset}
      />

      <ShareMenuModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        restaurant={restaurant}
        dishes={dishes}
        onShowToast={triggerToast}
      />

      {toastMessage && (
        <div className="toast-notification no-print font-bold">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
