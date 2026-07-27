import React, { useState } from 'react';
import { Printer, Copy, Check, QrCode, Download, AlertTriangle } from 'lucide-react';
import { useMenuQr } from '../hooks/useMenuQr';
import { copyToClipboard } from '../utils/clipboard';

export default function QrStandGenerator({ restaurant, dishes, onShowToast }) {
  const [copied, setCopied] = useState(false);
  const { shareUrl, qrDataUrl, isTooLong } = useMenuQr(restaurant, dishes);

  const isReady = Boolean(shareUrl) && !isTooLong;

  const copyUrl = async () => {
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
    if (onShowToast) onShowToast(ok ? 'Enlace de la carta copiado' : 'No se pudo copiar el enlace');
  };

  const downloadQrImage = () => {
    if (!qrDataUrl) return;
    const slug = (restaurant?.name || 'pacomer').toLowerCase().replace(/\s+/g, '-');
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `cartel-qr-${slug}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onShowToast) onShowToast('Imagen del QR descargada');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Actions */}
      <div className="meson-card p-5 no-print flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#8B2320]" />
            <span>Cartel de Mesa con la Carta</span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5 font-medium">
            El QR lleva la carta dentro, así que cualquier cliente la ve al escanearlo.
            Vuelve a imprimirlo cuando cambies el menú.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={downloadQrImage} disabled={!isReady} className="btn btn-secondary text-xs font-semibold">
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>Descargar PNG</span>
          </button>

          <button onClick={copyUrl} disabled={!isReady} className="btn btn-secondary text-xs font-semibold">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '¡Copiado!' : 'Copiar Enlace'}</span>
          </button>

          <button onClick={() => window.print()} disabled={!isReady} className="btn btn-meson text-xs font-bold shadow-md">
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Cartel (PDF)</span>
          </button>
        </div>
      </div>

      {isTooLong && (
        <div className="no-print flex items-start gap-2 p-4 rounded-2xl bg-amber-50 border border-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 font-semibold">
            La carta ocupa demasiado para caber en un código QR. Acorta las descripciones de los platos
            o reduce el número de platos para poder imprimir el cartel.
          </p>
        </div>
      )}

      {/* Printable poster */}
      <div className="printable-area flex justify-center py-4">
        <div className="w-full max-w-sm p-8 bg-white border-2 border-stone-900 rounded-3xl text-center shadow-lg space-y-6">
          <div className="space-y-1 pb-4 border-b border-stone-200">
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              {restaurant?.name || 'Mesón Paco Mer'}
            </h2>
            <p className="text-[11px] font-extrabold text-[#8B2320] uppercase tracking-widest">
              MENÚ DEL DÍA
            </p>
          </div>

          <div className="my-4 flex justify-center">
            <div className="p-3 bg-white border border-stone-200 rounded-2xl inline-block shadow-md">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Código QR de la carta"
                  className="poster-qr w-[240px] h-[240px] object-contain block mx-auto"
                />
              ) : (
                <div className="w-[220px] h-[220px] flex items-center justify-center text-center px-4 text-xs text-stone-400 font-bold">
                  {isTooLong ? 'La carta no cabe en un QR' : 'Generando QR…'}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-bold text-xs text-stone-800 leading-snug px-2">
              📱 Escanea este código con la cámara de tu teléfono para ver el Menú de Hoy.
            </p>

            <div className="inline-block px-4 py-1.5 rounded-full bg-[#FBEDEC] text-[#8B2320] text-xs font-extrabold border border-[#F5D6D4]">
              Menú Completo: {restaurant?.fullPrice || '13.50'} {restaurant?.currency || '€'}
            </div>

            {restaurant?.includesText && (
              <p className="text-[11px] text-stone-500 font-medium">
                ✨ {restaurant.includesText}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
