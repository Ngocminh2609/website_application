import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * Cấu hình Vite cho dự án.
 * Tích hợp PWA để hỗ trợ cài đặt ứng dụng, sử dụng offline và tự động cập nhật.
 */
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt', // Hiển thị thông báo khi có bản cập nhật mới để tránh gián đoạn đột ngột
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Elite Shop - Nền tảng mua sắm đẳng cấp',
        short_name: 'EliteShop',
        description: 'Hệ thống mua sắm trực tuyến chuyên nghiệp với trải nghiệm mượt mà.',
        theme_color: '#6366f1',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Cấu hình caching nâng cao
        runtimeCaching: [
          {
            // Cache các assets như JS, CSS, fonts
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 năm
              }
            }
          },
          {
            // Cache hình ảnh sản phẩm
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 ngày
              }
            }
          },
          {
             // Cache API requests để hỗ trợ xem offline tạm thời
             urlPattern: /^https:\/\/.*\/api\/.*/i,
             handler: 'NetworkFirst',
             options: {
               cacheName: 'api-cache',
               networkTimeoutSeconds: 5,
               expiration: {
                 maxEntries: 50,
                 maxAgeSeconds: 60 * 60 // 1 giờ
               },
               cacheableResponse: {
                 statuses: [0, 200]
               }
             }
          }
        ]
      }
    })
  ],
  define: {
    global: 'window',
  },
})
