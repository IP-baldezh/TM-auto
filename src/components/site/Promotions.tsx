'use client';

import { useState } from 'react';
import { Check, Loader2, X } from 'lucide-react';

import type { SectionView } from '@/lib/content';
import { Container } from '@/components/site/Section';
import { Button } from '@/components/ui/Button';
import { LeadFields } from '@/components/forms/LeadFields';
import { useLeadForm } from '@/components/forms/useLeadForm';


export function Promotions({
  section,
  privacyUrl,
  consentUrl,
}: {
  section: SectionView;
  privacyUrl: string;
  consentUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const form = useLeadForm('OTHER');

  if (!section.enabled) return null;

  function handleClose() {
    setOpen(false);
    form.reset();
  }

  return (
    <>
      <section id="promotions" className="relative overflow-hidden">
        {/* Фото во весь блок */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/promotions-bg.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Тёмный градиент-оверлей */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/65 to-ink/75"
        />

        {/* Контент */}
        <div className="relative py-24 md:py-32 lg:py-40">
          <Container>
            <div className="lg:grid lg:grid-cols-11 lg:items-center lg:gap-16">

              {/* Левая колонка: заголовок + кнопка */}
              <div className="lg:col-span-5" data-reveal="up">
                <h2
                  className="display text-[clamp(1.75rem,4.2vw,3.4rem)] leading-[1.06] text-white"
                >
                  Привозим авто по самым выгодным условиям
                </h2>

                <div className="mt-10">
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="inline-flex h-13 items-center justify-center rounded-full bg-brand px-9 text-[0.9375rem] font-semibold text-white shadow-xl shadow-brand/30 transition-colors hover:bg-brand-dark"
                  >
                    Подобрать предложение
                  </button>
                </div>
              </div>

              {/* Правая колонка: матовое стекло с текстом */}
              <div className="mt-12 lg:col-span-6 lg:mt-0" data-reveal="up">
                <div className="rounded-2xl border border-white/[0.13] bg-white/[0.07] p-8 backdrop-blur-md sm:p-10">
                  <p className="text-[1rem] leading-relaxed text-white/90 sm:text-[1.0625rem]">
                    У нас есть прямой доступ к заводским партиям автомобилей — мы работаем с
                    производителем напрямую, минуя дилерскую цепочку.
                  </p>
                  <p className="mt-5 text-[1rem] leading-relaxed text-white/75 sm:text-[1.0625rem]">
                    Ещё до нанесения VIN-номера на кузов мы можем забронировать конкретный
                    автомобиль из партии. Как только завод присваивает идентификатор — сразу
                    забираем машину.
                  </p>
                  <p className="mt-5 text-[1rem] leading-relaxed text-white/75 sm:text-[1.0625rem]">
                    Благодаря этому покупатель получает автомобиль одним из первых — без
                    ожидания в очереди и по цене ниже рыночной, пока рынок ещё не успел
                    отреагировать на новую партию.
                  </p>
                </div>
              </div>

            </div>
          </Container>
        </div>
      </section>

      {/* Модальная форма */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Подобрать предложение"
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
                <h2 className="text-xl font-bold tracking-tight">Подобрать предложение</h2>
                <p className="mt-1.5 text-[0.875rem] leading-relaxed text-steel">
                  Оставьте контакты — подберём лучший вариант под ваш бюджет
                </p>

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
      )}
    </>
  );
}
