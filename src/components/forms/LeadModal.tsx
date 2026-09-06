'use client';

import { useEffect } from 'react';
import { Check, Loader2, X } from 'lucide-react';

import { LeadFields } from '@/components/forms/LeadFields';
import { useLeadForm, type Source } from '@/components/forms/useLeadForm';
import { Button } from '@/components/ui/Button';

/**
 * Модальная форма заявки.
 *
 * Компонент монтируется всегда, а прячется возвратом null: хуки формы
 * должны вызываться безусловно, иначе нарушится порядок вызовов.
 */
export function LeadModal({
  open,
  onClose,
  source,
  privacyUrl,
  consentUrl,
  title = 'Подобрать авто',
  subtitle = 'Оставьте контакты — перезвоним и подберём варианты с ценами и сроками.',
}: {
  open: boolean;
  onClose: () => void;
  source: Source;
  privacyUrl: string;
  consentUrl: string;
  title?: string;
  subtitle?: string;
}) {
  const form = useLeadForm(source);
  const { reset } = form;

  function handleClose() {
    onClose();
    reset();
  }

  // Escape закрывает окно, а фон не должен прокручиваться под ним.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        reset();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose, reset]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      {/* Подложка */}
      <button
        type="button"
        aria-label="Закрыть"
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Окно */}
      <div className="relative z-10 w-full max-w-md rounded-[1.25rem] bg-paper-2 p-7 shadow-2xl sm:p-9">
        <button
          type="button"
          onClick={handleClose}
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
            <h2 className="text-xl font-bold tracking-tight">{title}</h2>
            <p className="mt-1.5 text-[0.875rem] leading-relaxed text-steel">{subtitle}</p>

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
  );
}
