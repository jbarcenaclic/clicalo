self.addEventListener('install', (event) => {
    console.log('[SW] Instalando...');
    self.skipWaiting();
  });
  
  self.addEventListener('activate', (event) => {
    console.log('[SW] Activado');
  });
  
  self.addEventListener('fetch', (event) => {
    // Si falla el fetch, mostrar fallback
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response('🛑 Sin conexión y sin cache', {
          status: 503,
          statusText: 'Offline',
        });
      })
    );
  });
  