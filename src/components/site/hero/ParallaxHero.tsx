'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import type { HeroView } from '@/lib/content';
import { cn } from '@/lib/utils';

/**
 * Главный экран — параллакс по reference osmosupply/parallax-scrolling.
 *
 * Разметка, имена классов и величины yPercent повторяют оригинал. Геометрия
 * слоёв живёт в globals.css и тоже взята из него дословно (оригинальный CSS
 * сохранён в docs/osmo-reference.css) — там ключевое: слои выше кадра и
 * подняты над ним, поэтому им есть куда уезжать.
 *
 *   1 — небо            (70)  дальний план
 *   2 — свет и дымка    (55)
 *   3 — ЗАГОЛОВОК       (40)
 *   4 — АВТОМОБИЛЬ      (10)  ближний план, перекрывает заголовок
 *
 * Слои — обычные <img>, а не next/image: CSS позиционирует само изображение
 * (height 117.5%, top -17.5%), а обёртка и режим fill у next/image с этим
 * конфликтуют. Файлы уже оптимизированы скриптом сборки планов.
 *
 * Lenis здесь не создаётся: единственный экземпляр живёт в MotionProvider и
 * уже связан со ScrollTrigger. Второй инстанс конфликтовал бы с первым.
 */

const LAYERS = [
  { layer: '1', yPercent: 70 },
  { layer: '2', yPercent: 55 },
  { layer: '3', yPercent: 40 },
  { layer: '4', yPercent: 10 },
];

export function ParallaxHero({ hero }: { hero: HeroView }) {
  const parallaxRef = useRef<HTMLDivElement>(null);

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

      // Появление при загрузке.
      //
      // Только для видимой вкладки: gsap.from() сразу выставляет стартовые
      // значения, а в фоновой вкладке requestAnimationFrame не вызывается —
      // таймлайн не сдвинулся бы с места и экран остался бы пустым.
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

  return (
    <div className="parallax" ref={parallaxRef}>
      <section className="parallax__header" aria-label="Подбор автомобилей">
        <div className="parallax__visuals">
          <div className="parallax__black-line-overflow" />

          <div data-parallax-layers className="parallax__layers">
            {/* ── 1 · Небо ───────────────────────────────────────────────── */}
            {/* eslint-disable-next-line @next/next/no-img-element -- CSS
                позиционирует само изображение, обёртка next/image мешает */}
            <img
              src={hero.layerSkyUrl}
              loading="eager"
              data-parallax-layer="1"
              alt=""
              className="parallax__layer-img"
            />

            {/* ── 2 · Свет и дымка ──────────────────────────────────────── */}
            <div data-parallax-layer="2" className="parallax__layer-img is-third" aria-hidden="true">
              <div className="absolute inset-x-[8%] top-[52%] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <div className="absolute inset-x-[24%] top-[56%] h-px bg-gradient-to-r from-transparent via-brand-bright/40 to-transparent" />
            </div>

            {/* ── 3 · Заголовок. Лежит ПОД автомобилем ────────────────────
                При скролле 0 текст стоит в чистом небе над кромкой деревьев и
                читается целиком — как «Parallax» над горой в reference. Кузов
                наезжает на него уже в процессе прокрутки: слой заголовка
                уходит вниз на 40%, автомобиль всего на 10%, поэтому
                относительно текста тот поднимается. */}
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
              </div>
            </div>

            {/* ── 4 · Автомобиль. Ближний план ──────────────────────────── */}
            {/* eslint-disable-next-line @next/next/no-img-element -- см. выше */}
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
      </section>

    </div>
  );
}
