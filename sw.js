  /* ================================================
   Ψηφιακό Προσευχητάρι — Service Worker v2
   ================================================ */

const CACHE = 'proseyxitari-v2';

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './church.jpg',
  './keri.png',
  './Αξιον Εστιν.mp3',
  './Ἐλέησόν.mp3',
  './ΕΥΛΟΓΕΙ Η ΨΥΧΗ ΜΟΥ.MP3',
  './Προσευχή.MP3',
  './Σε υμνούμεν.mp3',
  './Cello in Shadow.mp3',
  './Veinte Años.mp3',
  './piano1.mp3',
   './Just For You.mp3',
   './Lysistrata.mp3',
   './Her Slavic Soul.mp3',
  './La Serpiente De Oro .mp3',
  './Luz Casal Piensa en mi.mp3',
  './Milonguea del Ayer.mp3',
  './Pavlo Mediterranean Eyes.mp3',
 './The Gypsy Queens LItaliano Toto Cutugno.mp3',
 './ΤΟ ΤΑΝΓΚΟ ΤΟΥ ΕΡΩΤΑ.mp3',
 './La Serpiente De Oro.mp3',
 './Dancing.mp3',
  './Tango de Rêve.mp3',
 './Tango Instrumental.mp3',
 './Czardas VMonti.mp3',

];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(PRECACHE.map(url => cache.add(url).catch(()=>{})))
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
  if(e.request.method !== 'GET') return;
 if(e.request.method !== 'GET') return;
if(e.request.url.includes('translate.google') ||
   e.request.url.includes('googleapis') ||
   e.request.url.includes('gstatic') ||
   e.request.url.includes('translate.goog')) return;
  e.respondWith(
    fetch(e.request)
      .then(response => {
        if(response && response.status === 200){
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
