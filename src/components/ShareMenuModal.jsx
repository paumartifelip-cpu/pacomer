import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, MessageSquare, ExternalLink, QrCode, Sparkles, AlertTriangle } from 'lucide-react';
import { useMenuQr } from '../hooks/useMenuQr';
import { copyToClipboard } from '../utils/clipboard';

export default function ShareMenuModal({ isOpen, onClose, restaurant, dishes, onShowToast }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const { shareUrl, qrDataUrl, isTooLong } = useMenuQr(restaurant, dishes, isOpen);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const downloadQrImage = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = 'qr-carta-pacomer.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onShowToast) onShowToast('Código QR de la carta descargado');
  };

  const copyLink = async () => {
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
    if (onShowToast) onShowToast(ok ? 'Enlace de la carta copiado' : 'No se pudo copiar el enlace');
  };

  const shareWhatsApp = () => {
    // Today's date, not the one stored when the menu was first created.
    const today = new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

    let text = `🍷 *MENÚ DEL DÍA - ${(restaurant?.name || 'PACO MER').toUpperCase()}*\n`;
    text += `📅 ${today}\n`;
    if (restaurant?.fullPrice) {
      text += `💰 *Precio: ${restaurant.fullPrice} €*${restaurant.includesText ? ` (${restaurant.includesText})` : ''}\n\n`;
    }
    text += `📲 *Consulta la carta completa aquí:*\n${shareUrl}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  const isReady = Boolean(shareUrl) && !isTooLong;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-lg space-y-4" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-200">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#8B2320]" />
              <span>Compartir la Carta</span>
            </h2>
            <p className="text-xs text-stone-500">
              El QR y el enlace llevan la carta dentro: funcionan en cualquier móvil, sin internet del restaurante.
            </p>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-icon shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR */}
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-center space-y-3">
          <div className="bg-white p-3 rounded-2xl inline-block shadow-md border border-stone-200">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Código QR de la carta"
                className="w-[190px] h-[190px] object-contain block mx-auto"
              />
            ) : (
              <div className="w-[190px] h-[190px] flex items-center justify-center text-center text-xs text-stone-400 font-bold px-3">
                {isTooLong ? 'La carta es demasiado larga para un QR' : 'Generando QR…'}
              </div>
            )}
          </div>

          {isTooLong ? (
            <div className="flex items-start gap-2 text-left px-2 py-2 rounded-xl bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 font-semibold">
                La carta ocupa demasiado para caber en un código QR. Acorta las descripciones de los platos
                o reduce el número de platos y el QR volverá a generarse.
              </p>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Carta incluida en el código • Sin servidor</span>
            </div>
          )}

          <p className="text-xs text-stone-600 font-medium px-2">
            Cada vez que cambies un plato se genera un QR nuevo. Vuelve a imprimirlo o a enviarlo
            para que tus clientes vean la carta actualizada.
          </p>

          <div className="flex items-center justify-center pt-1">
            <button
              onClick={downloadQrImage}
              disabled={!isReady}
              className="btn btn-meson text-xs font-extrabold shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Descargar QR (PNG)</span>
            </button>
          </div>
        </div>

        {/* Share actions */}
        <div className="space-y-2">
          <label className="form-label">Difusión Rápida</label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={shareWhatsApp}
              disabled={!isReady}
              className="btn bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold w-full justify-start px-3 py-2.5 shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enviar por WhatsApp</span>
            </button>

            <button
              onClick={copyLink}
              disabled={!isReady}
              className="btn btn-secondary text-xs font-semibold w-full justify-start px-3 py-2.5"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-600" />}
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
            </button>
          </div>
        </div>

        {/* Link preview */}
        <div className="p-3 bg-white border border-stone-200 rounded-2xl text-xs space-y-1">
          <span className="text-stone-400 font-bold uppercase text-[10px]">Enlace de la carta:</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              onFocus={e => e.target.select()}
              className="w-full min-w-0 bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-stone-600 font-mono text-[11px]"
            />
            {isReady && (
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm p-2 shrink-0"
                title="Abrir la vista del cliente"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
