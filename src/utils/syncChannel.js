/**
 * Live sync between tabs/windows of the SAME browser (waiter panel <-> preview
 * or customer view opened on the same device). Cross-device sharing does not go
 * through here: it travels inside the link itself, see utils/urlEncoder.js.
 */

const SYNC_CHANNEL_NAME = 'pacomer_live_menu_sync';
const KEY_RESTAURANT = 'pacomer_live_restaurant';
const KEY_DISHES = 'pacomer_live_dishes';
const KEY_STAMP = 'pacomer_last_update';

// Unique id for this tab, so we ignore the echo of our own broadcasts.
const MY_CLIENT_ID = 'client_' + Math.random().toString(36).substring(2, 9);

/** Read the menu saved by a previous session, or null. */
export function loadPersistedMenu() {
  try {
    const restaurant = JSON.parse(localStorage.getItem(KEY_RESTAURANT) || 'null');
    const dishes = JSON.parse(localStorage.getItem(KEY_DISHES) || 'null');
    return { restaurant, dishes: Array.isArray(dishes) ? dishes : null };
  } catch (e) {
    return { restaurant: null, dishes: null };
  }
}

/** Save locally without notifying other tabs (used for remote/incoming state). */
export function persistMenu(restaurant, dishes) {
  try {
    localStorage.setItem(KEY_RESTAURANT, JSON.stringify(restaurant));
    localStorage.setItem(KEY_DISHES, JSON.stringify(dishes));
  } catch (e) {
    console.error('Error saving menu locally:', e);
  }
}

/** Save locally AND push the change to every other tab of this browser. */
export function broadcastMenuUpdate(restaurant, dishes) {
  persistMenu(restaurant, dishes);
  try {
    localStorage.setItem(
      KEY_STAMP,
      JSON.stringify({ senderId: MY_CLIENT_ID, time: Date.now() })
    );

    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.postMessage({ restaurant, dishes, senderId: MY_CLIENT_ID });
      channel.close();
    }
  } catch (e) {
    console.error('Error broadcasting menu update:', e);
  }
}

/** Subscribe to menu changes made in other tabs. Returns an unsubscribe fn. */
export function subscribeToMenuUpdates(onUpdate) {
  let channel = null;

  const handlePayload = (payload) => {
    // Ignore our own echo, otherwise the tabs would loop forever.
    if (!payload || payload.senderId === MY_CLIENT_ID) return;
    if (payload.restaurant && Array.isArray(payload.dishes)) {
      onUpdate(payload.restaurant, payload.dishes);
    }
  };

  if ('BroadcastChannel' in window) {
    try {
      channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.onmessage = (event) => handlePayload(event.data);
    } catch (e) {
      console.error('BroadcastChannel unavailable:', e);
    }
  }

  // Fallback for browsers without BroadcastChannel (and for cross-window sync).
  const storageListener = (e) => {
    if (e.key !== KEY_STAMP) return;
    try {
      const stamp = JSON.parse(e.newValue);
      if (!stamp || stamp.senderId === MY_CLIENT_ID) return;
      const { restaurant, dishes } = loadPersistedMenu();
      if (restaurant && dishes) {
        handlePayload({ restaurant, dishes, senderId: stamp.senderId });
      }
    } catch (err) {
      /* ignore malformed payloads */
    }
  };

  window.addEventListener('storage', storageListener);

  return () => {
    if (channel) {
      try { channel.close(); } catch (e) { /* already closed */ }
    }
    window.removeEventListener('storage', storageListener);
  };
}
