import React, { useState, useEffect, Component } from 'react';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import CustomerMenuView from './components/CustomerMenuView';
import QrStandGenerator from './components/QrStandGenerator';
import DishFormModal from './components/DishFormModal';
import PresetSelectorModal from './components/PresetSelectorModal';
import ShareMenuModal from './components/ShareMenuModal';
import { INITIAL_RESTAURANT, INITIAL_DISHES } from './data/presetMenus';
import { parseMenuFromCurrentUrl } from './utils/urlEncoder';
import { broadcastMenuUpdate, subscribeToMenuUpdates } from './utils/syncChannel';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Component Error:", error, errorInfo);
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
  const [activeTab, setActiveTab] = useState('admin'); // 'admin', 'customer', 'qrstand'

  // Restaurant State
  const [restaurant, setRestaurant] = useState(() => {
    try {
      const saved = localStorage.getItem('pacomer_live_restaurant');
      return saved ? JSON.parse(saved) : INITIAL_RESTAURANT;
    } catch (e) {
      return INITIAL_RESTAURANT;
    }
  });

  // Dishes State
  const [dishes, setDishes] = useState(() => {
    try {
      const saved = localStorage.getItem('pacomer_live_dishes');
      return saved ? JSON.parse(saved) : INITIAL_DISHES;
    } catch (e) {
      return INITIAL_DISHES;
    }
  });

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState('');
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  // Modals
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [defaultCategory, setDefaultCategory] = useState('primeros');
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Parse URL Hash or check if view tab requested
  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash === '#view' || hash.includes('menu=')) {
        setActiveTab('customer');
      }
      const urlMenu = parseMenuFromCurrentUrl();
      if (urlMenu) {
        if (urlMenu.restaurant) setRestaurant(urlMenu.restaurant);
        if (urlMenu.dishes) setDishes(urlMenu.dishes);
      }
    } catch (e) {
      console.error('Hash parse error:', e);
    }
  }, []);

  // Real-Time HTML5 Cross-Tab Sync (Only trigger on external tab updates)
  useEffect(() => {
    const unsubscribe = subscribeToMenuUpdates((newR, newD) => {
      setRestaurant(newR);
      setDishes(newD);
      triggerToast('✨ ¡Menú actualizado en tiempo real!');
    });
    return () => unsubscribe();
  }, []);

  // Helper to update restaurant state and broadcast
  const updateRestaurant = (updater) => {
    setRestaurant(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      broadcastMenuUpdate(next, dishes);
      return next;
    });
  };

  // Helper to update dishes state and broadcast
  const updateDishes = (updater) => {
    setDishes(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      broadcastMenuUpdate(restaurant, next);
      return next;
    });
  };

  // Toast Trigger
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2500);
  };

  // Open Dish Modal
  const handleOpenDishModal = (dish = null, category = 'primeros') => {
    setEditingDish(dish);
    setDefaultCategory(category);
    setIsDishModalOpen(true);
  };

  // Save Dish
  const handleSaveDish = (dishData) => {
    if (editingDish) {
      updateDishes(prev => prev.map(d => d.id === editingDish.id ? { ...d, ...dishData } : d));
      triggerToast('Plato actualizado correctamente');
    } else {
      const newDish = {
        id: 'd_' + Date.now(),
        ...dishData
      };
      updateDishes(prev => [...prev, newDish]);
      triggerToast('Nuevo plato añadido al menú');
    }
  };

  // Apply Preset Template
  const handleApplyPreset = (preset) => {
    let nextRestaurant = restaurant;
    if (preset.fullPrice) {
      nextRestaurant = { ...restaurant, fullPrice: preset.fullPrice };
      setRestaurant(nextRestaurant);
    }
    const newDishes = preset.dishes.map((dish, i) => ({
      id: 'd_preset_' + Date.now() + '_' + i,
      ...dish
    }));
    setDishes(newDishes);
    broadcastMenuUpdate(nextRestaurant, newDishes);
    triggerToast(`Plantilla "${preset.title}" cargada`);
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCopyShareLink={() => setIsShareModalOpen(true)}
        showCopiedToast={showCopiedToast}
      />

      {/* Main Content Body with Error Boundary Protection */}
      <main className="flex-1">
        <ErrorBoundary>
          {activeTab === 'admin' && (
            <AdminDashboard
              restaurant={restaurant}
              setRestaurant={updateRestaurant}
              dishes={dishes}
              setDishes={updateDishes}
              onOpenDishModal={handleOpenDishModal}
              onOpenPresetModal={() => setIsPresetModalOpen(true)}
              onOpenShareModal={() => setIsShareModalOpen(true)}
              onShowToast={triggerToast}
            />
          )}

          {activeTab === 'customer' && (
            <CustomerMenuView
              restaurant={restaurant}
              dishes={dishes}
            />
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

      {/* Modals */}
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

      {/* Toast Notification Floating Banner */}
      {toastMessage && (
        <div className="toast-notification font-bold">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
