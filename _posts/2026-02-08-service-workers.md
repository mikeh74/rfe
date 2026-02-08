---
layout: default
title: "Service Workers"
tags: [JS]
---

# Service Workers

A service worker is a script that your browser runs in the background, separate
from a web page, opening the door to features that don't need a web page or user
interaction.

Google provides a set of tools for working with service workers called
[workbox](https://developers.google.com/web/tools/workbox).

The examples below use the workbox library.

## Service worker setup for django

Register the route in the project URLs:

```python

# project_root/urls.py

from django.views.generic import TemplateView

urlpatterns += i18n_patterns(
    url(r'^service-worker.js', (TemplateView.as_view(
        template_name="service-worker.js",
        content_type='application/javascript',
    )), name='service-worker.js'),
)
```

Once we've done that then we can add a the template which contains the service worker.

```
        <!-- bottom of base.html -->

        <script>
        // Check that service workers are supported
        if ('serviceWorker' in navigator) {
          // Use the window load event to keep the page load performant
          window.addEventListener('load', () => {
            navigator.serviceWorker.register('/en/service-worker.js');
          });
        }
        </script>

```

## Service worker script

Example file

```javascript

// Example service worker
// https://developers.google.com/web/tools/workbox/guides/get-started
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

const setCacheNameDetails = workbox.core.setCacheNameDetails;
const precacheAndRoute = workbox.precaching.precacheAndRoute;
const registerRoute = workbox.routing.registerRoute;
const StaleWhileRevalidate = workbox.strategies.StaleWhileRevalidate;
const NetworkFirst = workbox.strategies.NetworkFirst;
const CacheFirst = workbox.strategies.CacheFirst;
const NetworkOnly = workbox.strategies.NetworkOnly;
const CacheableResponsePlugin = workbox.cacheableResponse.CacheableResponsePlugin;
const ExpirationPlugin = workbox.expiration.ExpirationPlugin;
const setDefaultHandler = workbox.routing.setDefaultHandler;
const setCatchHandler = workbox.routing.setCatchHandler;


setCacheNameDetails({
  prefix: 'myapp',
  suffix: 'v3',
});

// You need to create this page in django
const FALLBACK_HTML_URL = '/en/offline';

// Precache assets
workbox.precaching.precacheAndRoute([
  { 'url': FALLBACK_HTML_URL, 'revision': 1 },
]);

const adminNoCache = () => {

  // only ever use network for django admin
  registerRoute(
    ({ url }) =>
      url.pathname.includes('/admin/') ||
      url.pathname.includes('/cms_login/') ||
      url.pathname.includes('/cms_wizard/') ||
      url.searchParams.has('structure'),
    new NetworkOnly(),
  );
}

adminNoCache();

// https://developers.google.com/web/tools/workbox/modules/workbox-recipes#google_fonts_cache
const googleFontCache = () => {

  let sheetCacheName = 'google-fonts-stylesheets';
  let fontCacheName = 'google-fonts-webfonts';
  let maxAgeSeconds = 60 * 60 * 24 * 365;
  let maxEntries = 30;

  registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: sheetCacheName,
    }),
  );

  // Cache the underlying font files with a cache-first strategy for 1 year.
  registerRoute(
    ({ url }) => url.origin === 'https://fonts.gstatic.com',
    new CacheFirst({
      cacheName: fontCacheName,
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new ExpirationPlugin({
          maxAgeSeconds,
          maxEntries,
        }),
      ],
    }),
  );
}

googleFontCache();

// https://developers.google.com/web/tools/workbox/modules/workbox-recipes#static_resources_cache
const staticResourceCache = () => {

  let matchCallback = ({ request }) =>
    // CSS
    request.destination === 'style' ||
    // JavaScript
    request.destination === 'script' ||
    // Web Workers
    request.destination === 'worker';

  registerRoute(
    matchCallback,
    new StaleWhileRevalidate({
      cacheName: 'static-resources',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    }),
  );

}

staticResourceCache();

// https://developers.google.com/web/tools/workbox/modules/workbox-recipes#image_cache
const imageCache = () => {

  registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
      cacheName: 'images',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    }),
  );
}

imageCache();

// main document caching
// Network first
// check for status 200 and check for X-Is-Cacheable header
// updated based on this recipe:
// https://developers.google.com/web/tools/workbox/modules/workbox-recipes#pattern_3

const documentCache = () => {

  const networkTimeoutSeconds = 3;

  registerRoute(
    ({ request }) => request.mode === 'navigate' 
      || request.destination === 'document',
    new NetworkFirst({
      networkTimeoutSeconds,
      cacheName: 'document-cache',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
          headers: {
            'X-Is-Cacheable': 'true'
          }
        })
      ]
    })
  );

}

documentCache();

// Use a network first strategy for all other requests as we don't know whether
// they have any other side affects (such as containing a CSRF token etc)
setDefaultHandler(
  new NetworkFirst({
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
        headers: {
          'X-Is-Cacheable': 'true'
        }
      })
    ]
  }),
);

// https://developers.google.com/web/tools/workbox/guides/advanced-recipes
setCatchHandler(({ event }) => {
  switch (event.request.destination) {
    case 'document':
      return workbox.precaching.matchPrecache(FALLBACK_HTML_URL);
      break;

    // case 'image':
    //   // If using precached URLs:
    //   // return matchPrecache(FALLBACK_IMAGE_URL);
    //   return caches.match(FALLBACK_IMAGE_URL);
    // break;

    default:
      return Response.error();
  }
});


```

## Unregistering service workers

I found that I needed to uninstall a service worker that we causing problems and found this
stack overflow post really useful:
https://stackoverflow.com/questions/33704791/how-do-i-uninstall-a-service-worker

In the end this is the solution I went with:

```html

<script>
    if ('serviceWorker' in navigator) {
      // Use the window load event to keep the page load performant
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
        } 
      });
    }
</script>


```