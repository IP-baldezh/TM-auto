'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Единая точка инициализации скролл-анимаций.
 *
 * Живёт в layout сайта и делает три вещи:
 *   1. регистрирует ScrollTrigger один раз на всё приложение;
 *   2. подключает Lenis для плавного колеса мыши (не трогая тач-скролл);
 *   3. включает появление блоков по [data-reveal].
 *
 * Благодаря п.3 секциям не нужно быть клиентскими компонентами — достаточно
 * поставить атрибут data-reveal на серверно отрендеренном элементе.
 */

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function MotionProvider() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    if (prefersReduced) {
      document.documentElement.classList.remove('js-reveal-ready');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    // Сообщаем страховочному таймеру из revealBootstrapScript, что анимации
    // взяты под управление и снимать js-reveal-ready не нужно.
    document.documentElement.setAttribute('data-motion-ready', '');

    let lenis: import('lenis').default | null = null;
    let tickerFn: ((time: number) => void) | null = null;
    let cancelled = false;

    const ctx = gsap.context(() => {
      // Появление снизу вверх.
      ScrollTrigger.batch('[data-reveal="up"], [data-reveal=""]', {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'expo.out',
            stagger: 0.07,
            overwrite: true,
          }),
      });

      // Раскрытие маской — для изображений и крупных плашек.
      ScrollTrigger.batch('[data-reveal="mask"]', {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.05,
            ease: 'expo.out',
            stagger: 0.09,
            overwrite: true,
          }),
      });
    });

    // Lenis — только плавность колеса. Тач-скролл остаётся нативным
    // (syncTouch: false), поэтому на мобильных ничего не «залипает».
    import('lenis')
      .then(({ default: Lenis }) => {
        if (cancelled) return;

        lenis = new Lenis({
          duration: 1.05,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          syncTouch: false,
          touchMultiplier: 1.6,
        });

        lenis.on('scroll', ScrollTrigger.update);

        tickerFn = (time: number) => lenis?.raf(time * 1000);
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);

        ScrollTrigger.refresh();
      })
      .catch(() => {
        // Без Lenis сайт просто скроллится нативно — это не ошибка.
      });

    // Пересчёт позиций после подгрузки шрифтов и изображений.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener('load', refresh);

    return () => {
      cancelled = true;
      window.removeEventListener('load', refresh);
      if (tickerFn) gsap.ticker.remove(tickerFn);
      lenis?.destroy();
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}

/**
 * Ставится синхронно до первой отрисовки, иначе блоки успевают показаться
 * и только потом спрятаться — заметное мигание.
 *
 * Второй таймер — страховка. Класс прячет весь контент до того, как GSAP
 * его покажет; если клиентский бандл не загрузился, страница осталась бы
 * пустой. Через четыре секунды без подтверждения от MotionProvider класс
 * снимается, и содержимое видно без анимаций.
 */
export const revealBootstrapScript = `try{
var d=document.documentElement;
if(!window.matchMedia('${REDUCED_MOTION_QUERY}').matches){
d.classList.add('js-reveal-ready');
setTimeout(function(){if(!d.hasAttribute('data-motion-ready')){d.classList.remove('js-reveal-ready')}},4000);
}}catch(e){}`;
