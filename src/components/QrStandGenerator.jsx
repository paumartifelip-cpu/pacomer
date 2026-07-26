import React, { useState, useEffect } from 'react';
import { Printer, Copy, Check, QrCode, Download, Sparkles } from 'lucide-react';
import { getPermanentTableQrUrl } from '../utils/syncChannel';
import { generateIsoQrDataUrl } from '../utils/isoQrGenerator';

export default function QrStandGenerator({ restaurant, dishes, onShowToast }) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  // Permanent static URL for table QR code
  const permanentUrl = getPermanentTableQrUrl();

  // Load scannable ISO QR code
  useEffect(() => {
    let isMounted = true;
    async function loadQr() {
      const url = await generateIsoQrDataUrl(permanentUrl, 300);
      if (isMounted && url) {
        setQrDataUrl(url);
      }
    }
    loadQr();
    return () => { isMounted = false; };
  }, [permanentUrl]);

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.error(e);
    }
  };

  const copyUrl = () => {
    try {
      navigator.clipboard.writeText(permanentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      if (onShowToast) onShowToast('Enlace fijo copiado al portapapeles');
    } catch (e) {
      if (onShowToast) onShowToast('Error al copiar');
    }
  };

  const downloadQrImage = () => {
    try {
      if (!qrDataUrl) return;
      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = `cartel-qr-fijo-${(restaurant?.name || 'pacomer').toLowerCase().replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (onShowToast) onShowToast('Imagen QR Fijo descargada correctamente');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Action Header */}
      <div className="fintech-card p-5 no-print flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#00b4d8]" />
            <span>Impresión de Cartel para Mesa (QR Fijo)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Este código QR se imprime una sola vez para las mesas. Se actualiza solo cuando el camarero cambia el menú.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={downloadQrImage} className="btn btn-secondary text-xs font-semibold">
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Descargar PNG</span>
          </button>

          <button onClick={copyUrl} className="btn btn-secondary text-xs font-semibold">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '¡Copiado!' : 'Copiar Enlace'}</span>
          </button>

          <button onClick={handlePrint} className="btn btn-cyan text-xs font-bold shadow-md">
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Cartel (PDF)</span>
          </button>
        </div>
      </div>

      {/* Printable Poster Container */}
      <div className="printable-area flex justify-center py-4">
        <div className="w-full max-w-sm p-8 bg-white border-2 border-slate-900 rounded-3xl text-center shadow-lg space-y-6">
          {/* Header */}
          <div className="space-y-1 pb-4 border-b border-slate-200">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {restaurant?.name || 'Mesón Paco Mer'}
            </h2>
            <p className="text-[11px] font-extrabold text-[#00b4d8] uppercase tracking-widest">
              MENÚ DEL DÍA
            </p>
          </div>

          {/* Scannable ISO QR Code */}
          <div className="my-4 flex justify-center">
            <div className="p-3 bg-white border border-slate-200 rounded-2xl inline-block shadow-md">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Código QR del Menú Escaneable"
                  className="w-[200px] h-[200px] object-contain block mx-auto"
                />
              ) : (
                <div className="w-[200px] h-[200px] flex items-center justify-center text-xs text-slate-400 font-bold">
                  Generando QR Fijo...
                </div>
              )}
            </div>
          </div>

          {/* Customer Instruction & Price */}
          <div className="space-y-3">
            <p className="font-bold text-xs text-slate-800 leading-snug px-2">
              📱 Escanea este código QR con la cámara de tu teléfono para consultar el Menú de Hoy.
            </p>

            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#00b4d8] text-xs font-extrabold border border-blue-100">
              Menú Completo: {restaurant?.fullPrice || '13.50'} {restaurant?.currency || '€'}
            </div>

            {restaurant?.includesText && (
              <p className="text-[11px] text-slate-500 font-medium">
                ✨ {restaurant.includesText}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
