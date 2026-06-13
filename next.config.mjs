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
  //{
  //  urlPattern: /\/api\/.*/i,
  //  handler: 'NetworkFirst',
  //  method: 'GET',
  //  options: {
  //   cacheName: 'kazilen-api-get-v1',
  //    expiration: {
  //      maxEntries: 100,
  //      maxAgeSeconds: 24 * 60 * 60,
  //    },
  //    networkTimeoutSeconds: 5,
  //  },
  //},
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
  output: "standalone",

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), browsing-topics=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://api.mapbox.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.mapbox.com; img-src 'self' blob: data: http://localhost:8888; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://kazilen-prod-899213799870.asia-south1.run.app http://127.0.0.1:8000 http://localhost:8000 ws://127.0.0.1:8000 ws://localhost:8000 https://api.mapbox.com https://events.mapbox.com; worker-src 'self' blob:;",
          },
        ],
      },
    ];
  },
};



export default withPWA(nextConfig);
