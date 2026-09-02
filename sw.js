/* ================================================
   Ψηφιακό Προσευχητάρι — Service Worker v4
   Δεν χρειάζεται πια να προσθέτεις εδώ χειροκίνητα
   νέα τραγούδια ή φωτογραφίες. Προστίθενται μόνα τους
   στην cache μόλις τα δει/ακούσει ένας επισκέπτης.
   ================================================ */

const CACHE = 'proseyxitari-v4';

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './church.jpg',
  './keri.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(PRECACHE.map(url => cache.add(url).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = e.request.url;

  // ΝΕΟ: αγνόησε ό,τι δεν είναι κανονικό http/https αίτημα
  // (π.χ. chrome-extension:// από επεκτάσεις του browser του επισκέπτη —
  // αυτό προκαλούσε το σφάλμα "Request scheme chrome-extension is unsupported")
  if (!url.startsWith('http')) return;

  if (
    url.includes('translate.google') ||
    url.includes('googleapis') ||
    url.includes('gstatic') ||
    url.includes('translate.goog') ||
    url.includes('/api/')
  ) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE).then(cache => cache.put(e.request, clone)).catch(() => {});
          }
          return response;
        })
        // ΝΕΟ: αν αποτύχει και το δίκτυο ΚΑΙ δεν υπάρχει τίποτα στην cache,
        // επίστρεψε μια έγκυρη (αν και άδεια) απάντηση αντί για "τίποτα"
        // (αυτό προκαλούσε το σφάλμα "Failed to convert value to Response")
        .catch(() => cached || Response.error());

      return cached || network;
    })
  );
});
