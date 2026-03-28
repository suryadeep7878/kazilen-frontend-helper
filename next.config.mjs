import withPWAInit from "@ducanh2912/next-pwa";

const runtimeCaching = [
  // 1. Static Assets (JS/CSS)
  {
    urlPattern: /^https?.*\.(?:js|css)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'kazilen-static-assets-v1',
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      },
    },
  },
  // 2. Images (Optimized only)
  {
    urlPattern: /^https?.*\.(?:webp|avif|jpeg|jpg|png|svg)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'kazilen-images-v1',
      expiration: {
        maxEntries: 80, // strictly limited per requirements
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
  // 3. API POST Requests (Background Sync)
  {
    urlPattern: /\/api\/.*/i,
    handler: 'NetworkOnly',
    method: 'POST',
    options: {
      backgroundSync: {
        name: 'booking-queue-v1',
        options: {
          maxRetentionTime: 24 * 60,
        },
      },
    },
  },
  // 4. API GET Requests (NetworkFirst for API)
  {
    urlPattern: /\/api\/.*/i,
    handler: 'NetworkFirst',
    method: 'GET',
    options: {
      cacheName: 'kazilen-api-get-v1',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60,
      },
      networkTimeoutSeconds: 5,
    },
  },
  // 5. Next.js Pages (StaleWhileRevalidate)
  {
    urlPattern: /^https?.*/, 
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'kazilen-pages-v1',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60,
      },
    },
  },
];

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // Exclude large PNGs specifically from being precached by webpack and regular statics
  buildExcludes: [/app-build-manifest\.json$/, /.*\/subcategories\/.*\.png$/i, /.*icon-(384x384|512x512)\.png$/i],
  publicExcludes: ['!subcategories/**/*.png', '!icons/icon-384x384.png', '!icons/icon-512x512.png'],
  runtimeCaching,
  fallbacks: {
    document: "/offline.html",
  },
});





/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withPWA(nextConfig);