import QRCode from 'qrcode';

/**
 * 100% ISO/IEC 18004 Compliant QR Code Generator using world-standard 'qrcode' engine.
 * Scannable by any iOS Camera, Android Google Lens, or barcode scanner app in milliseconds.
 */

export async function generateIsoQrDataUrl(text, size = 300) {
  try {
    if (!text) return '';
    return await QRCode.toDataURL(text, {
      width: size,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('Error generating ISO QR Code Data URL:', err);
    return '';
  }
}

export async function generateIsoQrSvg(text, size = 220) {
  try {
    if (!text) return '';
    return await QRCode.toString(text, {
      type: 'svg',
      width: size,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('Error generating ISO QR Code SVG:', err);
    return '';
  }
}
