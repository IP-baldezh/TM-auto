import { ArrowUpRight, Check } from 'lucide-react';

import type { SectionView, ServiceView } from '@/lib/content';
import { Container, Section, SectionHeading } from '@/components/site/Section';
import { SmartImage } from '@/components/ui/SmartImage';
import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/**
 * Четыре крупные панели вместо сетки одинаковых карточек: изображение и
 * текст чередуют стороны, чтобы полоса не читалась как таблица.
 */
export function Services({
  section,
  services,
  extraServices,
}: {
  section: SectionView;
  services: ServiceView[];
  extraServices: string[];
}) {
  if (!section.enabled || services.length === 0) return null;

  return (
    <Section id="services" tone="paper">
      <Container>
        <SectionHeading title={section.title} subtitle={section.subtitle} />

        <div className="space-y-px bg-line">
          {services.map((service, i) => (
            <article
              key={service.id}
              data-reveal="up"
              className="grid gap-0 bg-paper lg:grid-cols-12"
            >
              <div
                className={cn(
                  'relative aspect-[16/10] overflow-hidden bg-paper-3 lg:col-span-5 lg:aspect-auto lg:min-h-[22rem]',
                  i % 2 === 1 && 'lg:order-last',
                )}
              >
                <SmartImage
                  src={service.imageUrl ?? ''}
                  alt={service.imageAlt ?? service.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] hover:scale-[1.04]"
                />
                {service.featured && (
                  <span className="eyebrow absolute left-4 top-4 rounded-[3px] bg-brand px-2.5 py-1.5 text-white">
                    Чаще всего выбирают
                  </span>
                )}
              </div>

              <div className="flex flex-col justify-center px-0 py-9 lg:col-span-7 lg:px-12 lg:py-14">
                <span aria-hidden="true" className="mb-6 block h-px w-10 bg-brand" />

                <h3 className="text-[clamp(1.5rem,2.9vw,2.35rem)] leading-[1.08]">
                  {service.title}
                </h3>

                <p className="mt-4 max-w-[62ch] text-[0.9375rem] leading-relaxed text-steel">
                  {service.excerpt}
                </p>

                {service.outcomes.length > 0 && (
                  <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                    {service.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-start gap-2.5 text-[0.875rem]">
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-brand"
                          strokeWidth={2.5}
                          aria-hidden="true"
                        />
                        <span className="leading-snug">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-8">
                  <ButtonLink href={service.ctaHref} variant="outline" size="md">
                    {service.ctaLabel}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </ButtonLink>
                </div>
              </div>
            </article>
          ))}
        </div>

        {extraServices.length > 0 && (
          <div className="mt-14 border-t border-line pt-8" data-reveal="up">
            <p className="eyebrow mb-5 text-steel-2">Также доступно</p>
            <ul className="flex flex-wrap gap-2.5">
              {extraServices.map((item) => (
                <li
                  key={item}
                  className="rounded-[3px] border border-line-strong px-3.5 py-2 text-[0.8125rem] text-steel"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </Section>
  );
}
