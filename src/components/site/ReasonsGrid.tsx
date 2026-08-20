'use client';

import type { ReasonView } from '@/lib/content';

const CARD_THEME: Record<number, { bg: string; watermark: boolean }> = {
  2: { bg: '#0d0d0d',  watermark: true },  // карточка 3 — чёрная
  3: { bg: '#c60f13',  watermark: true },  // карточка 4 — красная
  6: { bg: '#c60f13',  watermark: true },  // карточка 7 — красная
};

export function ReasonsGrid({ reasons }: { reasons: ReasonView[] }) {
  if (reasons.length === 0) return null;

  return (
    <div>
      {reasons.map((reason, i) => {
        const hasImage  = Boolean(reason.imageUrl);
        const theme     = CARD_THEME[i];
        const topOffset = 80 + i * 12;

        return (
          <div
            key={reason.id}
            className="sticky mx-4 sm:mx-6 lg:mx-8"
            style={{
              top: `${topOffset}px`,
              zIndex: i + 1,
              boxShadow: '0 -8px 40px 0 rgb(0 0 0 / 0.35)',
              borderRadius: '1.5rem',
            }}
          >
            <article
              className="relative flex min-h-[60vh] flex-col justify-end overflow-hidden rounded-3xl lg:min-h-[70vh]"
              aria-label={reason.title}
            >
              {/* Фото-фон */}
              {hasImage && !theme && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={reason.imageUrl ?? ''}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}

              {/* Фон */}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={
                  theme
                    ? { backgroundColor: theme.bg }
                    : undefined
                }
              >
                {!theme && (
                  <div
                    className={
                      hasImage
                        ? 'absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/55 to-ink/20'
                        : 'absolute inset-0 bg-gradient-to-br from-graphite-2 to-ink'
                    }
                  />
                )}
              </div>

              {/* Логотип-водяной знак (только для тематических карточек) */}
              {theme?.watermark && (
                <svg
                  viewBox="0 0 187 89"
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-[10%] top-1/2 h-[80%] w-auto -translate-y-1/2 select-none opacity-[0.12]"
                  fill="white"
                >
                  <path d="M93.0379 0.0988639C133.037 -1.10095 149.371 8.93223 152.538 14.0989L159.538 24.0989C161.205 24.9322 164.538 26.0986 164.538 24.0989C164.038 15.0993 175.038 16.5989 178.038 16.5989C194.536 22.0986 176.538 28.7654 166.538 31.0989V32.0989C176.137 31.2997 181.538 42.099 183.038 47.5989C190.637 75.9971 182.205 86.7646 177.038 88.5989C183.459 67.4459 166.901 72.5706 156.336 78.5403C155.751 78.9041 155.151 79.2581 154.538 79.5989C155.112 79.2468 155.714 78.8917 156.336 78.5403C166.046 72.4993 171.809 63.5286 173.538 59.5989C184.337 34.4003 149.371 54.099 130.538 67.0989L135.038 61.0989C130.638 65.4988 105.205 67.2655 93.0379 67.5989C80.8714 67.2655 55.4385 65.4987 51.0379 61.0989L55.5379 67.0989C36.7046 54.0989 1.73804 34.399 12.5379 59.5989C14.2671 63.5287 20.0286 72.4993 29.7391 78.5403C30.3611 78.8918 30.9633 79.2467 31.5379 79.5989C30.9243 79.258 30.3241 78.9042 29.7391 78.5403C19.1741 72.5704 2.61629 67.445 9.03791 88.5989C3.87125 86.7655 -4.56208 75.9989 3.03791 47.5989C4.53815 42.0987 9.93828 31.2989 19.5379 32.0989V31.0989C9.53791 28.7655 -8.46209 22.0989 8.03791 16.5989C11.0392 16.5986 22.0374 15.1003 21.5379 24.0989C21.5379 26.0989 24.8712 24.9322 26.5379 24.0989L33.5379 14.0989C36.7057 8.93198 53.0398 -1.10108 93.0379 0.0988639ZM155 29.0002C152.833 29.8336 146.2 31.5002 137 31.5002H48.9998C39.8002 31.5002 33.1668 29.8336 30.9998 29.0002L27.4998 33.5002C25.0998 36.7002 26.1665 39.1669 26.9998 40.0002C33.1666 45.0003 46.1999 55.5002 48.9998 57.5002C51.8003 61.1001 79.5 62.0002 92.9998 62.0002C106.5 62.0002 134.2 61.1002 137 57.5002C139.8 55.4997 152.833 45.0001 159 40.0002C159.833 39.1667 160.899 36.6999 158.5 33.5002L155 29.0002ZM66.5379 7.59886C53.3395 7.99882 46.3723 10.7653 44.5379 12.0989C41.8714 14.0988 36.1382 19.199 34.5379 23.5989C32.9379 27.9989 72.8712 29.0989 93.0379 29.0989C113.205 29.0988 153.137 27.9987 151.538 23.5989C149.938 19.1991 144.205 14.099 141.538 12.0989C139.705 10.7655 132.737 7.99894 119.538 7.59886H66.5379Z" />
                  <ellipse cx="92.9998" cy="58.5002" rx="3" ry="1.5" />
                </svg>
              )}

              {/* Контент */}
              <div className="relative px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
                <div className="mx-auto max-w-5xl">
                  {/* Разделитель */}
                  <span
                    aria-hidden="true"
                    className="mb-5 block h-px w-10 bg-white/40"
                  />

                  <h3 className="max-w-lg text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold leading-[1.1] tracking-[-0.025em] text-white">
                    {reason.title}
                  </h3>
                  <p className="mt-4 max-w-[52ch] text-[clamp(1.0625rem,2vw,1.375rem)] leading-relaxed text-white/75">
                    {reason.text}
                  </p>
                </div>
              </div>
            </article>
          </div>
        );
      })}

      {/* Завершающий спейсер */}
      <div className="h-24 bg-ink" />
    </div>
  );
}
