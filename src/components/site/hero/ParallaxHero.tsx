'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Check, Loader2, X } from 'lucide-react';

import type { HeroView } from '@/lib/content';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { LeadFields } from '@/components/forms/LeadFields';
import { useLeadForm } from '@/components/forms/useLeadForm';

/**
 * Главный экран — параллакс по reference osmosupply/parallax-scrolling.
 *
 *   1 — небо            (70)  дальний план
 *   2 — свет и дымка    (55)
 *   3 — ЗАГОЛОВОК       (40)
 *   4 — АВТОМОБИЛЬ      (10)  ближний план, перекрывает заголовок
 */

const LAYERS = [
  { layer: '1', yPercent: 70 },
  { layer: '2', yPercent: 55 },
  { layer: '3', yPercent: 40 },
  { layer: '4', yPercent: 10 },
];

export function ParallaxHero({
  hero,
  privacyUrl,
  consentUrl,
}: {
  hero: HeroView;
  privacyUrl: string;
  consentUrl: string;
}) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const form = useLeadForm('OTHER');

  function handleCloseModal() {
    setModalOpen(false);
    form.reset();
  }

  useEffect(() => {
    const root = parallaxRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const triggerElement = root.querySelector('[data-parallax-layers]');
      if (!triggerElement) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: '0% 0%',
          end: '100% 0%',
          scrub: 0,
          invalidateOnRefresh: true,
        },
      });

      LAYERS.forEach((layerObj, index) => {
        const nodes = triggerElement.querySelectorAll(
          `[data-parallax-layer="${layerObj.layer}"]`,
        );
        if (!nodes.length) return;
        tl.to(nodes, { yPercent: layerObj.yPercent, ease: 'none' }, index === 0 ? undefined : '<');
      });

      const intro =
        document.visibilityState === 'visible'
          ? gsap
              .timeline({ defaults: { ease: 'expo.out' } })
              .from('[data-hero-line] > span', { yPercent: 115, duration: 1.2, stagger: 0.12 })
          : null;

      return () => {
        intro?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  const line = 'block overflow-hidden';
  const lineInner = 'block will-change-transform';

  const isModalButton = hero.secondaryHref === '#modal';

  return (
    <>
      <div className="parallax" ref={parallaxRef}>
        <section className="parallax__header" aria-label="Подбор автомобилей">
          <div className="parallax__visuals">
            <div className="parallax__black-line-overflow" />

            <div data-parallax-layers className="parallax__layers">
              {/* ── 1 · Небо */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.layerSkyUrl}
                loading="eager"
                data-parallax-layer="1"
                alt=""
                className="parallax__layer-img"
              />

              {/* ── 2 · Свет и дымка */}
              <div data-parallax-layer="2" className="parallax__layer-img is-third" aria-hidden="true">
                <div className="absolute inset-x-[8%] top-[52%] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <div className="absolute inset-x-[24%] top-[56%] h-px bg-gradient-to-r from-transparent via-brand-bright/40 to-transparent" />
              </div>

              {/* ── 3 · Заголовок. Лежит ПОД автомобилем */}
              <div data-parallax-layer="3" className="parallax__layer-title">
                <div className="parallax__title-block">
                  <h1 className="parallax__title text-white">
                    <span className={line} data-hero-line>
                      <span className={lineInner}>{hero.titleLead}</span>
                    </span>
                    {hero.titleTail.trim() !== '' && (
                      <span className={line} data-hero-line>
                        <span className={lineInner}>{hero.titleTail}</span>
                      </span>
                    )}
                  </h1>
                  {hero.titleAccent.trim() !== '' && (
                    <p className={cn(line, 'parallax__tagline')} data-hero-line>
                      <span className={lineInner}>{hero.titleAccent}</span>
                    </p>
                  )}

                  {hero.subtitle.trim() !== '' && (
                    <p className="parallax__subtitle">
                      {hero.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* ── 4 · Автомобиль. Ближний план */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.layerCarUrl}
                loading="eager"
                data-parallax-layer="4"
                alt=""
                className="parallax__layer-img"
              />
            </div>

            <div className="parallax__grain" aria-hidden="true" />
            <div className="parallax__radial-gradient" aria-hidden="true" />
            <div className="parallax__fade" />
          </div>

          {/* CTA-кнопки и scroll indicator */}
          <div className="parallax__hero-bottom">
            <div className="parallax__cta-row">
              <a href={hero.primaryHref} className="parallax__cta parallax__cta--primary">
                {hero.primaryLabel}
              </a>
              {hero.secondaryLabel.trim() !== '' && (
                isModalButton ? (
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="parallax__cta parallax__cta--secondary"
                  >
                    {hero.secondaryLabel}
                  </button>
                ) : (
                  <a href={hero.secondaryHref} className="parallax__cta parallax__cta--secondary">
                    {hero.secondaryLabel}
                  </a>
                )
              )}
            </div>

            <div className="parallax__scroll-hint" aria-hidden="true">
              <ArrowDown className="size-5 text-white/60" strokeWidth={1.5} />
            </div>
          </div>
        </section>
      </div>

      {/* Модальная форма "Подобрать авто" */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Подобрать авто"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label="Закрыть"
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            onClick={handleCloseModal}
          />

          <div className="relative z-10 w-full max-w-md rounded-[1.25rem] bg-paper-2 p-7 shadow-2xl sm:p-9">
            <button
              type="button"
              onClick={handleCloseModal}
              aria-label="Закрыть"
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-steel transition-colors hover:text-ink"
            >
              <X className="size-5" />
            </button>

            {form.status === 'success' ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand text-white">
                  <Check className="size-7" strokeWidth={2.5} aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-xl font-bold tracking-tight">Заявка отправлена</h3>
                <p className="mx-auto mt-2 max-w-[30ch] text-[0.9375rem] leading-relaxed text-steel">
                  Перезвоним в течение часа и подберём варианты с ценами и сроками.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold tracking-tight">Подобрать авто</h2>
                <p className="mt-1.5 text-[0.875rem] leading-relaxed text-steel">
                  Оставьте контакты — менеджер свяжется и подберёт варианты под ваш бюджет
                </p>

                <form
                  className="mt-6"
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    void form.submit();
                  }}
                >
                  <LeadFields form={form} privacyUrl={privacyUrl} consentUrl={consentUrl} />

                  {form.error && (
                    <p role="alert" className="mt-3 text-[0.8125rem] text-brand">
                      {form.error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="mt-5 w-full"
                    disabled={form.status === 'submitting'}
                  >
                    {form.status === 'submitting' && (
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    )}
                    Отправить заявку
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
