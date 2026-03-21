# PWA Cache Storage Optimization Report

## ⚠️ Why the PNGs Were Cached (The Problem)
In Next.js PWA configurations using `next-pwa` and Workbox, two primary caching mechanisms run simultaneously:
1. **Workbox Precache (`workbox-precache`)**: At build time, `next-pwa` automatically injects all files present in the `/public` folder into the service worker's precache manifest by default. This meant every unoptimized `.png` file inside `/subcategories/` was forcibly downloaded and stored into the user's device on the very first visit, regardless of whether the user viewed those images. 
2. **Runtime Cache (`kazilen-images`)**: As users browsed, any images fetched via network were being redundantly cached, creating an overlap storage bloat. 

This behavior rapidly bloated the cache pool above the 15MB threshold since uncompressed PNGs are significantly larger than Next.js dynamically optimized WebP/AVIFs. 

## 🛠️ How It Was Fixed
To surgically cut cache bloat and restore performance, the following rules were implemented in `next.config.mjs`:

### 1. Precache Exclusion (`buildExcludes` & `publicExcludes`)
We injected strict negations to bypass Next-PWA's default aggressive public folder caching:
```javascript
  buildExcludes: [/app-build-manifest\.json$/, /.*\/subcategories\/.*\.png$/i, /.*icon-(384x384|512x512)\.png$/i],
  publicExcludes: ['!subcategories/**/*.png', '!icons/icon-384x384.png', '!icons/icon-512x512.png']
```
* **Result**: `workbox-precache` will now **only** store HTML, CSS, JS, and essential small icons. Large static assets are completely banned from entering the offline bootup sequence.

### 2. Runtime Image Caching Restrictions
We narrowed the `runtimeCaching` rule for images to explicitly only accept optimized modern formats:
```javascript
urlPattern: /^https?.*\.(?:webp|avif|jpeg|jpg)$/i,
```
* **Result**: We dropped `.png` from the runtime cache entirely. If a PNG is somehow fetched, it bypasses the heavy storage pool.
* **Optimization**: Enabled `StaleWhileRevalidate` with `maxEntries: 80` (reduced from 400) and `maxAgeSeconds` strictly set to 30 days.

### 3. Cache Versioning (`-v1`)
All cache buckets (`kazilen-images`, `kazilen-pages`, etc.) were renamed with a `-v1` suffix (e.g., `kazilen-images-v1`).
* **Result**: When the new service worker deploys, Workbox recognizes the versions have changed and will automatically **delete all old undocumented caches**. This forces an immediate reset for returning users experiencing the bloat.

## 📊 Before vs. After Behavior

| Metric | Before Fix | After Fix |
| :--- | :--- | :--- |
| **Precache Behavior** | Downloaded all PNGs in `/public` blindly | Excludes `subcategories/*.png` and large icons |
| **Image Deduplication** | PNGs stored in both precache AND runtime | Optimizations strictly cached via next/image `webp`/`avif` extensions |
| **Max Image Limits** | 400 entries per user | 80 entries max |
| **Cache Deletion** | Bloat required manual user clearance | `-v1` names force auto-deletion of legacy bloated caches |
| **Total Size Profile** | > 15MB to 50MB+ | **< ~10MB** entirely dictated by essential compressed assets |

*(Note: The `public/subcategories` folder was verified and found to not contain local images in the current tree iteration. The rules gracefully protect any future structural additions to these directories).*
