import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Manrope, Unbounded } from 'next/font/google';

import './globals.css';

/**
 * Unbounded Bold — заголовки. Широкий геометрический гротеск с полноценной
 * кириллицей, хорошо держит крупный кегль.
 * Manrope — основной текст и интерфейс.
 * JetBrains Mono — технические подписи и числовые метки.
 */
const unbounded = Unbounded({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-unbounded',
  display: 'swap',
  weight: ['700'],
});

const manrope = Manrope({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Подбор авто в Дзержинске — Sunservice',
  description: 'Профессиональный подбор и проверка автомобиля перед покупкой в Дзержинске.',
};

export const viewport: Viewport = {
  themeColor: '#0e1114',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning — намеренно: до гидратации класс на <html>
    // меняют два внешних участника. Скрипт из MotionProvider ставит
    // js-reveal-ready (иначе блоки успевают мигнуть), а Lenis дописывает
    // свои классы. Разметка от этого не расходится — меняется только
    // атрибут class корневого элемента.
    <html
      lang="ru"
      className={`${unbounded.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
