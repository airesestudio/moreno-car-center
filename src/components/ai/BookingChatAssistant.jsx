import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, MoreVertical, CheckCheck, Smile, Paperclip, 
  Mic, Send, CheckCircle2, Clock, Calendar, ShieldCheck, Car, Plus, BadgeCheck, Sparkles 
} from 'lucide-react';

const ACRONYMS = ['VW', 'BMW', 'BYD', 'RAM', 'SUV', '4X4', 'GT', 'GTI', 'SRX', 'V6', 'V8', '16V', '4WD', 'AWD', 'OKM', '0KM', 'MG', 'JAC', 'PRO-4X', 'EV', 'DM-I'];

const toTitleCase = (text) => {
  if (!text) return '';
  return text
    .split(' ')
    .map((word) => {
      const upper = word.toUpperCase();
      if (ACRONYMS.includes(upper) || /^[A-Z0-9]{6,7}$/.test(upper)) return upper;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

// Popular models & Trending Chinese Imports in Argentina
const DEFAULT_PREDICTIVE_CARS = [
  'BYD Song Plus DM-i',
  'BYD Seal / Yuan Plus',
  'Haval H6 GT / Jolion',
  'Chery Tiggo 8 PRO Max',
  'Baic X55 II / BJ40 Plus',
  'Jetour Dashing / X70 Plus',
  'JAC JS4 / T8 PRO 4x4',
  'MG ZS / RX5',
  'Changan CS75 Plus',
  'Geely Coolray / Okavango',
  'Volkswagen Amarok V6',
  'Toyota Hilux SRX',
  'Ford Ranger Raptor',
  'Peugeot 208 GT',
  'Volkswagen Taos Highline',
  'Toyota Corolla Cross Hybrid',
  'Chevrolet Tracker Premier',
  'Fiat Cronos Precision',
  'Ford Territory Titanium',
  'Jeep Renegade / Compass',
  'Audi A4 / Q3 S-Line',
  'BMW Serie 3 / X1',
  'Mercedes-Benz GLC / Clase A',
  'RAM 1500 / Rampage',
  'Nissan Frontier PRO-4X',
];

const INITIAL_PATENTES_DB = {
  'AE123CD': { name: 'Carlos Rodríguez', phone: '11 5544 3322', brandModel: 'Volkswagen Amarok V6' },
  'AD456EF': { name: 'María Gómez', phone: '11 8877 6655', brandModel: 'Peugeot 208 GT' },
  'AF789GH': { name: 'Lucas Moreno', phone: '11 2233 4455', brandModel: 'Toyota Hilux SRX' },
};

const SERVICES_LIST = [
  { id: 'cer', name: 'Tratamiento Cerámico 9H Showroom', price: 85000 },
  { id: 'pul', name: 'Pulido Espejo Correctivo', price: 65000 },
  { id: 'det', name: 'Detallado & Sanitización a Vapor', price: 35000 },
  { id: 'eco', name: 'Lavado Eco Premium Detallado', price: 18000 },
];

// Helper to separate Name and Phone from single input e.g. "MARTIN Perez 1132564896"
const extractNameAndPhone = (text) => {
  const phoneMatches = text.match(/[\d\s+\-()]{8,}/);
  let phone = '';
  let name = text;
  if (phoneMatches && phoneMatches[0].replace(/\D/g, '').length >= 8) {
    phone = phoneMatches[0].trim();
    name = text.replace(phoneMatches[0], '').replace(/[-_,:;]/g, '').trim();
  } else {
    // Fallback split if no clear long phone number
    const parts = text.split('-');
    if (parts.length > 1) {
      name = parts[0].trim();
      phone = parts[1].trim();
    }
  }
  if (!name) name = 'Cliente';
  if (!phone) phone = 'Sin registrar';
  return { name: toTitleCase(name), phone };
};

export default function BookingChatAssistant({ preselectedService, onSelectService, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState('ASK_PATENTE');
  const [patentesDb, setPatentesDb] = useState(INITIAL_PATENTES_DB);
  const [predictiveCars, setPredictiveCars] = useState(() => {
    const saved = localStorage.getItem('moreno_predictive_cars');
    return saved ? JSON.parse(saved) : DEFAULT_PREDICTIVE_CARS;
  });

  const [bookingDraft, setBookingDraft] = useState({
    patente: '',
    name: '',
    phone: '',
    brandModel: '',
    service: preselectedService || null,
    timeSlot: '',
  });

  const messagesEndRef = useRef(null);
  const urgencyTimerRef = useRef(null);

  const getCurrentTimeStr = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, step]);

  // Authentic conversational welcome message (NO buttons in step 1)
  useEffect(() => {
    const serviceGreeting = preselectedService
      ? ` Veo que estás interesado en el servicio de *${preselectedService.name || preselectedService.title}*.`
      : '';

    const welcomeMsg = {
      id: Date.now(),
      sender: 'ai',
      time: getCurrentTimeStr(),
      text: `¡Hola! Qué gusto saludarte. 😊 Soy tu asesor virtual en *Moreno Car Center*.${serviceGreeting}\n\nPara consultar la disponibilidad de nuestros tratamientos y agendar tu turno, por favor indícame la **patente de tu vehículo**:`,
    };
    setMessages([welcomeMsg]);
  }, [preselectedService]);

  useEffect(() => {
    if (step === 'SELECT_TIME') {
      urgencyTimerRef.current = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: 'ai',
            time: getCurrentTimeStr(),
            isWarning: true,
            text: `⚠️ *Aviso de Disponibilidad:*\nTu turno está en pre-reserva en espera de confirmación.\nTe sugerimos seleccionar tu horario pronto para asegurar el cupo disponible en planta.`,
          },
        ]);
      }, 14000);
    }
    return () => {
      if (urgencyTimerRef.current) clearTimeout(urgencyTimerRef.current);
    };
  }, [step]);

  const addAiMessage = (text, delay = 600, extraData = {}) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: 'ai', time: getCurrentTimeStr(), text, ...extraData },
      ]);
    }, delay);
  };

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const formattedInput = toTitleCase(input.trim());
    const rawInputUpper = input.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

    const userMsg = { 
      id: Date.now(), 
      sender: 'user', 
      time: getCurrentTimeStr(), 
      text: formattedInput 
    };
    setMessages((prev) => [...prev, userMsg]);
    const currentVal = input;
    setInput('');

    if (step === 'ASK_PATENTE') {
      handlePatenteInput(rawInputUpper || formattedInput);
    } else if (step === 'ASK_NAME_PHONE') {
      handleNamePhoneInput(currentVal);
    } else if (step === 'SELECT_PREDICTIVE_CAR') {
      handleCarSelection(formattedInput);
    }
  };

  const handlePatenteInput = (pat) => {
    const found = patentesDb[pat];
    if (found) {
      setBookingDraft((prev) => ({
        ...prev,
        patente: pat,
        name: found.name,
        phone: found.phone,
        brandModel: found.brandModel,
      }));
      setStep('CONFIRM_FOUND_VEHICLE');
      addAiMessage(
        `¡Hola de nuevo, *${found.name}*! 🚗\nEncontramos tu vehículo registrado en nuestra base:\n• *${found.brandModel}*\n• *Patente:* ${pat}\n\n¿Deseas agendar para este vehículo?`
      );
    } else {
      setBookingDraft((prev) => ({ ...prev, patente: pat }));
      setStep('ASK_NAME_PHONE');
      addAiMessage(
        `Perfecto. No tenemos registrada la patente *${pat}*, te registramos en un momento.\n\nPor favor, escríbeme tu **Nombre y Apellido y número de WhatsApp**\n_(Ej: Martin Perez 1132564896):_`
      );
    }
  };

  const handleNamePhoneInput = (val) => {
    const { name, phone } = extractNameAndPhone(val);

    setBookingDraft((prev) => ({
      ...prev,
      name: name,
      phone: phone,
    }));
    setStep('SELECT_PREDICTIVE_CAR');
    addAiMessage(
      `¡Un gusto saludarte, *${name}*! Guardamos tu contacto: *${phone}*.\n\nPara indicarte los detalles y agendar, **¿cuál es la marca, modelo y año de tu vehículo?**\n_(Escríbelo abajo y te daremos sugerencias automáticas):_`
    );
  };

  const handleCarSelection = (carName) => {
    const formattedCar = toTitleCase(carName);
    setBookingDraft((prev) => {
      const updated = { ...prev, brandModel: formattedCar };
      if (updated.patente) {
        setPatentesDb((db) => ({
          ...db,
          [updated.patente]: {
            name: updated.name,
            phone: updated.phone,
            brandModel: formattedCar,
          },
        }));
      }
      return updated;
    });

    // Save custom vehicle into predictive DB if not existing
    if (!predictiveCars.some((c) => c.toLowerCase() === formattedCar.toLowerCase())) {
      const updatedList = [formattedCar, ...predictiveCars];
      setPredictiveCars(updatedList);
      localStorage.setItem('moreno_predictive_cars', JSON.stringify(updatedList));
    }

    if (bookingDraft.service) {
      setStep('SELECT_TIME');
      addAiMessage(
        `✅ Excelente, registramos tu *${formattedCar}*.\n\nPara el servicio de *${bookingDraft.service.name || bookingDraft.service.title}*, contamos con los siguientes horarios disponibles para *HOY*:`
      );
    } else {
      setStep('SELECT_SERVICE');
      addAiMessage(
        `✅ Excelente, registramos tu *${formattedCar}*.\n\nPor favor, elige cuál de nuestros tratamientos deseas realizar:`
      );
    }
  };

  const handleSelectServiceOption = (srv) => {
    setBookingDraft((prev) => ({ ...prev, service: srv }));
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', time: getCurrentTimeStr(), text: srv.name }]);
    setStep('SELECT_TIME');
    addAiMessage(
      `¡Buena elección! 💎 *${srv.name}* ($${srv.price.toLocaleString()}).\n\nElige tu horario libre para HOY o selecciona otro día:`
    );
  };

  const handleSelectOtherDay = () => {
    if (urgencyTimerRef.current) clearTimeout(urgencyTimerRef.current);
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', time: getCurrentTimeStr(), text: 'Otro día' }]);
    setStep('SELECT_DAY');
    addAiMessage('Perfecto. ¿Qué día de esta semana o la próxima te queda más cómodo para traer tu vehículo?');
  };

  const handleSelectDayOption = (dayStr) => {
    setBookingDraft((prev) => ({ ...prev, selectedDay: dayStr }));
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', time: getCurrentTimeStr(), text: dayStr }]);
    setStep('SELECT_TIME_FOR_DAY');
    addAiMessage(`Excelente. Para el día *${dayStr}*, consultando nuestra base de datos en tiempo real para no superponer reservas, estos son los turnos libres en planta:`);
  };

  const handleSelectTimeSlot = (timeText) => {
    if (urgencyTimerRef.current) clearTimeout(urgencyTimerRef.current);
    setBookingDraft((prev) => ({ ...prev, timeSlot: timeText }));
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', time: getCurrentTimeStr(), text: timeText }]);
    setStep('COMPLETED');

    const srvName = bookingDraft.service?.name || bookingDraft.service?.title || 'Tratamiento Cerámico 9H';
    const srvPrice = bookingDraft.service?.price || 85000;
    const ticketId = 'MCC-' + Math.floor(100000 + Math.random() * 900000);

    addAiMessage(
      `🎉 *¡RESERVA CONFIRMADA EN SHOWROOM!*\n\nTe esperamos en Moreno Car Center el día y horario pactado. Aquí tienes tu comprobante oficial:`,
      700,
      {
        confirmedTicket: {
          id: ticketId,
          serviceName: srvName,
          price: srvPrice,
          patente: bookingDraft.patente,
          brandModel: bookingDraft.brandModel,
          clientName: bookingDraft.name,
          timeSlot: timeText,
        },
      }
    );
  };

  // Filter autocomplete suggestions for Dialogflow-style floating bar
  const filteredSuggestions = step === 'SELECT_PREDICTIVE_CAR' 
    ? predictiveCars.filter(c => c.toLowerCase().includes(input.toLowerCase())).slice(0, 5)
    : [];

  return (
    <div className="fixed inset-0 z-[70] flex flex-col w-full h-full overflow-hidden select-none bg-[#EFEAE2] dark:bg-[#0B141A] font-sans">
      
      {/* 1. Exact WhatsApp Top Header */}
      <header className="shrink-0 h-16 px-3.5 bg-[#008069] dark:bg-[#202C33] text-white flex items-center justify-between shadow-md z-30 gap-2 overflow-hidden">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer flex items-center justify-center shrink-0"
            title="Volver"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2.5 cursor-pointer min-w-0 flex-1">
            <div className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center p-0.5 shadow-inner overflow-hidden shrink-0">
              <img src="/logo-moreno.png" alt="Moreno Car Center" className="w-8 h-8 object-contain" />
            </div>
            
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-bold text-base md:text-lg leading-tight truncate whitespace-nowrap">Moreno Car Center</span>
                <BadgeCheck className="w-4 h-4 text-[#25D366] fill-[#25D366] shrink-0" />
              </div>
              <span className="text-[11px] text-white/90 font-normal leading-tight truncate whitespace-nowrap">
                Cuenta de empresa oficial • en línea
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-white/90 shrink-0">
          <button onClick={onClose} className="hover:text-white hover:bg-white/10 transition-colors cursor-pointer px-3 py-1.5 rounded-xl font-bold text-xs bg-white/15 flex items-center gap-1" title="Cerrar ventana">
            <span>Cerrar</span>
            <span>✕</span>
          </button>
        </div>
      </header>

      {/* 2. Chat Area with Exact WhatsApp Wallpaper Styling */}
      <div 
        className="flex-1 overflow-y-auto px-3 md:px-12 py-4 space-y-3 relative"
        style={{
          backgroundImage: `radial-gradient(#000000 0.4px, transparent 0.4px), radial-gradient(#000000 0.4px, #EFEAE2 0.4px)`,
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 8px 8px',
          opacity: 0.98
        }}
      >
        <div className="absolute inset-0 bg-[#0B141A]/95 dark:block hidden pointer-events-none"></div>

        {/* Encryption & Date Pill */}
        <div className="flex flex-col items-center justify-center gap-2 my-2 relative z-10">
          <div className="bg-[#FFF5C4] dark:bg-[#182229] text-[#54656F] dark:text-[#8696A0] text-[11px] px-3.5 py-1.5 rounded-lg shadow-2xs text-center max-w-md border border-amber-200/50 dark:border-slate-800">
            🔒 Las conversaciones están protegidas con cifrado de extremo a extremo.
          </div>
          <div className="bg-white dark:bg-[#182229] text-[#54656F] dark:text-[#8696A0] text-xs font-semibold px-3 py-1 rounded-md shadow-2xs uppercase">
            Hoy
          </div>
        </div>

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col relative z-10 ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Message Bubble Container */}
            <div
              className={`max-w-[86%] sm:max-w-md md:max-w-lg px-3.5 pt-2.5 pb-1.5 rounded-2xl shadow-sm text-base leading-snug relative break-words ${
                m.sender === 'user'
                  ? 'bg-[#D9FDD3] dark:bg-[#005C4B] text-[#111B21] dark:text-[#E9EDEF] rounded-tr-none'
                  : m.isWarning
                  ? 'bg-[#FFF3C4] dark:bg-[#332B00] text-[#54656F] dark:text-[#FFD27F] border border-amber-400 rounded-tl-none'
                  : 'bg-white dark:bg-[#202C33] text-[#111B21] dark:text-[#E9EDEF] rounded-tl-none'
              }`}
            >
              {/* Sender Name for AI */}
              {m.sender === 'ai' && !m.isWarning && (
                <div className="text-xs font-bold text-[#008069] dark:text-[#00A884] mb-1">
                  ~ Moreno Car Center IA
                </div>
              )}

              {/* Message Text */}
              <div className="whitespace-pre-line pb-4 text-[15px] md:text-base font-normal">
                {m.text}
              </div>

              {/* Timestamp and Checkmarks */}
              <div className="absolute bottom-1 right-2.5 flex items-center gap-1 text-[11px] text-[#667781] dark:text-[#8696A0]">
                <span>{m.time}</span>
                {m.sender === 'user' && (
                  <CheckCheck className="w-4 h-4 text-[#53BDEB] stroke-[2.5]" />
                )}
              </div>
            </div>

            {/* Step 2a: Confirm Found Vehicle Interactive Buttons */}
            {step === 'CONFIRM_FOUND_VEHICLE' && m === messages[messages.length - 1] && (
              <div className="mt-2 flex flex-col sm:flex-row gap-2 w-full max-w-[86%] sm:max-w-md relative z-10">
                <button
                  onClick={() => {
                    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', time: getCurrentTimeStr(), text: `Sí, agendar para mi ${bookingDraft.brandModel}` }]);
                    if (bookingDraft.service) {
                      setStep('SELECT_TIME');
                      addAiMessage(`¡Genial! Para tu tratamiento de *${bookingDraft.service.name || bookingDraft.service.title}*, estos son los horarios libres para *HOY*:`);
                    } else {
                      setStep('SELECT_SERVICE');
                      addAiMessage(`¡Entendido! Por favor elige qué tratamiento deseas realizar:`);
                    }
                  }}
                  className="flex-1 py-2.5 px-4 bg-white dark:bg-[#202C33] hover:bg-emerald-50 dark:hover:bg-[#2A3942] text-[#008069] dark:text-[#00A884] font-bold text-sm rounded-xl shadow-xs border border-[#008069]/30 transition-all text-center cursor-pointer active:scale-98"
                >
                  ✅ Sí, agendar este vehículo
                </button>
                <button
                  onClick={() => {
                    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', time: getCurrentTimeStr(), text: 'Es otro vehículo' }]);
                    setStep('ASK_PATENTE');
                    addAiMessage('Entendido. Por favor escríbeme la nueva patente:');
                  }}
                  className="flex-1 py-2.5 px-4 bg-white dark:bg-[#202C33] hover:bg-slate-50 dark:hover:bg-[#2A3942] text-[#54656F] dark:text-[#8696A0] font-bold text-sm rounded-xl shadow-xs border border-slate-300 dark:border-slate-700 transition-all text-center cursor-pointer active:scale-98"
                >
                  🚗 Cambiar vehículo
                </button>
              </div>
            )}

            {/* Step 3: Select Service WhatsApp Interactive List */}
            {step === 'SELECT_SERVICE' && m === messages[messages.length - 1] && (
              <div className="mt-2 w-full max-w-[86%] sm:max-w-md space-y-1.5 relative z-10">
                {SERVICES_LIST.map((srv) => (
                  <button
                    key={srv.id}
                    onClick={() => handleSelectServiceOption(srv)}
                    className="w-full py-3 px-4 bg-white dark:bg-[#202C33] hover:bg-slate-50 dark:hover:bg-[#2A3942] text-left rounded-xl shadow-xs border border-[#008069]/20 transition-all cursor-pointer flex justify-between items-center active:scale-98"
                  >
                    <span className="font-semibold text-sm text-[#111B21] dark:text-[#E9EDEF]">{srv.name}</span>
                    <span className="font-bold text-sm text-[#008069] dark:text-[#00A884] shrink-0 ml-2">
                      ${srv.price.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 4: Select Time Slot WhatsApp Chips */}
            {step === 'SELECT_TIME' && m === messages[messages.length - 1] && (
              <div className="mt-2 w-full max-w-[86%] sm:max-w-md flex flex-wrap gap-1.5 relative z-10">
                {['Hoy 14:30 hs', 'Hoy 16:00 hs', 'Hoy 18:00 hs'].map((timeStr) => (
                  <button
                    key={timeStr}
                    onClick={() => handleSelectTimeSlot(timeStr)}
                    className="py-2.5 px-4 bg-white dark:bg-[#202C33] hover:bg-emerald-50 dark:hover:bg-[#2A3942] text-[#008069] dark:text-[#00A884] font-bold text-sm rounded-xl shadow-xs border border-[#008069]/30 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                  >
                    <Clock className="w-4 h-4" />
                    <span>{timeStr}</span>
                  </button>
                ))}
                <button
                  onClick={handleSelectOtherDay}
                  className="py-2.5 px-4 bg-white dark:bg-[#202C33] hover:bg-slate-50 dark:hover:bg-[#2A3942] text-[#54656F] dark:text-[#8696A0] font-bold text-sm rounded-xl shadow-xs border border-slate-300 dark:border-slate-700 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Otro día</span>
                </button>
              </div>
            )}

            {/* Step 4b: Select Day Options */}
            {step === 'SELECT_DAY' && m === messages[messages.length - 1] && (
              <div className="mt-2 w-full max-w-[86%] sm:max-w-md flex flex-wrap gap-1.5 relative z-10">
                {['Mañana Jueves', 'Viernes', 'Sábado', 'Lunes próximo'].map((dayStr) => (
                  <button
                    key={dayStr}
                    onClick={() => handleSelectDayOption(dayStr)}
                    className="py-2.5 px-4 bg-white dark:bg-[#202C33] hover:bg-emerald-50 dark:hover:bg-[#2A3942] text-[#008069] dark:text-[#00A884] font-bold text-sm rounded-xl shadow-xs border border-[#008069]/30 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{dayStr}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 4c: Select Time for Selected Day (No Overlap DB verification) */}
            {step === 'SELECT_TIME_FOR_DAY' && m === messages[messages.length - 1] && (
              <div className="mt-2 w-full max-w-[86%] sm:max-w-md flex flex-wrap gap-1.5 relative z-10">
                {['09:30 hs', '11:00 hs', '15:00 hs', '17:00 hs'].map((timeStr) => {
                  const fullSlot = `${bookingDraft.selectedDay || 'Día elegido'} a las ${timeStr}`;
                  return (
                    <button
                      key={timeStr}
                      onClick={() => handleSelectTimeSlot(fullSlot)}
                      className="py-2.5 px-4 bg-white dark:bg-[#202C33] hover:bg-emerald-50 dark:hover:bg-[#2A3942] text-[#008069] dark:text-[#00A884] font-bold text-sm rounded-xl shadow-xs border border-[#008069]/30 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                    >
                      <Clock className="w-4 h-4" />
                      <span>{timeStr}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* WhatsApp Receipt Card */}
            {m.confirmedTicket && (
              <div className="mt-3 max-w-[86%] sm:max-w-md w-full p-4 rounded-2xl bg-white dark:bg-[#202C33] border-l-4 border-[#25D366] shadow-md space-y-2 relative z-10 text-[#111B21] dark:text-[#E9EDEF]">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="font-bold text-xs text-[#008069] dark:text-[#00A884] uppercase flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#25D366]" /> TURNO AGENDADO
                  </span>
                  <span className="text-[11px] font-mono font-bold bg-[#D9FDD3] dark:bg-[#005C4B] text-[#008069] dark:text-[#E9EDEF] px-2 py-0.5 rounded">
                    {m.confirmedTicket.id}
                  </span>
                </div>
                <div className="text-xs space-y-1">
                  <div>*Cliente:* {m.confirmedTicket.clientName}</div>
                  <div>*Patente:* {m.confirmedTicket.patente}</div>
                  <div>*Vehículo:* {m.confirmedTicket.brandModel}</div>
                  <div>*Horario:* {m.confirmedTicket.timeSlot}</div>
                  <div className="font-bold pt-1 text-sm text-[#008069] dark:text-[#00A884]">
                    {m.confirmedTicket.serviceName} (${m.confirmedTicket.price.toLocaleString()})
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1 max-w-xs px-4 py-3 rounded-2xl bg-white dark:bg-[#202C33] shadow-sm relative z-10 w-fit">
            <span className="w-2 h-2 rounded-full bg-[#008069] animate-bounce"></span>
            <span className="w-2 h-2 rounded-full bg-[#008069] animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 rounded-full bg-[#008069] animate-bounce [animation-delay:0.4s]"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Dialogflow-style Predictive Autocomplete Bar right above Composer */}
      {step === 'SELECT_PREDICTIVE_CAR' && (
        <div className="bg-white/95 dark:bg-[#202C33]/95 border-t border-slate-200 dark:border-slate-700 px-3 py-2 shrink-0 z-30 shadow-lg">
          <div className="text-[11px] font-bold text-[#008069] dark:text-[#00A884] uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Predicción Automotriz Inteligente (Importados y Nacionales):
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((car, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', time: getCurrentTimeStr(), text: car }]);
                    handleCarSelection(car);
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#F0F2F5] dark:bg-[#2A3942] hover:bg-[#008069] hover:text-white text-[#111B21] dark:text-[#E9EDEF] font-semibold text-xs whitespace-nowrap transition-colors cursor-pointer border border-slate-300 dark:border-slate-600 active:scale-95"
                >
                  {car}
                </button>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic py-1">Escribe la marca y modelo en el cuadro de texto abajo...</span>
            )}
          </div>
        </div>
      )}

      {/* 3. Exact WhatsApp Bottom Composer / Input Bar */}
      {step !== 'COMPLETED' && step !== 'SELECT_TIME' && step !== 'SELECT_SERVICE' && (
        <div className="shrink-0 p-2 sm:p-3 bg-[#F0F2F5] dark:bg-[#202C33] flex items-center gap-2 z-30">
          <div className="flex items-center gap-1.5 text-[#54656F] dark:text-[#8696A0] pl-1">
            <button className="hover:text-slate-800 dark:hover:text-white p-1 cursor-pointer"><Smile className="w-6 h-6" /></button>
            <button className="hover:text-slate-800 dark:hover:text-white p-1 cursor-pointer"><Paperclip className="w-6 h-6" /></button>
          </div>

          <form onSubmit={handleSend} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              placeholder={
                step === 'ASK_PATENTE'
                  ? 'Escribe tu patente aquí...'
                  : step === 'ASK_NAME_PHONE'
                  ? 'Nombre y WhatsApp (Ej: Martin Perez 1132564896)...'
                  : 'Escribe marca, modelo y año...'
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-full bg-white dark:bg-[#2A3942] text-[#111B21] dark:text-[#E9EDEF] placeholder-[#54656F] dark:placeholder-[#8696A0] focus:outline-none text-base border-none shadow-sm"
              autoFocus
            />
            
            <button
              type="submit"
              className="w-11 h-11 rounded-full bg-[#00A884] hover:bg-[#008069] text-white flex items-center justify-center shadow-md transition-transform active:scale-90 cursor-pointer shrink-0"
            >
              {input.trim() ? <Send className="w-5 h-5 ml-0.5" /> : <Mic className="w-5 h-5" />}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
