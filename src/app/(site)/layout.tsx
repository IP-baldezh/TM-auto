import { getSiteContent } from '@/lib/content';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { MotionProvider, revealBootstrapScript } from '@/components/animations/MotionProvider';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getSiteContent();
  const primary = content.contacts.find((c) => c.isPrimary) ?? content.contacts[0] ?? null;

  return (
    <>
      {/* Класс ставится синхронно, до первой отрисовки — иначе блоки
          мигают: показываются, прячутся и только потом появляются. */}
      <script dangerouslySetInnerHTML={{ __html: revealBootstrapScript }} />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[3px] focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-paper"
      >
        Перейти к основному содержанию
      </a>

      <Header
        nav={content.nav.header}
        phone={primary?.phone ?? null}
        phoneLabel={primary?.label}
        brandName={content.site.brandName}
        brandNote={content.site.brandNote}
        logoUrl={content.site.logoUrl}
      />

      <main id="main">{children}</main>

      <Footer
        site={content.site}
        contacts={content.contacts}
        nav={content.nav.footer}
        legal={content.nav.legal}
      />

      <MotionProvider />
    </>
  );
}
