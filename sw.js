// Офлайн-режим: оболочка кэшируется при установке, фотографии — по мере просмотра.
const SHELL = 'glagolica-shell-v1';
const PHOTOS = 'glagolica-photos-v1';
const PHOTO_LIMIT = 400;
const SHELL_FILES = ['./', './index.html', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL).then(cache => cache.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== SHELL && key !== PHOTOS).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// Кэш не должен расти бесконечно: держим последние PHOTO_LIMIT снимков.
async function trimPhotos() {
  const cache = await caches.open(PHOTOS);
  const keys = await cache.keys();
  if (keys.length <= PHOTO_LIMIT) return;
  await Promise.all(keys.slice(0, keys.length - PHOTO_LIMIT).map(key => cache.delete(key)));
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (url.hostname === 'images.pexels.com') {
    event.respondWith(caches.open(PHOTOS).then(async cache => {
      const hit = await cache.match(request);
      if (hit) return hit;
      try {
        const response = await fetch(request);
        if (response.ok || response.type === 'opaque') { cache.put(request, response.clone()); trimPhotos(); }
        return response;
      } catch (error) {
        return hit || Response.error();
      }
    }));
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Страницу берём из сети, но держим свежую копию в кэше на случай офлайна.
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response.ok) { const cache = await caches.open(SHELL); cache.put(request, response.clone()); }
      return response;
    } catch (error) {
      const cached = await caches.match(request) || await caches.match('./index.html');
      return cached || Response.error();
    }
  })());
});
