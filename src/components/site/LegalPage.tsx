import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import type { SiteSettingsView } from '@/lib/content';
import { Container } from '@/components/site/Section';

export function LegalPage({
  title,
  sections,
  site,
}: {
  title: string;
  sections: { heading: string; paragraphs: string[] }[];
  site: SiteSettingsView;
}) {
  return (
    <div className="bg-paper pb-24 pt-28 sm:pt-36">
      <Container>
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-steel transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          На главную
        </Link>

        <h1 className="display max-w-[22ch] text-[2rem] sm:text-[2.6rem] lg:text-[3.1rem]">
          {title}
        </h1>

        <div className="mt-12 max-w-[70ch] border-t border-line">
          {sections.map((section) => (
            <section key={section.heading} className="border-b border-line py-8">
              <h2 className="text-lg font-bold tracking-[-0.02em]">{section.heading}</h2>
              {section.paragraphs.map((paragraph, i) => (
                <p key={i} className="mt-3 text-[0.9375rem] leading-relaxed text-steel">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <p className="mt-10 max-w-[70ch] rounded-[3px] border border-line-strong bg-paper-2 p-5 text-[0.8125rem] leading-relaxed text-steel">
          <strong className="font-semibold text-ink">Шаблон, требующий проверки.</strong> Текст
          подготовлен как типовая заготовка и должен быть согласован с юристом до публикации:
          необходимо указать полное наименование оператора, ИНН/ОГРН и регистрационные данные.
          Реквизиты заполняются в админ-панели, раздел «Настройки». Адрес:{' '}
          {site.address}.
        </p>
      </Container>
    </div>
  );
}
