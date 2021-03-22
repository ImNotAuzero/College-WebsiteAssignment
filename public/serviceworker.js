// Service Worker

const cacheName = 'Ocean View'; // Name of cache collection
const cacheURL = [
  // Main CSS & JS
  '/js/placeholders.images.min.js',
  '/js/jquery.js',
  '/js/bootstrap.min.js.map',
  '/css/bootstrap.min.css',
  '/css/style.css',
  '/js/bootstrap.min.js',
  '/js/bootstrap.bundle.min.js',

  // Navigation
  '/footer.html',
  '/navbar.html',

  // SW manifest
  '/manifest.json',

  // Homepage
  '/home/index.html',
  '/images/homepage/bellagiopond.jpeg',
  '/images/homepage/hotelfront.jpeg',
  '/images/homepage/rooftoppool.png',
  '/images/homepage/scenic.jpg',
  '/images/homepage/vegasstrip.jpg',

  // About
  '/home/about.html',
  '/images/downwardsArrow.png',

  // Reviews
  '/home/reviews.html',

  // ReviewForm
  '/home/reviewForm.html',

  // Contact
  '/home/contactus.html',

  // Rooms
  '/home/rooms.html',

  // Login
  '/auth/login.html'
];

// Upon going to the page, add all the sites to cache
self.addEventListener('install', event => {
  console.log('ServiceWorker install event');
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(cacheURL);
    })
  );
});

// Fetch Cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, { ignoreSearch: true }))
      .then(response => {
        return response || fetch(event.request);
      })
  );
});