import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // 70 — плита неба (гладкий градиент), 88 — автомобиль (главный кадр),
    // 75 — всё остальное.
    qualities: [70, 75, 88],
    remotePatterns: [
      // DEMO-изображения из Unsplash (Unsplash License). Заменяются через админку.
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Собственный S3-совместимый бакет (Yandex Object Storage / MinIO / R2).
      ...(process.env.NEXT_PUBLIC_ASSET_HOST
        ? [{ protocol: 'https' as const, hostname: process.env.NEXT_PUBLIC_ASSET_HOST }]
        : []),
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default nextConfig;
