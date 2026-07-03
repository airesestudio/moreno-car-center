import React from 'react';
import { Calendar, ArrowRight, Tag } from 'lucide-react';

const OFFERS = [
  {
    id: 1,
    title: 'Tratamiento Cerámico 9H Showroom',
    price: '$85.000',
    discount: '25% OFF ESPECIAL',
    image: 'showcase-1.png',
  },
  {
    id: 2,
    title: 'Pulido Espejo Correctivo 0km',
    price: '$65.000',
    discount: 'OFERTA ESTRELLA',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Detallado & Sanitización a Vapor',
    price: '$35.000',
    discount: '20% OFF EFECTIVO',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Sellado Acrílico & Protección UV',
    price: '$48.000',
    discount: 'BONUS PROTECTOR',
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    title: 'Limpieza Profunda Cuero & Tapizados',
    price: '$42.000',
    discount: 'ECO 90% AGUA',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
  },
];

export default function HomeShowcase({ onSelectBooking }) {
  return (
    <div className="w-full h-[calc(100vh-65px)] flex flex-col justify-between items-center py-2 md:py-4 overflow-hidden select-none">
      
      {/* 1. Gigantic Centered Horizontal Logo occupying all horizontal space */}
      <div className="w-[96%] sm:w-[90%] max-w-4xl flex items-center justify-center my-auto shrink-0 px-1">
        <img 
          src="logo-moreno.png" 
          alt="Moreno Car Center" 
          className="w-full h-auto max-h-[28vh] object-contain drop-shadow-2xl dark:hidden hover:scale-105 transition-transform duration-500" 
        />
        <img 
          src="logo-moreno-dark.png" 
          alt="Moreno Car Center" 
          className="w-full h-auto max-h-[28vh] object-contain drop-shadow-2xl hidden dark:block hover:scale-105 transition-transform duration-500" 
        />
      </div>

      {/* 2. Animated Infinite Marquee Slider Running to the Left */}
      <div className="w-full my-auto py-2 sm:py-4 overflow-hidden relative shrink-0">
        {/* Left and Right Subtle Gradient Mask */}
        <div className="absolute inset-y-0 left-0 w-8 sm:w-20 bg-gradient-to-r from-slate-50 dark:from-[#090D16] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-8 sm:w-20 bg-gradient-to-l from-slate-50 dark:from-[#090D16] to-transparent z-10 pointer-events-none"></div>

        {/* Marquee Track */}
        <div className="animate-marquee gap-4 px-4">
          {[...OFFERS, ...OFFERS].map((offer, idx) => (
            <div
              key={`${offer.id}-${idx}`}
              onClick={() => onSelectBooking({ id: offer.id, name: offer.title, price: parseInt(offer.price.replace(/\D/g, '')) || 85000 })}
              className="w-[240px] sm:w-[310px] h-[230px] sm:h-[280px] rounded-3xl overflow-hidden relative group cursor-pointer shadow-xl hover:shadow-2xl border border-slate-200/80 dark:border-white/10 shrink-0 transition-all duration-300 hover:-translate-y-1 bg-slate-900"
            >
              {/* Background Image */}
              <img
                src={offer.image}
                alt={offer.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

              {/* Discount / Offer Badge Top Right */}
              <div className="absolute top-3 right-3 z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DC1B46] text-white text-[10px] font-black tracking-wider uppercase shadow-lg shadow-[#DC1B46]/50">
                  <Tag className="w-3 h-3" />
                  {offer.discount}
                </span>
              </div>

              {/* Offer Info Bottom */}
              <div className="absolute bottom-0 inset-x-0 p-4 z-10 flex flex-col justify-end text-white">
                <div className="text-xl sm:text-2xl font-black text-[#DC1B46] drop-shadow-md mb-0.5">
                  {offer.price}
                </div>
                <h3 className="text-sm sm:text-base font-bold leading-snug group-hover:text-rose-200 transition-colors line-clamp-2">
                  {offer.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Full-Width "Reserva Turno" Button elevated significantly above mobile bottom menu */}
      <div className="w-full max-w-3xl mx-auto px-4 pb-36 sm:pb-32 md:pb-12 mb-4 shrink-0">
        <button
          onClick={() => onSelectBooking()}
          className="w-full py-4 sm:py-5 rounded-3xl bg-[#DC1B46] hover:bg-[#b81438] text-white font-black text-base sm:text-xl tracking-wide shadow-[0_12px_35px_-8px_rgba(220,27,70,0.65)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer border border-white/20 group"
        >
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform shrink-0" />
          <span>Reserva Turno</span>
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform shrink-0" />
        </button>
      </div>

    </div>
  );
}
