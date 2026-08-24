import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';

import './globals.css';

/**
 * Montserrat Bold — заголовки.
 * Inter — основной текст, интерфейс и технические подписи.
 */
const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['700', '800'],
});

const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Авто под заказ из-за рубежа — ТМ Авто',
  description: 'Подбор и доставка автомобилей из любой страны: таможня, доставка, СБКТС. Работаем по всей России.',
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
      className={`${montserrat.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
