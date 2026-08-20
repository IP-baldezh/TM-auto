'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { SmartImage } from '@/components/ui/SmartImage';

const useIsoLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export type CoverflowSlide = {
  id: string;
  src: string;
  alt: string;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  accent?: string | null;
  meta?: { label: string; value: string }[];
  price?: string | null;
  href?: string | null;
};

export type CoverflowCarouselProps = {
  slides: CoverflowSlide[];
  /** Наклон первой соседней карточки, градусы. */
  rotate?: number;
  /** Насколько соседняя карточка уходит вглубь, в долях ширины карточки. */
  depth?: number;
  /** Дистанция наблюдателя в ширинах карточки — меньше значит шире «объектив». */
  perspective?: number;
  /** Степень при расстоянии: меньше 1 — наклон ослабевает к краям. */
  falloff?: number;
  /** Сколько прозрачности теряется на шаг от центра. */
  fade?: number;
  /** Зазор между карточками в долях ширины. */
  gap?: number;
  label?: string;
  className?: string;
  /** Ref для управления каруселью снаружи. */
  controlRef?: React.MutableRefObject<{ nudge: (by: number) => void } | null>;
};

/**
 * 3D-карусель в духе reference ruixen.ui/coverflow-carousel.
 *
 * Ключевые решения оригинала сохранены:
 *  · позиция — дробный индекс в ref, а не в state: 60 перерисовок React в
 *    секунду ради чисел, которые нужны только DOM, — лишняя работа;
 *  · зацикливание — сворачиванием расстояния по кольцу, без клонирования
 *    узлов и перестановок в DOM;
 *  · доводка — экспоненциальное затухание к цели, а не пружина.
 *
 * Добавлено под задачу: деградация при малом числе карточек, поддержка
 * prefers-reduced-motion, объявление активного слайда для скринридеров и
 * навигация с клавиатуры (стрелки, Home/End).
 */
