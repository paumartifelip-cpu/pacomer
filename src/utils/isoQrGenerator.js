import QRCode from 'qrcode';

/**
 * ISO/IEC 18004 QR codes via the standard 'qrcode' engine, so any phone camera
 * reads them. Long menus need more capacity than error-correction level M
 * allows, so we retry at L before giving up.
 */

const LEVELS = ['M', 'L'];

export async function generateIsoQrDataUrl(text, size = 600) {
  if (!text) return '';

  for (const errorCorrectionLevel of LEVELS) {
    try {
      return await QRCode.toDataURL(text, {
        width: size,
        margin: 1,
        errorCorrectionLevel,
        color: { dark: '#0f172a', light: '#ffffff' }
      });
    } catch (err) {
      /* too much data for this level, try the next one */
    }
  }

  console.error('Menu URL is too long to fit in a QR code:', text.length, 'chars');
  return '';
}
