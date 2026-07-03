import React, { useState } from 'react';
import { INITIAL_SERVICES } from '../../services/firebase';
import { Sparkles, Clock, Check, ArrowRight, Info } from 'lucide-react';

export default function ServiceShowcase({ onSelectService }) {
  const [selectedDetail, setSelectedDetail] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-10">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DC1B46]/10 border border-[#DC1B46]/25 text-[#DC1B46] text-xs font-bold">
          <Sparkles className="w-4 h-4" />
          <span>Tarifas Oficiales Estandarizadas</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Catálogo de Servicios Premium
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg">
          Seleccionamos insumos importados de alta gama y técnicas ecológicas biodegradables. Precios finales sin sorpresas ni letra chica.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        {INITIAL_SERVICES.map((service, idx) => {
          const isFeatured = idx === 1;
          return (
            <div
              key={service.id}
              className={`glass-card rounded-3xl p-7 flex flex-col justify-between relative transition-all duration-300 ${
                isFeatured
                  ? 'border-[#DC1B46]/60 shadow-2xl shadow-[#DC1B46]/10 md:-translate-y-2'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Top Badge */}
              <div className="flex items-center justify-between gap-2 mb-6">
                <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${service.badgeColor} text-white shadow-sm`}>
                  {service.tag}
                </span>
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-[#DC1B46]" />
                  <span>{service.duration} minutos</span>
                </div>
              </div>

              {/* Title & Price */}
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {service.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#DC1B46]">
                    ${service.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">/ precio final</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Features List */}
              <div className="my-8 space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex-1">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Incluye en este paquete:
                </div>
                {service.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-[#DC1B46]/10 border border-[#DC1B46]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#DC1B46]" />
                    </div>
                    <span className="leading-snug">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={() => onSelectService(service)}
                  className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                    isFeatured
                      ? 'bg-[#DC1B46] hover:bg-[#b81438] text-white shadow-lg shadow-[#DC1B46]/25 hover:scale-102'
                      : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white'
                  }`}
                >
                  <span>Reservar Este Servicio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSelectedDetail(service)}
                  className="w-full py-2 text-center text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#DC1B46] transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Ver procedimiento paso a paso</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Procedure Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel max-w-lg w-full rounded-3xl p-6 md:p-8 space-y-6 border border-slate-200 dark:border-slate-700 shadow-2xl relative bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-[#DC1B46] uppercase tracking-wider">Procedimiento Técnico</span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedDetail.name}</h3>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <p className="leading-relaxed font-normal">
                En Moreno Car Center utilizamos productos con ph neutro que no dañan lacas, vinilos ni tratamientos previos. En el paquete <strong className="text-slate-900 dark:text-white">{selectedDetail.name}</strong> los técnicos dedican exactamente <strong className="text-[#DC1B46]">{selectedDetail.duration} minutos</strong> por vehículo bajo iluminación de inspección de alta fidelidad.
              </p>
              <div className="bg-slate-50 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Tiempo estimado y Garantía</div>
                <div className="flex items-center justify-between text-slate-900 dark:text-white font-bold">
                  <span>Inversión final de turno:</span>
                  <span className="text-[#DC1B46] font-extrabold text-lg">${selectedDetail.price.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedDetail(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-bold text-sm hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  const s = selectedDetail;
                  setSelectedDetail(null);
                  onSelectService(s);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#DC1B46] hover:bg-[#b81438] text-white font-bold text-sm cursor-pointer shadow-lg shadow-[#DC1B46]/25"
              >
                Reservar Ahora
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
