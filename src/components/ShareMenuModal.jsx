import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, MessageSquare, ExternalLink, QrCode, Sparkles } from 'lucide-react';
import { getPermanentTableQrUrl } from '../utils/syncChannel';
import { generateIsoQrDataUrl } from '../utils/isoQrGenerator';

export default function ShareMenuModal({ isOpen, onClose, restaurant, dishes, onShowToast }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  // Permanent static URL for table QR code (printed once, works forever)
  const permanentUrl = getPermanentTableQrUrl();

  useEffect(() => {
    let isMounted = true;
    async function loadQr() {
      if (!isOpen) return;
      const dataUrl = await generateIsoQrDataUrl(permanentUrl, 300);
      if (isMounted && dataUrl) {
        setQrDataUrl(dataUrl);
      }
    }
    loadQr();
    return () => { isMounted = false; };
  }, [isOpen, permanentUrl]);

  if (!isOpen) return null;

  // Download QR Code PNG
  const downloadQrImage = () => {
    try {
      if (!qrDataUrl) return;
      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = `qr-mesa-pacomer.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (onShowToast) onShowToast('Código QR Fijo para Mesas descargado');
    } catch (e) {
      console.error(e);
    }
  };

  // Copy Permanent Link
  const copyLink = () => {
    try {
      navigator.clipboard.writeText(permanentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
      if (onShowToast) onShowToast('Enlace Fijo de las Mesas copiado');
    } catch (e) {
      if (onShowToast) onShowToast('Error al copiar enlace');
    }
  };

  // Share via WhatsApp
  const shareWhatsApp = () => {
    try {
      let text = `🍷 *MENÚ DEL DÍA - ${(restaurant?.name || 'PACO MER').toUpperCase()}*\n`;
      if (restaurant?.dateFormatted) text += `📅 ${restaurant.dateFormatted}\n`;
      if (restaurant?.fullPrice) text += `💰 *Precio: ${restaurant.fullPrice} €* (${restaurant.includesText || ''})\n\n`;
      text += `📲 *Consulta la carta digital en vivo aquí:*\n${permanentUrl}`;

      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-lg space-y-4" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#00b4d8]" />
              <span>Código QR Fijo para las Mesas</span>
            </h2>
            <p className="text-xs text-slate-500">
              Este QR no cambia nunca. Se imprime una sola vez y se actualiza solo al cambiar la carta.
            </p>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-icon">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Permanent QR Code Container */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="bg-white p-3 rounded-2xl inline-block shadow-md border border-slate-200">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Código QR Fijo Paco Mer"
                className="w-[190px] h-[190px] object-contain block mx-auto"
              />
            ) : (
              <div className="w-[190px] h-[190px] flex items-center justify-center text-xs text-slate-400 font-bold">
                Generando QR Fijo...
              </div>
            )}
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>QR Fijo Único • Sincronización Automática en Vivo</span>
          </div>

          <p className="text-xs text-slate-600 font-medium px-2">
            Imprímelo una vez para tus mesas. Cada vez que el camarero modifique un plato en el panel, se cambiará automáticamente en las pantallas de los clientes.
          </p>

          <div className="flex items-center justify-center pt-1">
            <button
              onClick={downloadQrImage}
              className="btn btn-cyan text-xs font-extrabold shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Descargar QR Fijo (PNG)</span>
            </button>
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="space-y-2">
          <label className="form-label">Difusión Rápida</label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={shareWhatsApp}
              className="btn bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold w-full justify-start px-3 py-2.5 shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enviar por WhatsApp</span>
            </button>

            <button
              onClick={copyLink}
              className="btn btn-secondary text-xs font-semibold w-full justify-start px-3 py-2.5"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace Fijo'}</span>
            </button>
          </div>
        </div>

        {/* Permanent Link Preview */}
        <div className="p-3 bg-white border border-slate-200 rounded-2xl text-xs space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Enlace Fijo de las Mesas:</span>
          <div className="flex items-center justify-between gap-2">
            <input
              type="text"
              readOnly
              value={permanentUrl}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-600 font-mono text-[11px] select-all"
            />
            <a
              href={permanentUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm p-2"
              title="Abrir vista cliente"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
