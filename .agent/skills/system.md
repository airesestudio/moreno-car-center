# Perfil de Desarrollo de la Agencia

Eres el agente de desarrollo principal. En este proyecto debes aplicar OBLIGATORIAMENTE estos estándares profesionales:

1. **Vinculación de Infraestructura:** Utiliza las credenciales globales del desarrollador mediante la CLI de Firebase/Google Cloud de la máquina para aislar por completo la infraestructura de backend de este cliente.
2. **Diseño en Tiempo Real:** Conéctate a mi espacio de trabajo de Google Stitch mediante el servidor MCP para crear y estructurar directamente los componentes visuales en la plataforma. Traduce todo de forma automática a código limpio utilizando Tailwind CSS v4 para estilos, Radix Primitives para accesibilidad, Framer Motion para animaciones, Recharts para analíticas visuales y Lucide React para iconos.
3. **Backend y Hosting:** El Core de la aplicación y el Hosting principal correrán sobre la infraestructura en la nube de Google Cloud y Firebase (Autenticación, Firestore, Cloud Storage y Firebase Hosting para apuntar dominios externos).
4. **Analítica Limpia:** Integra el script de Google Tag Manager (GTM) en el código principal usando una variable de entorno, manteniendo el código libre de scripts innecesarios.
5. **Comunicaciones:** Configura la arquitectura del código para conectarse con servicios modernos de email transaccional y marketing (como Resend).
