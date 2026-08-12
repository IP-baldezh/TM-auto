'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * next/image с запасным вариантом.
 *
 * Демонстрационные изображения лежат на внешнем хосте, а загруженные через
 * админку могут быть удалены из хранилища. Вместо «битой» картинки
 * показываем нейтральную техническую заглушку, чтобы вёрстка не ломалась.
 */
export function SmartImage({
  className,
  alt,
  wrapperClassName,
  ...props
}: ImageProps & { wrapperClassName?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed || !props.src) {
    return (
      <div
        className={cn(
          'flex h-full w-full items-center justify-center bg-paper-3 text-steel-2',
          wrapperClassName,
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <svg viewBox="0 0 48 48" className="size-10 opacity-45" aria-hidden="true" fill="none">
          <rect x="4" y="10" width="40" height="28" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 30l11-9 8 6 7-5 14 10" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="16" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  return <Image alt={alt} className={className} onError={() => setFailed(true)} {...props} />;
}
