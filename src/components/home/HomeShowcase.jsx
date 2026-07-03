import React from 'react';
import { Sparkles, Shield, Droplets, Trophy, ArrowRight, CheckCircle2, Clock, Star } from 'lucide-react';

export default function HomeShowcase({ onSelectBooking, onSelectCatalog, onSelectAI }) {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col justify-between pb-16 md:pb-8">
      {/* Main Hero Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-14 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        
        {/* Left Copy Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DC1B46]/10 border border-[#DC1B46]/25 text-[#DC1B46] dark:text-rose-400 text-xs md:text-sm font-bold">
            <Sparkles className="w-4 h-4 text-[#DC1B46] animate-spin" />
            <span>Centro Estético Vehicular & Detallado Ecológico</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
            Tu Auto Merece un Brillo <br />
            <span className="text-[#DC1B46]">
              Nivel Showroom 0km
            </span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl max-w-2xl leading-relaxed font-normal">
            Tecnología de detallado premium al alcance de un clic. Combinamos higienización a vapor profunda, pulido espejo correctivo y lavado ecológico que ahorra un <span className="text-[#DC1B46] font-bold">90% de agua</span>.
          </p>

          {/* Key Value Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-[#DC1B46] flex-shrink-0" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Precios transparentes garantizados</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <Clock className="w-5 h-5 text-[#DC1B46] flex-shrink-0" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Reserva con bloqueo online al instante</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onSelectBooking}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#DC1B46] hover:bg-[#b81438] text-white font-extrabold text-base shadow-xl shadow-[#DC1B46]/25 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <span>Reservar Turno Ahora</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onSelectCatalog}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-[#DC1B46] text-slate-800 dark:text-slate-200 hover:text-[#DC1B46] dark:hover:text-white font-bold text-base transition-all duration-200 cursor-pointer shadow-sm"
            >
              <span>Ver Catálogo ($18.000 - $85.000)</span>
            </button>
          </div>
        </div>

        {/* Right Visual Showcase / Stats Cards */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card 1: Water saved */}
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-[#DC1B46]/10 border border-[#DC1B46]/20 flex items-center justify-center mb-4">
              <Droplets className="w-6 h-6 text-[#DC1B46]" />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">+12,500 L</div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Agua potable preservada este mes gracias al lavado ecológico seco.</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-[#DC1B46] font-bold">
              <span>Compromiso Ambiental</span>
              <span>100% Eco</span>
            </div>
          </div>

          {/* Card 2: 5 Star Ratings */}
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">4.9 / 5.0</div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Calificación promedio de +850 clientes satisfechos en Google.</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-bold">
              <span>Calidad Garantizada</span>
              <span>Top Detailing</span>
            </div>
          </div>

          {/* Card 3: AI Assistant Prompt banner */}
          <div 
            onClick={onSelectAI}
            className="sm:col-span-2 glass-card p-6 rounded-3xl border border-[#DC1B46]/30 hover:border-[#DC1B46] cursor-pointer transition-all flex items-center justify-between gap-4 group shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#DC1B46] flex items-center justify-center text-white shadow-lg shadow-[#DC1B46]/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-[#DC1B46] transition-colors">
                  ¿Indeciso sobre qué servicio elegir?
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Consulta al instante con nuestro Asistente Virtual Inteligente con tecnología Gemini AI.
                </p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-[#DC1B46] group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>

        </div>

      </div>

      {/* Bottom Live Bar */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-12">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#DC1B46]" />
            <span>Garantía Moreno Car Center: Si llueve en 24 hs, te repasamos el exterior sin cargo.</span>
          </div>
          <div className="flex items-center gap-6 font-bold text-slate-800 dark:text-slate-200">
            <span>📍 Av. Principal 1420</span>
            <span>🕒 Lun a Sáb 08:00 - 20:00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
