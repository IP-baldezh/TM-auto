import { AlertTriangle, FileText, ShieldAlert } from 'lucide-react';

import type { CaseView, SectionView } from '@/lib/content';
import { Container, Section } from '@/components/site/Section';
import { SmartImage } from '@/components/ui/SmartImage';

/**
 * Storytelling-блок: слева фотографии, справа объявление → находки →
 * риски → решение. Если кейс не заполнен, секция не рендерится вовсе.
 */
export function CaseStudySection({
  section,
  caseStudy,
}: {
  section: SectionView;
  caseStudy: CaseView | null;
}) {
  if (!section.enabled || !caseStudy) return null;

  const [lead, ...rest] = caseStudy.images;

  return (
    <Section id="case" tone="ink">
      <Container>
        <div className="h-px w-full bg-line-dark" data-reveal="mask" />

        <div className="grid gap-10 pt-8 lg:grid-cols-12 lg:gap-14 lg:pt-12">
          {/* ── Фотографии ──────────────────────────────────────────── */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              {lead && (
                <div
                  className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-graphite-2"
                  data-reveal="mask"
                >
                  <SmartImage
                    src={lead}
                    alt={caseStudy.imageAlt ?? 'Осмотр автомобиля'}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  {caseStudy.isDemo && (
                    <span className="eyebrow absolute left-3 top-3 rounded-[3px] bg-ink/85 px-2 py-1 text-white/85 backdrop-blur-sm">
                      Демо
                    </span>
                  )}
                </div>
              )}

              {rest.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {rest.slice(0, 2).map((src) => (
                    <div
                      key={src}
                      className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-graphite-2"
                      data-reveal="mask"
                    >
                      <SmartImage
                        src={src}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 50vw, 20vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Разбор ──────────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <span
              aria-hidden="true"
              className="mb-6 block h-px w-10 bg-brand"
              data-reveal="up"
            />

            <h2
              className="display text-[clamp(1.85rem,4.4vw,3.6rem)] leading-[1.04]"
              data-reveal="up"
            >
              {section.title ?? caseStudy.title}
            </h2>

            {/* Объявление */}
            <div className="mt-9 border-l-2 border-steel pl-5" data-reveal="up">
              <p className="eyebrow mb-2.5 flex items-center gap-2 text-steel-3">
                <FileText className="size-3.5" aria-hidden="true" />
                Что было в объявлении
              </p>
              <p className="text-lg font-semibold text-paper">{caseStudy.listingTitle}</p>
              {caseStudy.listingPrice && (
                <p className="tabular mt-1 text-2xl font-bold text-paper">
                  {caseStudy.listingPrice}
                </p>
              )}
              {caseStudy.listingText && (
                <p className="mt-3 max-w-[60ch] text-[0.9375rem] leading-relaxed text-steel-3">
                  {caseStudy.listingText}
                </p>
              )}
            </div>

            {/* Находки */}
            {caseStudy.findings.length > 0 && (
              <div className="mt-9 border-l-2 border-brand pl-5" data-reveal="up">
                <p className="eyebrow mb-3.5 flex items-center gap-2 text-brand">
                  <AlertTriangle className="size-3.5" aria-hidden="true" />
                  Что нашли при проверке
                </p>
                <ul className="space-y-2.5">
                  {caseStudy.findings.map((finding) => (
                    <li key={finding} className="flex gap-3 text-[0.9375rem] leading-snug">
                      <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
                      <span className="text-paper/90">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Риски */}
            {caseStudy.risks.length > 0 && (
              <div className="mt-9 border-l-2 border-steel pl-5" data-reveal="up">
                <p className="eyebrow mb-3.5 flex items-center gap-2 text-steel-3">
                  <ShieldAlert className="size-3.5" aria-hidden="true" />
                  Чем это грозило покупателю
                </p>
                <ul className="space-y-2.5">
                  {caseStudy.risks.map((risk) => (
                    <li key={risk} className="flex gap-3 text-[0.9375rem] leading-snug">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1 shrink-0 rounded-full bg-steel"
                      />
                      <span className="text-steel-3">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Решение */}
            <div className="mt-10 rounded-[4px] bg-graphite p-6 sm:p-8" data-reveal="up">
              <p className="text-xl font-bold tracking-[-0.02em] text-paper sm:text-2xl">
                {caseStudy.decisionTitle}
              </p>
              <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed text-steel-3">
                {caseStudy.decisionText}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
