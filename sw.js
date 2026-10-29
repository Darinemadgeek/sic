const PREFIX = 'silkcannons-demo-';
const CACHE = PREFIX + 'v2-202610291707';   // (v2 : la page en cache sous « ./ »)
const CORE = ['./', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'fonts/fonts.css', 'fonts/langues-kr-1.woff2', 'fonts/langues-sc-1.woff2', 'fonts/manrope-400-800-cyrillic-ext.woff2', 'fonts/manrope-400-800-cyrillic.woff2', 'fonts/manrope-400-800-latin-ext.woff2', 'fonts/manrope-400-800-latin.woff2', 'fonts/noto-serif-500-800-cyrillic.woff2', 'fonts/noto-serif-500-800-latin.woff2', 'fonts/pinceau-1.woff2', 'fonts/shippori-500-latin-ext.woff2', 'fonts/shippori-500-latin.woff2', 'fonts/shippori-600-latin-ext.woff2', 'fonts/shippori-600-latin.woff2', 'fonts/shippori-700-latin-ext.woff2', 'fonts/shippori-700-latin.woff2', 'fonts/shippori-800-latin-ext.woff2', 'fonts/shippori-800-latin.woff2', 'fonts/socle-700-1.woff2', 'fonts/socle-700-plus1-1.woff2', 'fonts/socle-700-plus2-1.woff2', 'fonts/socle-700-plus3-1.woff2', 'fonts/socle-700-plus4-1.woff2', 'fonts/socle-800-1.woff2', 'fonts/socle-800-plus1-1.woff2', 'fonts/socle-800-plus2-1.woff2', 'fonts/socle-800-plus3-1.woff2', 'fonts/socle-800-plus4-1.woff2', 'fonts/symboles-manrope-1.woff2', 'fonts/symboles-noto-sans-math-1.woff2', 'fonts/symboles-noto-sans-symbols-2-1.woff2', 'fonts/symboles-noto-sans-symbols-2-plus1-1.woff2', 'fonts/symboles-noto-sans-symbols-2-plus2-1.woff2', 'fonts/symboles-noto-sans-symbols-2-plus3-1.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
// (seules les anciennes versions de ce cache partent : les autres jeux du site ont les leurs)
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const scope = new URL('./', self.registration.scope).pathname;
  if (url.origin !== location.origin || !url.pathname.startsWith(scope)) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req.url, { cache: 'no-cache' }).then(r => {
      if (r.ok && !r.redirected) { const cp = r.clone(); caches.open(CACHE).then(c => c.put('./', cp)); }
      return r;
    }).catch(() => caches.match('./')));
  } else {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok && !r.redirected) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return r; })));
  }
});
