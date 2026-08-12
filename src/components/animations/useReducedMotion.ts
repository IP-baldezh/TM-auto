'use client';

import { useEffect, useState } from 'react';

/**
 * Значение по умолчанию — true: до гидратации считаем, что анимации выключены.
 * Так серверная и клиентская разметка совпадают, а тяжёлые эффекты не
 * запускаются раньше, чем мы узнали настройку пользователя.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

/** true, если экран уже, чем breakpoint (по умолчанию — мобильный). */
export function useMediaQuery(query: string, initial = false): boolean {
  const [matches, setMatches] = useState(initial);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);

  return matches;
}
