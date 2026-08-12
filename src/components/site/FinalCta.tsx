'use client';

import { Check, Loader2, MessageCircle, Phone } from 'lucide-react';

import type { SectionView } from '@/lib/content';
import { Container, Section } from '@/components/site/Section';
import { Button, ButtonLink } from '@/components/ui/Button';
import { LeadFields } from '@/components/forms/LeadFields';
import { useLeadForm } from '@/components/forms/useLeadForm';
import { formatPhone, telHref } from '@/lib/utils';

export function FinalCta({
  section,
  phone,
  messengerUrl,
  privacyUrl,
  consentUrl,
}: {
  section: SectionView;
  phone: string | null;
  messengerUrl: string | null;
  privacyUrl: string;
  consentUrl: string;
}) {
  const form = useLeadForm('FINAL_CTA');

  if (!section.enabled) return null;

  return (
    <Section id="cta" tone="ink">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <span
              aria-hidden="true"
              className="mb-7 block h-px w-10 bg-brand"
              data-reveal="up"
            />

            <h2
              className="display text-[clamp(1.85rem,3.6vw,3.1rem)] leading-[1.05]"
              data-reveal="up"
            >
              {section.title ?? 'Расскажите, какой автомобиль ищете'}
            </h2>

            {section.subtitle && (
              <p
                className="mt-5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-steel-3"
                data-reveal="up"
              >
                {section.subtitle}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3" data-reveal="up">
              {phone && (
                <ButtonLink href={`tel:${telHref(phone)}`} variant="light" size="md">
                  <Phone className="size-4" aria-hidden="true" />
                  <span className="tabular">{formatPhone(phone)}</span>
                </ButtonLink>
              )}
              {messengerUrl && (
                <ButtonLink
                  href={messengerUrl}
                  variant="light"
                  size="md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Написать
                </ButtonLink>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-8">
            <div className="rounded-[4px] bg-paper p-6 text-ink sm:p-9" data-reveal="up">
              {form.status === 'success' ? (
                <div className="py-8 text-center">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand text-white">
                    <Check className="size-7" strokeWidth={2.5} aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold tracking-[-0.02em]">Заявка отправлена</h3>
                  <p className="mx-auto mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-steel">
                    Свяжемся с вами в рабочее время: 8:00–20:00, без выходных.
                  </p>
                </div>
              ) : (
                <form
                  className="relative"
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault();
                    void form.submit();
                  }}
                >
                  <LeadFields
                    form={form}
                    withMessage
                    messageLabel="Комментарий или желаемый автомобиль"
                    messagePlaceholder="Например: кроссовер до 2,5 млн, автомат, не старше 2019 года"
                    privacyUrl={privacyUrl}
                    consentUrl={consentUrl}
                  />

                  {form.error && (
                    <p role="alert" className="mt-4 text-[0.8125rem] text-brand">
                      {form.error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="mt-6 w-full sm:w-auto"
                    disabled={form.status === 'submitting'}
                  >
                    {form.status === 'submitting' && (
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    )}
                    Начать подбор
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
