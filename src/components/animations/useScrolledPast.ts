'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Прокручена ли страница дальше заданной отметки.
 *
 * useSyncExternalStore, а не useState + useEffect: положение прокрутки —
 * это внешнее хранилище. Значение читается синхронно при гидратации, поэтому
 * страница, открытая уже прокрученной (по якорю или после перезагрузки),
 * сразу получает верное состояние, а лишнего прохода отрисовки не возникает.
 *
 * Снимок — булево, поэтому React отбрасывает все события прокрутки, при
 * которых отметка не пересечена, и перерисовки не происходит.
 */
export function useScrolledPast(threshold = 24): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener('scroll', onChange, { passive: true });
    window.addEventListener('resize', onChange, { passive: true });
    return () => {
      window.removeEventListener('scroll', onChange);
      window.removeEventListener('resize', onChange);
    };
  }, []);

  const getSnapshot = useCallback(() => window.scrollY > threshold, [threshold]);

  // На сервере прокрутки нет — шапка рендерится прозрачной поверх hero.
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
