import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "moreno-car-center.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "moreno-car-center",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "moreno-car-center.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:demo"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Servicios Oficiales (Tarifas actualizadas Argentina)
export const INITIAL_SERVICES = [
  {
    id: 'eco-premium',
    name: 'Lavado Eco-Premium',
    price: 18000,
    duration: 45,
    tag: 'Más Popular',
    badgeColor: 'from-[#DC1B46] to-rose-600',
    description: 'Limpieza exterior ecológica sin desperdicio de agua con cera hidrofóbica e higiene interior profunda.',
    features: [
      'Lavado exterior seco con polímeros biodegradables',
      'Aspirado integral de butacas, alfombras y baúl',
      'Limpieza de paneles, torpedo y conductos de aire',
      'Acondicionador satinado con filtro UV en plásticos',
      'Brillo duradero en neumáticos y perfume exclusivo'
    ]
  },
  {
    id: 'detallado-interiores',
    name: 'Detallado de Interiores & Desinfección',
    price: 35000,
    duration: 90,
    tag: 'Limpieza Profunda',
    badgeColor: 'from-emerald-600 to-teal-600',
    description: 'Tratamiento integral antibacteriano con vapor, inyección/extracción en butacas y eliminación de olores.',
    features: [
      'Inyección y extracción profunda en butacas y tapizados',
      'Desinfección térmica a vapor en ductos y rincones',
      'Desengrasado y detallado con pinceles al detalle',
      'Ozonización profesional para eliminar ácaros y olores',
      'Tratamiento impermeabilizante para telas o cueros'
    ]
  },
  {
    id: 'tratamiento-ceramico',
    name: 'Tratamiento Cerámico 9H',
    price: 85000,
    duration: 150,
    tag: 'Protección Espejo 12 Meses',
    badgeColor: 'from-[#DC1B46] via-red-600 to-amber-600',
    description: 'Corrección de barniz en 3 pasos y sellado cerámico de extrema hidrofobia con protección contra micro-rayas.',
    features: [
      'Descontaminado químico y mecánico con claybar premium',
      'Pulido correctivo espejo (eliminación del 90% de swirls)',
      'Aplicación de sellador Cerámico 9H genuino (12 meses)',
      'Sellado repelente al agua en parabrisas y cristales',
      'Detallado completo de compartimento de motor'
    ]
  }
];

const DEFAULT_BOOKINGS = [
  {
    id: 'ORD-8921',
    clientName: 'Fernando Gómez',
    phone: '+54 9 11 5432-8899',
    vehicle: 'Toyota Corolla Cross',
    plate: 'AF 342 KL',
    serviceId: 'tratamiento-ceramico',
    serviceName: 'Tratamiento Cerámico 9H',
    date: '2026-07-03',
    time: '09:00',
    status: 'En Lavado',
    progress: 50,
    price: 85000
  },
  {
    id: 'ORD-8922',
    clientName: 'Mariana López',
    phone: '+54 9 11 4122-3344',
    vehicle: 'VW Golf GTI',
    plate: 'AD 981 PQ',
    serviceId: 'eco-premium',
    serviceName: 'Lavado Eco-Premium',
    date: '2026-07-03',
    time: '11:30',
    status: 'En Espera',
    progress: 10,
    price: 18000
  },
  {
    id: 'ORD-8923',
    clientName: 'Dr. Alejandro Rossi',
    phone: '+54 9 11 6788-9011',
    vehicle: 'BMW Serie 3',
    plate: 'AE 551 ZZ',
    serviceId: 'detallado-interiores',
    serviceName: 'Detallado de Interiores & Desinfección',
    date: '2026-07-03',
    time: '14:00',
    status: 'Listo',
    progress: 100,
    price: 35000
  }
];

// Emulated Database (Local Storage persistence for zero resource cost MVP)
const STORAGE_KEY = 'moreno_car_center_orders_v1';

export const getStoredBookings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading orders from localStorage', e);
  }
  return DEFAULT_BOOKINGS;
};

export const saveBookingToStorage = (newOrder) => {
  try {
    const current = getStoredBookings();
    const updated = [newOrder, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving order to localStorage', e);
    return [];
  }
};

export const updateBookingStatusInStorage = (orderId, newStatus) => {
  try {
    const current = getStoredBookings();
    const updated = current.map(o => {
      if (o.id === orderId) {
        const progress = newStatus === 'Listo' ? 100 : newStatus === 'En Lavado' ? 50 : 10;
        return { ...o, status: newStatus, progress };
      }
      return o;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error updating status in localStorage', e);
    return [];
  }
};