export function CoverflowCarousel({
  slides,
  rotate = 44,
  depth = 0.58,
  perspective = 3.1,
  falloff = 0.56,
  fade = 0.16,
  gap = 0.06,
  label = 'Подобранные автомобили',
  className,
  controlRef,
}: CoverflowCarouselProps) {
  const count = slides.length;
  // Кольцо имеет смысл только начиная с трёх карточек: при двух карточка
  // «телепортируется» ровно в точке, где она ещё видна.
  const loop = count >= 3;

  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const posRef = React.useRef(0);
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const reducedRef = React.useRef(false);
  const dragRef = React.useRef<{
    id: number;
    x: number;
    y: number;
    pos: number;
    v: number;
    t: number;
    axis: 'unknown' | 'x' | 'y';
  } | null>(null);

  const [selected, setSelected] = React.useState(0);

  const indexAt = React.useCallback(
    (pos: number) => ((Math.round(pos) % count) + count) % count,
    [count],
  );

  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance * 10));
      card.style.pointerEvents = distance < 1.5 ? 'auto' : 'none';
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      setSelected(indexAt(target));

      if (reducedRef.current) {
        posRef.current = target;
        paint();
        rafRef.current = null;
        return;
      }

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint],
  );

  const clamp = React.useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop],
  );

  const goTo = React.useCallback(
    (index: number) => {
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle],
  );

  const nudge = React.useCallback(
    (by: number) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle],
  );

  React.useEffect(() => {
    if (controlRef) {
      controlRef.current = { nudge };
      return () => { controlRef.current = null; };
    }
  }, [controlRef, nudge]);

  // ── Перетаскивание ────────────────────────────────────────────────────
  // Ось определяется по первому заметному смещению: горизонталь забираем
  // себе, вертикаль отдаём странице, иначе на телефоне не пролистать вниз.

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (count < 2) return;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
      axis: event.pointerType === 'mouse' ? 'x' : 'unknown',
    };
    if (event.pointerType === 'mouse') {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;

    if (drag.axis === 'unknown') {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (drag.axis === 'x') event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (drag.axis !== 'x') return;

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - dx / pitch);
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) setSelected(index);
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;

    const totalMovement = Math.abs(event.clientX - drag.x) + Math.abs(event.clientY - drag.y);

    // Тап/клик с минимальным смещением — определяем направление по позиции в кадре.
    // Карточки за пределами overflow-hidden не получают click-события сами,
    // поэтому обрабатываем навигацию здесь.
    if (totalMovement < 12 && count > 1) {
      const frame = frameRef.current;
      if (frame) {
        const rect = frame.getBoundingClientRect();
        const tapX = event.clientX - (rect.left + rect.width / 2);
        const pitch = widthRef.current * (1 + gap);
        if (pitch > 0 && Math.abs(tapX) > pitch * 0.35) {
          settle(clamp(Math.round(targetRef.current) + (tapX > 0 ? 1 : -1)));
          return;
        }
      }
    }

    if (drag.axis !== 'x') return;
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  };

  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const active = slides[selected];

  if (!count) return null;

  return (
    <div
      className={cn('w-full', className)}
      style={
        {
          // Ширина карточки — единственная измеряемая величина: от неё
          // производны и шаг, и глубина, и перспектива.
          '--cf-card': 'clamp(17rem, 46vw, 34rem)',
          // Высота: на мобильном — портретная (min 20rem), на десктопе — 0.72 от ширины.
          '--cf-card-h': 'max(calc(var(--cf-card) * 0.72), 20rem)',
        } as React.CSSProperties
      }
      role="region"
      aria-roledescription="карусель"
      aria-label={label}
    >
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          role="group"
          aria-label="Карточки автомобилей. Листайте стрелками влево и вправо"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === 'ArrowRight') {
              event.preventDefault();
              nudge(1);
            } else if (event.key === 'Home') {
              event.preventDefault();
              goTo(0);
            } else if (event.key === 'End') {
              event.preventDefault();
              goTo(count - 1);
            }
          }}
          className="cursor-grab overflow-hidden py-8 outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-paper active:cursor-grabbing sm:py-12"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            // Горизонталь — наша, вертикальный скролл остаётся у страницы.
            touchAction: 'pan-y',
          }}
        >
          <div
            className="relative select-none"
            style={{ height: 'var(--cf-card-h)', transformStyle: 'preserve-3d' }}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                role="group"
                aria-roledescription="слайд"
                aria-label={`${index + 1} из ${count}: ${slide.title}`}
                aria-hidden={index !== selected}
                onClick={() => { if (index !== selected) goTo(index); }}
                className="absolute left-1/2 top-0 overflow-hidden rounded-[1.25rem] bg-graphite shadow-[0_28px_60px_-24px_rgba(0,0,0,0.85)] will-change-transform"
                style={{ width: 'var(--cf-card)', height: 'var(--cf-card-h)' }}
              >
                <SmartImage
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  draggable={false}
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 46vw, 34rem"
                  className="select-none object-cover"
                />

                {(slide.badge || slide.accent) && (
                  <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    {slide.badge && (
                      <span className="eyebrow rounded-md bg-ink/85 px-2 py-1 text-white/85 backdrop-blur-sm">
                        {slide.badge}
                      </span>
                    )}
                    {slide.accent && (
                      <span className="eyebrow rounded-md bg-brand px-2 py-1 text-white">
                        {slide.accent}
                      </span>
                    )}
                  </div>
                )}

                {/* Подпись прямо на карточке */}
                <div
                  className={cn(
                    'pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/75 to-transparent px-4 pb-4',
                    index === selected ? 'pt-28' : 'pt-12',
                  )}
                >
                  {/* Мета-строка (год · пробег) — только активная карточка */}
                  {index === selected && slide.meta && slide.meta.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-x-3 gap-y-0.5 md:hidden">
                      {slide.meta.slice(0, 3).map((m) => (
                        <span key={m.label} className="text-[0.75rem] text-white/55">
                          {m.label}:{' '}
                          <span className="font-semibold text-white/80">{m.value}</span>
                        </span>
                      ))}
                    </div>
                  )}
                  <p
                    className={cn(
                      'truncate font-semibold text-white',
                      index === selected ? 'text-[1.0625rem]' : 'text-[0.9375rem]',
                    )}
                  >
                    {slide.title}
                  </p>
                  {index === selected && slide.subtitle && (
                    <p className="mt-0.5 truncate text-[0.8125rem] text-white/65 md:hidden">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.price && (
                    <p
                      className={cn(
                        'tabular mt-1 text-white',
                        index === selected
                          ? 'text-[1.0625rem] font-bold'
                          : 'text-[0.8125rem] opacity-65',
                      )}
                    >
                      {slide.price}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Подпись под активной карточкой — только на десктопе ────────── */}
      {active && (
        <div className="mx-auto mt-2 max-w-2xl px-1 hidden md:block" aria-live="polite" aria-atomic="true">
          <div key={active.id} className="text-center">
            <h3 className="text-xl font-bold tracking-[-0.02em] sm:text-2xl">{active.title}</h3>
            {active.subtitle && (
              <p className="mt-1 text-sm text-steel">{active.subtitle}</p>
            )}

            {active.meta && active.meta.length > 0 && (
              <dl className="mx-auto mt-7 grid max-w-lg grid-cols-2 gap-x-8 sm:grid-cols-4">
                {active.meta.map((row) => (
                  <div
                    key={row.label}
                    className="border-t border-line py-3 text-left first:border-brand"
                  >
                    <dt className="eyebrow text-steel-2">{row.label}</dt>
                    <dd className="tabular mt-1 text-[0.9375rem] font-semibold">{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {active.price && (
              <p className="tabular mt-6 text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
                {active.price}
              </p>
            )}
          </div>
        </div>
      )}

      {count > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2.5">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Перейти к карточке ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className={cn(
                'h-[3px] rounded-full transition-all duration-300',
                index === selected ? 'w-8 bg-brand' : 'w-4 bg-line-strong hover:bg-steel-2',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
