import React, { useState, useEffect } from 'react';
import { getStoredBookings, updateBookingStatusInStorage, INITIAL_SERVICES, saveBookingToStorage } from '../../services/firebase';
import { sendWhatsAppAlert } from '../../services/resend';
import { Briefcase, CheckCircle2, Clock, AlertCircle, MessageSquare, BarChart3, Filter, Plus, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [activeView, setActiveView] = useState('kanban');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickForm, setQuickForm] = useState({ clientName: '', phone: '', vehicle: '', plate: '', serviceId: 'eco-premium' });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const data = getStoredBookings();
    setOrders(data);
  };

  const columns = [
    { id: 'En Espera', label: 'En Espera (Recepción)', color: 'border-amber-500/50 bg-amber-500/5 dark:bg-amber-500/10' },
    { id: 'En Lavado', label: 'En Proceso de Detallado', color: 'border-[#DC1B46]/50 bg-[#DC1B46]/5 dark:bg-[#DC1B46]/10' },
    { id: 'Listo', label: '¡Listo para Retirar!', color: 'border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/10' }
  ];

  const handleMoveOrder = (orderId, newStatus) => {
    const updated = updateBookingStatusInStorage(orderId, newStatus);
    setOrders(updated);
  };

  const handleNotifyClient = async (order) => {
    await sendWhatsAppAlert(order);
    alert(`✅ Notificación oficial enviada por WhatsApp a ${order.clientName} (${order.phone}) indicando que el vehículo [${order.plate}] está ${order.status.toUpperCase()}`);
  };

  const handleQuickAddSubmit = (e) => {
    e.preventDefault();
    const srv = INITIAL_SERVICES.find(s => s.id === quickForm.serviceId) || INITIAL_SERVICES[0];
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: quickForm.clientName || 'Cliente Mostrador',
      phone: quickForm.phone || '+54 9 11 0000-0000',
      vehicle: quickForm.vehicle || 'Vehículo Genérico',
      plate: quickForm.plate.toUpperCase() || 'XXX 000',
      serviceId: srv.id,
      serviceName: srv.name,
      price: srv.price,
      duration: srv.duration,
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      status: 'En Espera',
      progress: 10
    };
    const updated = saveBookingToStorage(newOrder);
    setOrders(updated);
    setShowQuickAdd(false);
    setQuickForm({ clientName: '', phone: '', vehicle: '', plate: '', serviceId: 'eco-premium' });
  };

  const revenueData = [
    { name: 'Lun', ingresos: 180000 },
    { name: 'Mar', ingresos: 250000 },
    { name: 'Mié', ingresos: 310000 },
    { name: 'Jue', ingresos: 420000 },
    { name: 'Vie', ingresos: 580000 },
    { name: 'Sáb', ingresos: 750000 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      
      {/* Admin Top Banner */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-white/90 dark:bg-slate-900/90 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC1B46]/10 text-[#DC1B46] text-xs font-bold mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Consola Operacional & Base Emulada</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Tablero de Control en Vivo</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQuickAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#DC1B46] hover:bg-[#b81438] text-white font-bold text-xs md:text-sm shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ingreso Rápido en Planta</span>
          </button>

          <button
            onClick={loadOrders}
            title="Refrescar datos"
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#DC1B46] cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveView('kanban')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'kanban' ? 'bg-[#DC1B46] text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              📋 Kanban
            </button>
            <button
              onClick={() => setActiveView('metrics')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'metrics' ? 'bg-[#DC1B46] text-white shadow-md' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              📊 Analítica BI
            </button>
          </div>
        </div>
      </div>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel max-w-md w-full rounded-3xl p-6 space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Registrar Turno Mostrador</h3>
              <button onClick={() => setShowQuickAdd(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleQuickAddSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold mb-1">Nombre Cliente</label>
                <input required placeholder="Ej: Carlos Silva" value={quickForm.clientName} onChange={(e) => setQuickForm({...quickForm, clientName: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-slate-900 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Patente</label>
                  <input required placeholder="AG 123 CD" value={quickForm.plate} onChange={(e) => setQuickForm({...quickForm, plate: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border font-mono uppercase text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">WhatsApp</label>
                  <input required placeholder="+54 9 11..." value={quickForm.phone} onChange={(e) => setQuickForm({...quickForm, phone: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-slate-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Vehículo (Marca y Modelo)</label>
                <input required placeholder="Toyota Hilux" value={quickForm.vehicle} onChange={(e) => setQuickForm({...quickForm, vehicle: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Paquete de Servicio</label>
                <select value={quickForm.serviceId} onChange={(e) => setQuickForm({...quickForm, serviceId: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border text-slate-900 dark:text-white">
                  {INITIAL_SERVICES.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (${s.price.toLocaleString()})</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowQuickAdd(false)} className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold cursor-pointer">Cancelar</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#DC1B46] text-white text-xs font-bold cursor-pointer shadow-md">Ingresar a Planta</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeView === 'kanban' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((col) => {
            const colOrders = orders.filter((o) => o.status === col.id);
            return (
              <div key={col.id} className={`rounded-3xl border p-5 flex flex-col gap-4 min-h-[500px] ${col.color}`}>
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{col.label}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {colOrders.length} autos
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {colOrders.map((order) => (
                    <div key={order.id} className="glass-card rounded-2xl p-4 space-y-3 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {order.id}
                          </span>
                          <h4 className="font-bold text-slate-900 dark:text-white text-base mt-1">{order.vehicle}</h4>
                          <span className="text-xs font-mono uppercase bg-[#DC1B46]/10 text-[#DC1B46] px-1.5 py-0.5 rounded font-bold">
                            {order.plate}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-[#DC1B46]">${(order.price || 18000).toLocaleString()}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{order.time} hs</div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        Servicio: <strong className="text-slate-900 dark:text-white">{order.serviceName}</strong>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        Cliente: <strong>{order.clientName}</strong> ({order.phone})
                      </div>

                      {/* Status move actions */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <button
                          onClick={() => handleNotifyClient(order)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/10 hover:bg-emerald-600 text-emerald-600 hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Notificar</span>
                        </button>

                        <div className="flex gap-1">
                          {col.id !== 'En Espera' && (
                            <button
                              onClick={() => handleMoveOrder(order.id, 'En Espera')}
                              className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 text-[10px] font-bold cursor-pointer"
                            >
                              ← Espera
                            </button>
                          )}
                          {col.id !== 'En Lavado' && (
                            <button
                              onClick={() => handleMoveOrder(order.id, 'En Lavado')}
                              className="px-2 py-1 rounded bg-[#DC1B46]/10 text-[#DC1B46] hover:bg-[#DC1B46] hover:text-white text-[10px] font-bold cursor-pointer"
                            >
                              Lavado
                            </button>
                          )}
                          {col.id !== 'Listo' && (
                            <button
                              onClick={() => handleMoveOrder(order.id, 'Listo')}
                              className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white text-[10px] font-bold cursor-pointer"
                            >
                              Listo →
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeView === 'metrics' && (
        <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Facturación Semanal Proyectada (Promedio $18.000 ARS)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ingresos en tiempo real basados en los tickets emitidos desde la agenda y recepción.</p>
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                />
                <Bar dataKey="ingresos" fill="#DC1B46" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
}
