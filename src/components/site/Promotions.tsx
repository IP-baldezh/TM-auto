import type { PromotionView, SectionView } from '@/lib/content';
import { Container } from '@/components/site/Section';
import { SmartImage } from '@/components/ui/SmartImage';

/**
 * Акции — первый блок после главного экрана.
 *
 * Карточка: слева текст и цена, справа автомобиль, выходящий за правый край.
 * Ключевой приём — крупная цена по акции против зачёркнутой обычной.
 *
 * Секция открывает светлую часть страницы, поэтому начинается градиентом:
 * сцена главного экрана растворяется в тёмном, и стык ink → paper вплотную
 * читался бы обрывом.
 */
export function Promotions({
  section,
  promotions,
}: {
  section: SectionView;
  promotions: PromotionView[];
}) {
  if (!section.enabled || promotions.length === 0) return null;

  return (
    <section id="promotions" className="relative bg-paper">
      {/* Всплытие из тёмного главного экрана */}
      <div
        aria-hidden="true"
        className="h-20 w-full bg-gradient-to-b from-ink to-paper sm:h-28 lg:h-32"
      />

      <div className="pb-20 md:pb-28 lg:pb-32">
        <Container>
          {section.title && (
            <h2
              className="display mx-auto max-w-[22ch] text-center text-[clamp(1.75rem,4.2vw,3.4rem)] leading-[1.06]"
              data-reveal="up"
            >
              {section.title}
            </h2>
          )}
          {section.subtitle && (
            <p
              className="mx-auto mt-5 max-w-[56ch] text-center text-[0.9375rem] leading-relaxed text-steel md:text-base"
              data-reveal="up"
            >
              {section.subtitle}
            </p>
          )}

          <ul className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2 lg:gap-6">
            {promotions.map((promo) => (
              <li
                key={promo.id}
                data-reveal="up"
                className="relative isolate overflow-hidden rounded-[1.25rem] bg-paper-2 p-6 sm:p-7 lg:p-8"
              >
                {/* Пометка о демо-данных не должна влиять на высоту карточки —
                    иначе макет «поедет», когда её заменят на реальную акцию. */}
                {promo.isDemo && (
                  <span className="absolute right-3 top-3 z-10 rounded-[3px] bg-ink/75 px-2 py-0.5 text-[0.625rem] uppercase tracking-wider text-paper">
                    Демо
                  </span>
                )}

                {/* Автомобиль справа, выходит за край карточки */}
                {promo.imageUrl && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-[46%] sm:w-[56%]">
                    <SmartImage
                      src={promo.imageUrl}
                      alt={promo.imageAlt ?? ''}
                      fill
                      sizes="(max-width: 768px) 60vw, 30vw"
                      className="scale-110 object-cover object-left [mask-image:linear-gradient(to_right,transparent,#000_38%)]"
                    />
                  </div>
                )}

                {/* На узкой карточке текст занимает почти всю ширину: левый
                    край изображения растворён маской, поэтому лёгкое
                    наложение не мешает читаемости. */}
                <div className="relative max-w-[78%] sm:max-w-[58%]">
                  <h3 className="text-[clamp(1.0625rem,1.9vw,1.5rem)] leading-snug">
                    {promo.title}
                  </h3>
                  {promo.subtitle && (
                    <p className="mt-2 text-[0.875rem] leading-relaxed text-steel">
                      {promo.subtitle}
                    </p>
                  )}

                  <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="display tabular text-[clamp(1.75rem,3.4vw,2.75rem)] leading-none">
                      {promo.price}
                    </span>
                    {promo.oldPrice && (
                      <span className="tabular text-[0.9375rem] text-steel-2 line-through">
                        {promo.oldPrice}
                      </span>
                    )}
                  </p>

                  <a
                    href={promo.ctaHref}
                    className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 text-[0.875rem] font-medium text-paper transition-colors hover:bg-graphite"
                  >
                    {promo.ctaLabel}
                  </a>

                  {promo.validUntil && (
                    <p className="mt-4 text-[0.8125rem] text-steel">
                      Акция действует до <span className="text-brand">{promo.validUntil}</span>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
}
