/**
 * Encodes the whole menu inside the URL fragment so a shared link / QR code is
 * self-contained: any phone that opens it sees the real menu, with no server.
 *
 * Payload format:  #menu=<version><base64url>
 *   version '1' -> raw DEFLATE compressed UTF-8 JSON  (default)
 *   version '0' -> plain UTF-8 JSON                   (browsers without CompressionStream)
 * Links produced by older builds (plain base64 of an encodeURIComponent'd JSON,
 * no version prefix) are still decoded, so already-printed links keep working.
 *
 * Compression matters: the uncompressed form of the default menu is ~4.100
 * characters, which exceeds the capacity of every QR code version. Compressed
 * it is ~1.100, which fits comfortably.
 */

const VERSION_DEFLATE = '1';
const VERSION_PLAIN = '0';

/* ------------------------------------------------------------------ base64 */

function bytesToBase64Url(bytes) {
  let binary = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(str) {
  const normalized = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/* ------------------------------------------------------------- compression */

async function deflate(bytes) {
  if (typeof CompressionStream === 'undefined') return null;
  try {
    const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  } catch (e) {
    return null;
  }
}

async function inflate(bytes) {
  if (typeof DecompressionStream === 'undefined') return null;
  try {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  } catch (e) {
    return null;
  }
}

/* ------------------------------------------------------ compact menu shape */

function toCompact(menuData) {
  const r = menuData?.restaurant || {};
  return {
    r: {
      n: (r.name || 'Menú del Día').trim(),
      p: String(r.fullPrice ?? '13.50').trim(),
      h: String(r.halfPrice ?? '').trim(),
      i: (r.includesText || '').trim(),
      ph: (r.phone || '').trim(),
      ic: r.icon || '🍷'
    },
    d: (menuData?.dishes || []).map(d => ({
      c: d.category || 'primeros',
      n: (d.name || '').trim(),
      ds: (d.description || '').trim(),
      s: String(d.supplement ?? '0'),
      a: d.isAvailable !== false ? 1 : 0,
      e: d.isChefSpecial ? 1 : 0,
      al: Array.isArray(d.allergens) ? d.allergens : []
    }))
  };
}

function fromCompact(compact) {
  if (!compact || !compact.r || !Array.isArray(compact.d)) return null;
  return {
    restaurant: {
      name: compact.r.n || 'Menú del Día',
      fullPrice: compact.r.p || '13.50',
      halfPrice: compact.r.h || '',
      includesText: compact.r.i || '',
      phone: compact.r.ph || '',
      icon: compact.r.ic || '🍷',
      currency: '€',
      dateFormatted: new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      })
    },
    dishes: compact.d.map((d, index) => ({
      id: 'd_url_' + index,
      category: d.c || 'primeros',
      name: d.n || 'Plato',
      description: d.ds || '',
      supplement: d.s || '0.00',
      isAvailable: d.a !== 0,
      isChefSpecial: d.e === 1,
      allergens: Array.isArray(d.al) ? d.al : []
    }))
  };
}

/* -------------------------------------------------------- encode / decode */

export async function encodeMenuToPayload(menuData) {
  try {
    if (!menuData) return null;
    const json = JSON.stringify(toCompact(menuData));
    const raw = new TextEncoder().encode(json);

    const compressed = await deflate(raw);
    if (compressed) return VERSION_DEFLATE + bytesToBase64Url(compressed);
    return VERSION_PLAIN + bytesToBase64Url(raw);
  } catch (err) {
    console.error('Error encoding menu data:', err);
    return null;
  }
}

export async function decodeMenuFromPayload(payload) {
  try {
    if (!payload || typeof payload !== 'string') return null;
    const trimmed = payload.trim();
    const version = trimmed[0];
    const body = trimmed.slice(1);

    if (version === VERSION_DEFLATE) {
      const inflated = await inflate(base64UrlToBytes(body));
      if (!inflated) return null;
      return fromCompact(JSON.parse(new TextDecoder().decode(inflated)));
    }

    if (version === VERSION_PLAIN) {
      return fromCompact(JSON.parse(new TextDecoder().decode(base64UrlToBytes(body))));
    }

    // Legacy links: base64( encodeURIComponent( json ) ), no version prefix.
    return fromCompact(JSON.parse(decodeURIComponent(atob(trimmed))));
  } catch (err) {
    console.error('Error decoding menu data:', err);
    return null;
  }
}

/** Base URL of the app, without hash or query. */
export function getAppBaseUrl() {
  return window.location.origin + window.location.pathname;
}

/** Shareable link with the full menu embedded. Works on any device, offline. */
export async function getShareableMenuUrl(menuData) {
  const payload = await encodeMenuToPayload(menuData);
  const baseUrl = getAppBaseUrl();
  return payload ? `${baseUrl}#menu=${payload}` : baseUrl;
}

/** True when the current URL carries a shared menu, checked before first paint. */
export function currentUrlHasMenu() {
  try {
    return window.location.hash.includes('menu=');
  } catch (e) {
    return false;
  }
}

export async function parseMenuFromCurrentUrl() {
  try {
    const hash = window.location.hash;
    if (hash && hash.includes('menu=')) {
      return await decodeMenuFromPayload(hash.split('menu=')[1]);
    }
  } catch (e) {
    console.error('Error parsing hash:', e);
  }
  return null;
}
