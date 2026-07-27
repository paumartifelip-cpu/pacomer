import React from 'react';
import {
  ArrowRight, Printer, PhoneOff, AlertCircle,
  PencilLine, QrCode, Smartphone, Check, X
} from 'lucide-react';
import bannerUrl from '../assets/paco-mer-banner.jpg';

const PROBLEMAS = [
  {
    icon: Printer,
    title: 'Imprimes cartas cada mañana',
    text: 'El menú cambia a diario, así que cada día vuelves a imprimir, recortar y repartir por las mesas.'
  },
  {
    icon: PhoneOff,
    title: 'Se acaba un plato y hay que ir mesa por mesa',
    text: 'Cuando se termina el guiso, o lo tachas a boli o lo vas avisando uno por uno.'
  },
  {
    icon: AlertCircle,
    title: 'Los alérgenos, otra vez de memoria',
    text: 'Cada mesa pregunta qué lleva cada plato y siempre acaba respondiendo el camarero.'
  }
];

const TRANSFORMACION = [
  { antes: 'Imprimir cartas nuevas cada día', ahora: 'Escribes el menú una vez, en 2 minutos' },
  { antes: 'Tachar a boli lo que se ha acabado', ahora: 'Un toque y el plato aparece "Agotado"' },
  { antes: 'Explicar los alérgenos mesa por mesa', ahora: 'Cada plato muestra sus alérgenos' },
  { antes: 'Cartas manchadas y gastadas', ahora: 'Un QR en la mesa, siempre impecable' }
];

const PASOS = [
  { icon: PencilLine, title: 'Escribes el menú', text: 'Añades los platos del día desde el móvil o el ordenador.' },
  { icon: QrCode, title: 'Se genera el QR', text: 'La carta viaja dentro del propio código. Sin servidores ni cuotas.' },
  { icon: Smartphone, title: 'El cliente lo escanea', text: 'Ve la carta al momento en su teléfono, con precios y alérgenos.' }
];

export default function LandingPage({ onEnter }) {
  return (
    <div className="min-h-screen azulejo-bg">
      {/* ---------------------------------------------------------- Hero */}
      <header className="max-w-5xl mx-auto px-4 pt-6 sm:pt-10">
        <img
          src={bannerUrl}
          alt="Paco Mer, cocina tradicional"
          className="w-full rounded-3xl shadow-xl border-4 border-[#FBF3DE]"
          width="1600"
          height="900"
        />

        <div className="text-center mt-8 space-y-4">
          <h1 className="rotulo text-4xl sm:text-6xl">
            El menú del día,<br />en el móvil de tus clientes
          </h1>

          <p className="max-w-xl mx-auto text-base sm:text-lg font-semibold text-[#5E4436]">
            Escribes la carta una vez. Tus clientes la leen escaneando un código QR.
            Sin imprimir nada, sin cuotas y sin complicaciones.
          </p>

          <div className="pt-2">
            <button
              onClick={onEnter}
              className="btn btn-primary text-base sm:text-lg px-8 py-4 font-display"
            >
              <span>Entrar a la app</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-[#8A7563] font-semibold mt-3">
              Gratis · No necesitas registrarte
            </p>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------ Problema */}
      <section className="max-w-5xl mx-auto px-4 py-14 sm:py-20">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1 rounded-full bg-[#8B2320] text-[#FFF8EA] text-xs font-extrabold uppercase tracking-wider">
            El problema
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3A2A20] mt-4">
            Cada día, la misma rutina
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PROBLEMAS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="meson-card p-6 space-y-3">
              <div className="w-11 h-11 rounded-full bg-[#FBEDEC] flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#8B2320]" />
              </div>
              <h3 className="font-extrabold text-[#3A2A20] text-base leading-snug">{title}</h3>
              <p className="text-sm text-[#8A7563] font-medium leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ Transformación */}
      <section className="bg-[#8B2320] py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 rounded-full bg-[#FFF8EA] text-[#8B2320] text-xs font-extrabold uppercase tracking-wider">
              La solución
            </span>
            <h2 className="rotulo rotulo-sm text-3xl sm:text-4xl mt-4">
              Lo que cambia en tu bar
            </h2>
          </div>

          <div className="space-y-3">
            {TRANSFORMACION.map(({ antes, ahora }) => (
              <div
                key={antes}
                className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4 bg-[#FFFBF2] rounded-2xl p-4 shadow-md"
              >
                <div className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-[#A8322E] shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-[#8A7563] line-through decoration-[#D07C77]">
                    {antes}
                  </span>
                </div>

                <ArrowRight className="hidden sm:block w-5 h-5 text-[#C87137] shrink-0" />

                <div className="flex items-start gap-2.5 sm:border-l sm:border-[#E8D9BC] sm:pl-4">
                  <Check className="w-4 h-4 text-[#6B7F47] shrink-0 mt-0.5" />
                  <span className="text-sm font-extrabold text-[#3A2A20]">{ahora}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- Cómo va */}
      <section className="max-w-5xl mx-auto px-4 py-14 sm:py-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3A2A20]">
            Tres pasos y ya está
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PASOS.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="meson-card p-6 text-center space-y-3">
              <div className="relative w-14 h-14 mx-auto">
                <div className="w-14 h-14 rounded-full bg-[#8B2320] flex items-center justify-center shadow-md">
                  <Icon className="w-6 h-6 text-[#FFF8EA]" />
                </div>
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#C87137] text-[#FFF8EA] text-xs font-extrabold flex items-center justify-center border-2 border-[#FFFBF2]">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-extrabold text-[#3A2A20] text-base">{title}</h3>
              <p className="text-sm text-[#8A7563] font-medium leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------ CTA final */}
      <section className="max-w-3xl mx-auto px-4 pb-16 sm:pb-24">
        <div className="hero-meson rounded-3xl p-8 sm:p-12 text-center space-y-5">
          <h2 className="rotulo rotulo-sm text-3xl sm:text-4xl">
            ¿Preparamos la carta de hoy?
          </h2>
          <p className="text-[#FFF8EA]/90 font-semibold max-w-md mx-auto">
            Empiezas con un menú de ejemplo y lo cambias por el tuyo. Se guarda solo.
          </p>
          <button onClick={onEnter} className="btn-hero-white inline-flex items-center gap-2 text-base">
            <span>Entrar a la app</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <div className="mantel h-4 w-full" />

      <footer className="py-6 text-center text-xs text-[#8A7563] font-semibold">
        Paco Mer · Menú del día digital
      </footer>
    </div>
  );
}
