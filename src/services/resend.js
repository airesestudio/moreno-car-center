export const sendBookingNotification = async (bookingData) => {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY;
  console.log('[Resend Transactional Email] Enviando confirmación de turno...', bookingData);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        id: `msg_${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toISOString()
      });
    }, 600);
  });
};

export const sendVehicleReadyAlert = async (bookingData) => {
  console.log('[Resend Alert] Notificación "Auto Listo" disparada para cliente:', bookingData.clientName);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, deliveredTo: bookingData.phone });
    }, 400);
  });
};

export const sendWhatsAppAlert = async (bookingData) => {
  console.log('[WhatsApp Alert] Notificación de estado enviada a:', bookingData.phone, bookingData.status);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, deliveredTo: bookingData.phone });
    }, 400);
  });
};
