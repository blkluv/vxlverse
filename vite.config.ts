import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";
import compression from "vite-plugin-compression";
import { splitVendorChunkPlugin } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Determine if we're in development mode
  const isDev = mode === "development";

  return {
    plugins: [
      react(),
      tailwindcss(),
      // Add code splitting plugin
      splitVendorChunkPlugin(),
      // Add compression plugin for gzip
      compression({
        algorithm: "gzip",
        ext: ".gz",
      }),
      // Add compression plugin for brotli
      compression({
        algorithm: "brotliCompress",
        ext: ".br",
      }),
      VitePWA({
        // Disable service worker in development mode
        disable: isDev,
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
        manifest: {
          name: "VXLverse - 3D Game Creation Platform",
          short_name: "VXLverse",
          description:
            "Create immersive 3D games with VXLverse, a powerful browser-based voxel game editor",
          theme_color: "#121212",
          background_color: "#121212",
          display: "standalone",
          icons: [
            {
              src: "/icons/android/android-launchericon-72-72.png",
              sizes: "72x72",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "/icons/android/android-launchericon-96-96.png",
              sizes: "96x96",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "/icons/ios/128.png",
              sizes: "128x128",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "/icons/ios/144.png",
              sizes: "144x144",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "/icons/ios/152.png",
              sizes: "152x152",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "/icons/android/android-launchericon-192-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "/icons/ios/512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 5000000, // Increase to 5MB
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.vxlverse\.com\/api\/.*/i,
              handler: "NetworkFirst",
              options: {
                cacheName: "api-cache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24, // 24 hours
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
              handler: "CacheFirst",
              options: {
                cacheName: "images-cache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
              },
            },
            {
              urlPattern: /\.(?:js|css)$/,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "static-resources",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
          ],
        },
      }),
    ],
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "three",
        "@react-three/fiber",
        "@react-three/drei",
        "@react-three/rapier",
      ],
      exclude: ["lucide-react"],
    },
    worker: {
      format: "es",
    },
    server: {
      proxy: {
        "/api": {
          target: "https://api.vxlverse.com",
          changeOrigin: true,
        },
      },
      // Compression will be handled by the compression plugin
    },
    build: {
      target: "esnext",
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      // Enable chunking for better caching and loading
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "three-vendor": [
              "three",
              "@react-three/fiber",
              "@react-three/drei",
              "@react-three/rapier",
            ],
            "ui-vendor": ["lucide-react", "framer-motion"],
          },
          // Limit chunk size
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
        },
      },
      // Enable source maps for production debugging if needed
      sourcemap: true,
      // Reduce chunk size
      chunkSizeWarningLimit: 1000,
    },
  };
});
