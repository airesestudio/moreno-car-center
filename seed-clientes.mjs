// seed-clientes.mjs
// Siembra datos de demo en Firestore Staging para Moreno Car Center
// Ejecutar con: node seed-clientes.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAEdUKkEakc3swgf9MdYbkkPSMcv4CKhFY",
  authDomain: "moreno-car-center-stg.firebaseapp.com",
  projectId: "moreno-car-center-stg",
  storageBucket: "moreno-car-center-stg.firebasestorage.app",
  messagingSenderId: "327986348560",
  appId: "1:327986348560:web:09ec5ddf51df18027f8095"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const clientes = [
  { patente: 'AE123CD', name: 'Carlos Rodríguez', phone: '11 5544 3322', brandModel: 'Volkswagen Amarok V6' },
  { patente: 'AD456EF', name: 'María Gómez',      phone: '11 8877 6655', brandModel: 'Toyota Corolla Cross' },
  { patente: 'AF789GH', name: 'Lucas Moreno',     phone: '11 2233 4455', brandModel: 'Toyota Hilux SRX' },
];

async function seed() {
  console.log('🌱 Sembrando clientes en Firestore Staging...\n');
  for (const cliente of clientes) {
    const { patente, ...data } = cliente;
    const ref = doc(db, 'clientes', patente);
    await setDoc(ref, { ...data, updatedAt: new Date().toISOString() });
    console.log(`  ✅ ${patente} → ${data.name} (${data.brandModel})`);
  }
  console.log('\n✅ Listo. Verificá en la consola de Firebase Staging.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
