/**
 * HTML5 Real-Time Sync Channel for Paco Mer
 * Connects the Waiter/Admin Panel with the Customer Table QR View in real-time
 * without causing infinite loop flickers.
 */

const SYNC_CHANNEL_NAME = 'pacomer_live_menu_sync';

// Generate a unique ID for the current browser tab to avoid self-broadcast loops
const MY_CLIENT_ID = 'client_' + Math.random().toString(36).substring(2, 9);

// Broadcast menu updates from Waiter Panel to all active Customer Tabs/Views
export function broadcastMenuUpdate(restaurant, dishes) {
  try {
    const payload = {
      restaurant,
      dishes,
      senderId: MY_CLIENT_ID,
      timestamp: Date.now()
    };
    
    // Save to LocalStorage
    localStorage.setItem('pacomer_live_restaurant', JSON.stringify(restaurant));
    localStorage.setItem('pacomer_live_dishes', JSON.stringify(dishes));
    localStorage.setItem('pacomer_last_update', JSON.stringify({ senderId: MY_CLIENT_ID, time: Date.now() }));

    // Broadcast across browser tabs via BroadcastChannel
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.postMessage(payload);
      channel.close();
    }
  } catch (e) {
    console.error('Error broadcasting menu update:', e);
  }
}

// Listen for live menu updates in the Customer QR View
export function subscribeToMenuUpdates(onUpdate) {
  let channel = null;

  const handlePayload = (payload) => {
    // IGNORE self-broadcast messages to prevent infinite re-render loop!
    if (!payload || payload.senderId === MY_CLIENT_ID) {
      return;
    }

    if (payload.restaurant && payload.dishes) {
      onUpdate(payload.restaurant, payload.dishes);
    }
  };

  // 1. Listen via BroadcastChannel
  if ('BroadcastChannel' in window) {
    try {
      channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.onmessage = (event) => {
        handlePayload(event.data);
      };
    } catch (e) {
      console.error(e);
    }
  }

  // 2. Listen via LocalStorage window event
  const storageListener = (e) => {
    if (e.key === 'pacomer_last_update') {
      try {
        const updateInfo = JSON.parse(e.newValue);
        if (updateInfo && updateInfo.senderId !== MY_CLIENT_ID) {
          const r = JSON.parse(localStorage.getItem('pacomer_live_restaurant'));
          const d = JSON.parse(localStorage.getItem('pacomer_live_dishes'));
          if (r && d) {
            handlePayload({ restaurant: r, dishes: d, senderId: updateInfo.senderId });
          }
        }
      } catch (err) {}
    }
  };

  window.addEventListener('storage', storageListener);

  return () => {
    if (channel) {
      try { channel.close(); } catch (e) {}
    }
    window.removeEventListener('storage', storageListener);
  };
}

// Fixed Permanent Table QR URL
export function getPermanentTableQrUrl() {
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#view`;
}
