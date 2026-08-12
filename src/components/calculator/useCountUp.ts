'use client';

import { useEffect, useRef, useState } from 'react';

/** Плавный набор числа. При prefers-reduced-motion значение ставится сразу. */
export function useCountUp(target: number, durationMs = 900): number {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const from = fromRef.current;

    const settle = () => {
      fromRef.current = target;
      setValue(target);
    };

    // В неактивной вкладке requestAnimationFrame не вызывается — анимировать
    // нечего и незачем.
    if (reduced || from === target || document.visibilityState !== 'visible') {
      settle();
      return;
    }

    // Страховка: если кадры по какой-то причине не идут (свёрнутое окно,
    // экономия энергии), пользователь всё равно должен увидеть сумму,
    // а не ноль.
    const guard = setTimeout(settle, durationMs + 150);

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
        clearTimeout(guard);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      clearTimeout(guard);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      fromRef.current = target;
    };
  }, [target, durationMs]);

  return value;
}
