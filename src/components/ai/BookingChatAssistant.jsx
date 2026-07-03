import React, { useState } from 'react';
import { INITIAL_SERVICES, saveBookingToStorage } from '../../services/firebase';
import { Bot, Send, Sparkles, User, ArrowRight, CheckCircle2, Car, Calendar } from 'lucide-react';

export default function BookingChatAssistant({ onSelectService }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: '¡Hola! Soy el Asistente Virtual de **Moreno Car Center** 🚗✨.\n\nPara concretar tu turno en segundos, te presento nuestros 3 servicios oficiales configurados:\n\n1️⃣ **Lavado Eco-Premium ($18.000)** - 45 min\n2️⃣ **Detallado de Interiores ($35.000)** - 90 min\n3️⃣ **Tratamiento Cerámico 9H ($85.000)** - 150 min\n\n👉 Para agendar ahora mismo, **¿cuál es tu nombre y apellido?**'
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatStep, setChatStep] = useState('ask_name'); // ask_name -> ask_vehicle -> ask_plate -> ask_service -> done
  const [bookingData, setBookingData] = useState({
    clientName: '',
    vehicle: '',
    plate: '',
    serviceId: '',
    serviceName: '',
    price: 0
  });

  const handleQuickSelectService = (srv) => {
    if (chatStep === 'ask_service' || chatStep === 'done') {
      completeBookingWithService(srv, bookingData.clientName || 'Cliente Chat', bookingData.vehicle || 'Vehículo Registrado', bookingData.plate || 'ABC 123');
    } else {
      // User clicked a service pill early
      const updated = { ...bookingData, serviceId: srv.id, serviceName: srv.name, price: srv.price };
      setBookingData(updated);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: 'user', text: `Quiero el ${srv.name} ($${srv.price.toLocaleString()})` },
        { id: Date.now() + 1, sender: 'ai', text: `¡Perfecto! Has preseleccionado el **${srv.name}**. Para avanzar rápido con la reserva, ¿cuál es tu **nombre y apellido**?` }
      ]);
      setChatStep('ask_name');
    }
  };

  const completeBookingWithService = (srv, name, vehicle, plate) => {
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: name,
      phone: '+54 9 11 4455-6677',
      vehicle: vehicle,
      plate: plate.toUpperCase(),
      serviceId: srv.id,
      serviceName: srv.name,
      price: srv.price,
      duration: srv.duration,
      date: new Date().toISOString().split('T')[0],
      time: '14:30',
      status: 'En Espera',
      progress: 10
    };

    saveBookingToStorage(newOrder);

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text: `Selecciono ${srv.name}` },
      {
        id: Date.now() + 1,
        sender: 'ai',
        text: `🎉 **¡TURNO CONFIRMADO Y BLOQUEADO!**\n\nHemos registrado exitosamente tu turno en nuestro sistema operacional. Aquí está tu comprobante oficial:\n\n🎟️ **Ticket:** ${newOrder.id}\n👤 **Titular:** ${newOrder.clientName}\n🚘 **Vehículo:** ${newOrder.vehicle} (${newOrder.plate})\n🛠️ **Servicio:** ${newOrder.serviceName}\n💰 **Total a abonar:** $${newOrder.price.toLocaleString()} ARS\n\n📍 Te esperamos en nuestro centro de detallado. ¡Ya puedes ver tu vehículo en el Portal Operacional!`,
        confirmedTicket: newOrder
      }
    ]);
    setChatStep('done');
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const newMsg = { id: Date.now(), sender: 'user', text: userText };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      if (chatStep === 'ask_name') {
        const updated = { ...bookingData, clientName: userText };
        setBookingData(updated);
        setChatStep('ask_vehicle');
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: `¡Un gusto saludarte, **${userText}**! 🤝\n\nAhora dime, **¿qué auto o camioneta traes?** (Ej: Toyota Corolla, VW Amarok, Peugeot 208)`
          }
        ]);
      } else if (chatStep === 'ask_vehicle') {
        const updated = { ...bookingData, vehicle: userText };
        setBookingData(updated);
        setChatStep('ask_plate');
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: `¡Excelente vehículo el **${userText}**! 🏎️\n\nPor favor, **¿cuál es la patente o dominio** de la unidad para autorizar tu ingreso al box de trabajo?`
          }
        ]);
      } else if (chatStep === 'ask_plate') {
        const updated = { ...bookingData, plate: userText.toUpperCase() };
        setBookingData(updated);
        
        // If they already chose service early, finish now
        if (updated.serviceId) {
          const srv = INITIAL_SERVICES.find(s => s.id === updated.serviceId) || INITIAL_SERVICES[0];
          completeBookingWithService(srv, updated.clientName, updated.vehicle, updated.plate);
        } else {
          setChatStep('ask_service');
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'ai',
              text: `¡Patente **${userText.toUpperCase()}** registrada! ✅\n\nPor último, **¿qué tipo de lavado deseas concretar hoy?** Puedes escribir el nombre o hacer clic en una de las opciones configuradas abajo:`
            }
          ]);
        }
      } else if (chatStep === 'ask_service') {
        const lower = userText.toLowerCase();
        let chosen = INITIAL_SERVICES[0];
        if (lower.includes('cerámico') || lower.includes('ceramico') || lower.includes('3') || lower.includes('85')) {
          chosen = INITIAL_SERVICES[2];
        } else if (lower.includes('interior') || lower.includes('detallado') || lower.includes('2') || lower.includes('35')) {
          chosen = INITIAL_SERVICES[1];
        }
        completeBookingWithService(chosen, bookingData.clientName || 'Cliente Chat', bookingData.vehicle || 'Auto', bookingData.plate || 'ABC 123');
      } else {
        // Chat done or general query
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: `¡Tu turno ya está confirmado y activo en planta! Si necesitas agendar otro vehículo, escribe **"nuevo turno"**.`
          }
        ]);
        if (userText.toLowerCase().includes('nuevo')) {
          setChatStep('ask_name');
          setBookingData({ clientName: '', vehicle: '', plate: '', serviceId: '', serviceName: '', price: 0 });
          setMessages((prev) => [
            ...prev,
            { id: Date.now() + 2, sender: 'ai', text: `¡Perfecto! Empecemos de nuevo. **¿Cuál es el nombre y apellido** para esta nueva reserva?` }
          ]);
        }
      }
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 h-[calc(100vh-100px)] flex flex-col">
      
      {/* Title Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#DC1B46] flex items-center justify-center text-white shadow-lg shadow-[#DC1B46]/25">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DC1B46]/10 text-[#DC1B46] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Asistente Express de Agendamiento</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Concreción Inmediata de Turnos</h2>
        </div>
      </div>

      {/* Dynamic Available Options Banner */}
      <div className="mb-4 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">💡 Selecciona un servicio o responde las preguntas en el chat:</div>
        <div className="flex flex-wrap gap-2">
          {INITIAL_SERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => handleQuickSelectService(s)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#DC1B46] hover:text-white text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-300 dark:border-slate-700"
            >
              <span>{s.name}</span>
              <span className="text-[#DC1B46] group-hover:text-white font-black">${s.price.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 glass-panel rounded-3xl p-4 md:p-6 overflow-y-auto space-y-4 mb-4 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-[#DC1B46] text-white flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-xl rounded-2xl p-4 text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#DC1B46] text-white font-medium rounded-br-none shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-sm'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>

              {m.confirmedTicket && (
                <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-300 font-mono text-xs space-y-1">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">✅ COMPROBANTE OFICIAL GENERADO</div>
                  <div>ID: {m.confirmedTicket.id}</div>
                  <div>Servicio: {m.confirmedTicket.serviceName} (${m.confirmedTicket.price.toLocaleString()})</div>
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold pl-12 animate-pulse">
            <span>El bot está escribiendo la siguiente pregunta...</span>
          </div>
        )}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          placeholder="Escribe tu respuesta aquí..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#DC1B46] font-medium shadow-sm"
        />
        <button
          type="submit"
          className="px-6 py-3.5 rounded-2xl bg-[#DC1B46] hover:bg-[#b81438] text-white font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-[#DC1B46]/25 transition-all"
        >
          <span>Responder</span>
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
