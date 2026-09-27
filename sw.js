const CACHE_NAME = "rulings-1103-v18";
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
  "./rulings-k-row.js",
  "./corrections-a-row.js",
  "./site-enhancements.js",
  "./article-gale-effect.png",
  "./article-mystery-space.png",
  "./infernity-common-cover.webp",
  "./infernity-common-overview.webp",
  "./k-01-extra-1.jpg",
  "./k-01.png",
  "./k-02.png",
  "./k-03.png",
  "./k-04.png",
  "./k-05.png",
  "./k-06.png",
  "./k-07.png",
  "./k-08.png",
  "./k-09.png",
  "./k-10.png",
  "./k-11.png",
  "./k-12.png",
  "./k-13.png",
  "./k-14.png",
  "./k-15.png",
  "./k-16.png",
  "./k-17.png",
  "./k-18.png",
  "./k-19.png",
  "./k-20.png",
  "./k-21.png",
  "./k-22.png",
  "./k-23.png",
  "./k-24.png",
  "./k-25.png",
  "./k-26-extra-1.jpg",
  "./k-26.png",
  "./k-27-extra-1.png",
  "./k-27.png",
  "./k-28.png",
  "./k-29.png",
  "./k-30.png",
  "./k-31.jpg",
  "./k-32.png",
  "./k-33.png",
  "./k-34.png",
  "./k-35.png",
  "./k-36.png",
  "./k-37.png",
  "./k-38-extra-1.jpg",
  "./k-38-extra-2.jpg",
  "./k-38.png",
  "./k-39-extra-1.jpg",
  "./k-39.png",
  "./k-40.png",
  "./k-41-extra-1.png",
  "./k-41.png",
  "./k-42.png",
  "./k-43.png",
  "./k-44.png",
  "./pot-of-duality-flowchart.png",
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
