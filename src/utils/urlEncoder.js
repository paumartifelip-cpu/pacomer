/**
 * Robust URL encoder & decoder with fallback protection against data corruption.
 */

export function encodeMenuToUrl(menuData) {
  try {
    if (!menuData) return null;
    const compactData = {
      r: {
        n: (menuData.restaurant?.name || 'Mesón El Candil').trim(),
        p: (menuData.restaurant?.fullPrice || '13.50').trim(),
        i: (menuData.restaurant?.includesText || '').trim(),
        ph: (menuData.restaurant?.phone || '').trim()
      },
      d: (menuData.dishes || []).map(d => ({
        c: d.category || 'primeros',
        n: (d.name || '').trim(),
        ds: (d.description || '').trim(),
        s: String(d.supplement || '0'),
        a: d.isAvailable !== false ? 1 : 0,
        e: d.isChefSpecial ? 1 : 0,
        al: Array.isArray(d.allergens) ? d.allergens : []
      }))
    };

    const jsonStr = JSON.stringify(compactData);
    const encoded = encodeURIComponent(jsonStr);
    return btoa(encoded);
  } catch (err) {
    console.error('Error encoding menu data:', err);
    return null;
  }
}

export function decodeMenuFromUrl(encodedStr) {
  try {
    if (!encodedStr || typeof encodedStr !== 'string') return null;
    const decoded = decodeURIComponent(atob(encodedStr.trim()));
    const compact = JSON.parse(decoded);

    if (compact && compact.r && Array.isArray(compact.d)) {
      return {
        restaurant: {
          name: compact.r.n || 'Mesón El Candil',
          fullPrice: compact.r.p || '13.50',
          includesText: compact.r.i || 'Incluye Pan, 1 Bebida y Postre/Café',
          phone: compact.r.ph || '',
          currency: '€',
          dateFormatted: new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
        },
        dishes: compact.d.map((d, index) => ({
          id: 'd_url_' + index + '_' + Date.now(),
          category: d.c || 'primeros',
          name: d.n || 'Plato',
          description: d.ds || '',
          supplement: d.s || '0.00',
          isAvailable: d.a === 1,
          isChefSpecial: d.e === 1,
          allergens: Array.isArray(d.al) ? d.al : []
        }))
      };
    }
    return null;
  } catch (err) {
    console.error('Error decoding menu data:', err);
    return null;
  }
}

export function getShareableMenuUrl(menuData) {
  try {
    const encoded = encodeMenuToUrl(menuData);
    const baseUrl = window.location.origin + window.location.pathname;
    if (encoded) {
      return `${baseUrl}#menu=${encoded}`;
    }
    return baseUrl;
  } catch (e) {
    return window.location.href;
  }
}

export function parseMenuFromCurrentUrl() {
  try {
    const hash = window.location.hash;
    if (hash && hash.includes('menu=')) {
      const encoded = hash.split('menu=')[1];
      return decodeMenuFromUrl(encoded);
    }
  } catch (e) {
    console.error('Error parsing hash:', e);
  }
  return null;
}
