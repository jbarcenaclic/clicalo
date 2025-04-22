// public/service-worker.js
// Este archivo es el Service Worker de la aplicación
// Se encarga de gestionar la caché y las peticiones a la API
// Se registra en el index.html
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activado');
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const method = event.request.method;

  // Evita interferir con OPTIONS o la raíz /
  if (method === 'OPTIONS' || url.pathname === '/') {
    console.log(`[SW] Ignorado: ${method} ${url.pathname}`);
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('🛑 Sin conexión y sin cache', {
        status: 503,
        statusText: 'Offline',
      });
    })
  );
});
