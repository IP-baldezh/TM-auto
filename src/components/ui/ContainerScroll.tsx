import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Контейнер колоды. Задаёт блок, внутри которого карточки прилипают:
 * sticky-элемент ограничен своим содержащим блоком, поэтому колода
 * собирается, пока контейнер в поле зрения, и уезжает вместе с ним.
 *
 * Расстояние между карточками задавайте `gap`, а не `margin` на самих
 * карточках: sticky ограничивается margin-box, поэтому нижний отступ
 * на липком элементе съедает его же ход и карточка срывается раньше
 * времени. По той же причине запас хода для последней карточки даёт
 * элемент-распорка в конце, а не `padding-bottom` контейнера —
 * padding лежит вне content-box, которым ограничен sticky.
 */
export function ContainerScroll({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative w-full', className)} {...props}>
      {children}
    </div>
  );
}

interface CardStickyProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
  /** Отступ сверху для нулевой карточки — обходит фиксированную шапку. */
  baseY?: number;
  /** Насколько ниже липнет каждая следующая карточка: ширина видимой
   *  полоски предыдущей. */
  incrementY?: number;
}

/**
 * Карточка колоды. Прилипает на `baseY + index * incrementY`, поэтому
 * каждая следующая замирает чуть ниже предыдущей, оставляя её верхний
 * край видимым.
 */
export function CardSticky({
  index,
  baseY = 0,
  incrementY = 16,
  className,
  style,
  children,
  ...props
}: CardStickyProps) {
  return (
    <div
      className={cn('sticky', className)}
      style={{ top: baseY + index * incrementY, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
