import { useState, useEffect } from 'react';
import { getShareableMenuUrl } from '../utils/urlEncoder';
import { generateIsoQrDataUrl } from '../utils/isoQrGenerator';

/**
 * Builds the self-contained share link for the current menu and its QR image.
 * Both are rebuilt whenever the menu changes, so what is on screen is always
 * what a customer would scan.
 */
export function useMenuQr(restaurant, dishes, enabled = true) {
  const [shareUrl, setShareUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isTooLong, setIsTooLong] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;

    let alive = true;
    (async () => {
      const url = await getShareableMenuUrl({ restaurant, dishes });
      if (!alive) return;
      setShareUrl(url);

      const image = await generateIsoQrDataUrl(url, 600);
      if (!alive) return;
      setQrDataUrl(image);
      setIsTooLong(!image);
    })();

    return () => { alive = false; };
  }, [restaurant, dishes, enabled]);

  return { shareUrl, qrDataUrl, isTooLong };
}
