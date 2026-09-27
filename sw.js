const CACHE_NAME = "rulings-1103-v16";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./card-metadata.js",
  "./card-metadata-a-row-batch-04.js",
  "./card-metadata-a-row-batch-05.js",
  "./rulings.js",
  "./rulings-a-row-batch-04.js",
  "./rulings-a-row-batch-05.js",
  "./app.js",
  "./damage-step-reference.png",
  "./effect-icon-equip.png",
  "./effect-icon-field.png",
  "./effect-icon-quick.png",
  "./effect-icon-ritual.png",
  "./effect-icon-continuous.png",
  "./effect-icon-counter.png",
  "./vylon-disigma.webp",
  "./vanitys-fiend.webp",
  "./vision-hero-adoration.webp",
  "./evolzar-laggia.webp",
  "./evocator-chevalier.webp",
  "./effect-veiler.webp",
  "./watt-squirrel.webp",
  "./watt-giraffe.webp",
  "./electric-virus.webp",
  "./elemental-hero-ice-edge.webp",
  "./elemental-hero-neos-alius.webp",
  "./elemental-hero-absolute-zero.webp",
  "./elemental-hero-stratos.webp",
  "./elemental-hero-gaia.webp",
  "./elemental-hero-great-tornado.webp",
  "./elemental-hero-the-shining.webp",
  "./elemental-hero-nova-master.webp",
  "./elemental-hero-bubbleman.webp",
  "./elemental-hero-prisma.webp",
  "./ancient-fairy-dragon.webp",
  "./ancient-holy-wyvern.webp",
  "./royal-decree.webp",
  "./royal-oppression.webp",
  "./necrovalley.webp",
  "./royal-curse.webp",
  "./obelisk-the-tormentor.webp",
  "./maxx-c.webp",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
  );
});
