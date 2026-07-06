import React, { useState } from 'react';
import { INITIAL_SERVICES, saveBookingToStorage } from '../../services/firebase';
import { Calendar as CalendarIcon, Clock, Car, User, CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck, Sparkles, MapPin } from 'lucide-react';

const TIME_SLOTS = [
  { time: '08:30', status: 'available', label: 'Mañana - Primer Turno' },
  { time: '10:00', status: 'available', label: 'Mañana' },
  { time: '11:30', status: 'busy', label: 'Ocupado' },
  { time: '14:00', status: 'available', label: 'Tarde - Post Almuerzo' },
  { time: '15:30', status: 'available', label: 'Tarde' },
  { time: '17:00', status: 'available', label: 'Atardecer' },
  { time: '18:30', status: 'available', label: 'Último Turno' }
];

export default function BookingWizard({ preselectedService, onBookingComplete }) {
  const [step, setStep] = useState(preselectedService ? 2 : 1);
  const [selectedService, setSelectedService] = useState(preselectedService || INITIAL_SERVICES[0]);
  const [selectedDate, setSelectedDate] = useState('2026-07-04');
  const [selectedTime, setSelectedTime] = useState('10:00');
  
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    email: '',
    vehicleBrand: '',
    vehicleModel: '',
    plate: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: formData.clientName || 'Cliente Anónimo',
      phone: formData.phone || '+54 9 11 0000-0000',
      email: formData.email,
      vehicle: `${formData.vehicleBrand} ${formData.vehicleModel}`.trim() || 'Vehículo Registrado',
      plate: formData.plate.toUpperCase() || 'ABC 123',
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      price: selectedService.price,
      duration: selectedService.duration,
      date: selectedDate,
      time: selectedTime,
      status: 'En Espera',
      progress: 10
    };

    // Guardar en base emulada persistente (local storage)
    saveBookingToStorage(newOrder);

    setIsSubmitting(false);
    setConfirmedOrder(newOrder);
    setStep(5);
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] py-8 px-4 md:px-8 flex flex-col justify-center items-center">
      <div className="max-w-5xl w-full mx-auto space-y-8">
        
        {/* Wizard Header & Progress Bar */}
        {step < 5 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#DC1B46]">
                  Reserva Online En Tiempo Real
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                  Agenda de Turnos Inteligente
                </h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-bold">
                <span>Paso {step} de 4</span>
                <div className="w-24 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#DC1B46] h-full transition-all duration-300"
                    style={{ width: `${(step / 4) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Step Tabs indicator */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
              {[
                { s: 1, label: '1. Paquete' },
                { s: 2, label: '2. Fecha y Horario' },
                { s: 3, label: '3. Tu Vehículo' },
                { s: 4, label: '4. Confirmar' }
              ].map((tab) => (
                <div
                  key={tab.s}
                  onClick={() => tab.s < step && setStep(tab.s)}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                    step === tab.s
                      ? 'bg-[#DC1B46]/10 border-[#DC1B46] text-[#DC1B46]'
                      : tab.s < step
                      ? 'bg-white dark:bg-slate-900/60 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer hover:border-[#DC1B46]'
                      : 'bg-slate-100 dark:bg-slate-900/30 border-slate-200 dark:border-slate-900 text-slate-400 dark:text-slate-600'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.s < step && <CheckCircle2 className="w-4 h-4 text-[#DC1B46]" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: SELECT PACKAGE */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Selecciona el tratamiento ideal para tu vehículo:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {INITIAL_SERVICES.map((srv) => {
                const isSelected = selectedService.id === srv.id;
                return (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedService(srv)}
                    className={`glass-card rounded-2xl p-6 cursor-pointer border-2 transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#DC1B46] bg-[#DC1B46]/5 shadow-xl shadow-[#DC1B46]/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-[#DC1B46] px-2.5 py-1 rounded-full bg-[#DC1B46]/10 border border-[#DC1B46]/20">
                          {srv.duration} min
                        </span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-[#DC1B46]" />}
                      </div>
                      <h4 className="font-extrabold text-xl text-slate-900 dark:text-white mb-1">{srv.name}</h4>
                      <div className="text-2xl font-black text-[#DC1B46] mb-3">${srv.price.toLocaleString()}</div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{srv.description}</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedService(srv);
                        setStep(2);
                      }}
                      className={`mt-6 w-full py-3 rounded-xl font-bold text-xs transition-all ${
                        isSelected
                          ? 'bg-[#DC1B46] text-white'
                          : 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800'
                      }`}
                    >
                      Continuar con este paquete
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: DATE & TIME SLOT PICKER */}
        {step === 2 && (
          <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Selecciona Fecha y Bloque Horario</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Servicio elegido: <strong className="text-[#DC1B46]">{selectedService.name}</strong> (${selectedService.price.toLocaleString()} — {selectedService.duration} min)
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#DC1B46] flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Cambiar paquete
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Date selection */}
              <div className="lg:col-span-5 space-y-4">
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                  📅 Día de Reserva
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#DC1B46]"
                />
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="font-bold text-slate-900 dark:text-slate-200">💡 Nota de puntualidad</div>
                  <p>Te sugerimos presentarte con 5 minutos de anticipación. El box queda reservado en nuestra base en tiempo real.</p>
                </div>
              </div>

              {/* Time slot picker */}
              <div className="lg:col-span-7 space-y-4">
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                  🕒 Grilla de Horarios Disponibles ({selectedDate})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TIME_SLOTS.map((slot) => {
                    const isBusy = slot.status === 'busy';
                    const isSelected = selectedTime === slot.time && !isBusy;
                    return (
                      <button
                        key={slot.time}
                        disabled={isBusy}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isBusy
                            ? 'bg-slate-100 dark:bg-slate-900/30 border-slate-200 dark:border-slate-900/80 opacity-40 cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#DC1B46]/10 border-[#DC1B46] text-[#DC1B46] shadow-md scale-102 font-bold'
                            : 'bg-white dark:bg-slate-900/80 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-[#DC1B46]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-lg font-black">{slot.time}</span>
                          {isBusy ? (
                            <span className="text-[10px] font-bold text-red-500">Ocupado</span>
                          ) : isSelected ? (
                            <CheckCircle2 className="w-4 h-4 text-[#DC1B46]" />
                          ) : (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Libre</span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{slot.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setStep(3)}
                className="px-8 py-4 rounded-2xl bg-[#DC1B46] hover:bg-[#b81438] text-white font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-[#DC1B46]/25 hover:scale-105 transition-all cursor-pointer"
              >
                <span>Continuar a Tu Vehículo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: VEHICLE & CONTACT DATA */}
        {step === 3 && (
          <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Datos del Vehículo y Contacto</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Completa tu información para generar el comprobante oficial.</p>
              </div>
              <button
                onClick={() => setStep(2)}
                className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#DC1B46] flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Volver a Horarios
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setStep(4); }} className="space-y-6">
              
              {/* Vehicle info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#DC1B46]">
                  <Car className="w-4 h-4" />
                  <span>Información de tu Auto / Camioneta</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Patente / Dominio *</label>
                    <input
                      required
                      name="plate"
                      placeholder="Ej: AG 342 LK"
                      value={formData.plate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:border-[#DC1B46]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Marca *</label>
                    <input
                      required
                      name="vehicleBrand"
                      placeholder="Ej: Toyota, VW, Ford"
                      value={formData.vehicleBrand}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#DC1B46]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Modelo *</label>
                    <input
                      required
                      name="vehicleModel"
                      placeholder="Ej: Corolla Cross 2024"
                      value={formData.vehicleModel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#DC1B46]"
                    />
                  </div>
                </div>
              </div>

              {/* Client info */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                <div className="flex items-center gap-2 text-sm font-bold text-[#DC1B46]">
                  <User className="w-4 h-4" />
                  <span>Tus Datos de Contacto</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nombre y Apellido *</label>
                    <input
                      required
                      name="clientName"
                      placeholder="Juan Pérez"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#DC1B46]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">WhatsApp / Celular (para alertas) *</label>
                    <input
                      required
                      name="phone"
                      placeholder="+54 9 11 5555-4444"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#DC1B46]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-bold text-sm hover:bg-slate-300 cursor-pointer"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  className="px-8 py-4 rounded-2xl bg-[#DC1B46] hover:bg-[#b81438] text-white font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-[#DC1B46]/25 cursor-pointer"
                >
                  <span>Ver Resumen Final</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          </div>
        )}

        {/* STEP 4: FINAL SUMMARY & CONFIRMATION */}
        {step === 4 && (
          <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-8 animate-in fade-in duration-300 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">Confirma tu Reserva</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Verifica que todos los datos sean correctos antes de confirmar el turno.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Paquete Elegido</div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white">{selectedService.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-[#DC1B46]">${selectedService.price.toLocaleString()}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-bold">{selectedService.duration} min</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">Fecha reservada:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedDate} a las {selectedTime} hs</strong>
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">Vehículo:</span>
                  <strong className="text-slate-900 dark:text-white uppercase font-mono">{formData.plate || 'ABC 123'}</strong> ({formData.vehicleBrand} {formData.vehicleModel})
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">Titular:</span>
                  <strong className="text-slate-900 dark:text-white">{formData.clientName} ({formData.phone})</strong>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                disabled={isSubmitting}
                onClick={() => setStep(3)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-bold text-sm hover:bg-slate-300 cursor-pointer"
              >
                Editar Datos
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-xl shadow-emerald-600/25 hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Procesando Reserva...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirmar Turno Oficial</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS TICKET */}
        {step === 5 && confirmedOrder && (
          <div className="glass-panel rounded-3xl p-8 md:p-10 text-center space-y-6 max-w-2xl mx-auto animate-in zoom-in-95 duration-300 border border-emerald-500/40 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Reserva Confirmada & Bloqueada
              </span>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">¡Listo, {confirmedOrder.clientName}!</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base">
                Enviamos un mensaje de confirmación a tu WhatsApp (<strong className="text-slate-900 dark:text-white">{confirmedOrder.phone}</strong>). Tu box de trabajo está reservado.
              </p>
            </div>

            {/* Ticket Box */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 text-left space-y-3 font-mono text-sm shadow-sm">
              <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">
                <span>TICKET DE TURNO</span>
                <span className="text-[#DC1B46] font-bold">{confirmedOrder.id}</span>
              </div>
              <div className="flex justify-between text-slate-900 dark:text-white">
                <span>Servicio:</span>
                <strong>{confirmedOrder.serviceName}</strong>
              </div>
              <div className="flex justify-between text-slate-900 dark:text-white">
                <span>Horario:</span>
                <strong>{confirmedOrder.date} | {confirmedOrder.time} hs</strong>
              </div>
              <div className="flex justify-between text-slate-900 dark:text-white">
                <span>Vehículo:</span>
                <strong>{confirmedOrder.plate} ({confirmedOrder.vehicle})</strong>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Total a Abonar en Lavadero:</span>
                <span>${confirmedOrder.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-4">
              <button
                onClick={() => {
                  if (onBookingComplete) onBookingComplete();
                  setStep(1);
                }}
                className="px-8 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all cursor-pointer"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
