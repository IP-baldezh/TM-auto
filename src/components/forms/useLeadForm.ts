'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CalculatorAnswers } from '@/lib/calculator/engine';

type Source = 'CALCULATOR' | 'FINAL_CTA' | 'HEADER' | 'SERVICE' | 'CONTACTS' | 'OTHER';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const UTM_KEYS = ['source', 'medium', 'campaign', 'content', 'term'] as const;
const UTM_STORAGE_KEY = 'sunservice:utm';

/** UTM-метки живут в sessionStorage: до формы пользователь доходит позже. */
function readUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = params.get(`utm_${key}`);
      if (value) fromUrl[key] = value.slice(0, 200);
    }
    if (Object.keys(fromUrl).length) {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export type LeadFormValues = {
  name: string;
  phone: string;
  message: string;
  consent: boolean;
  company: string;
};

export const emptyLeadValues: LeadFormValues = {
  name: '',
  phone: '',
  message: '',
  consent: false,
  company: '',
};

export function useLeadForm(source: Source) {
  const [values, setValues] = useState<LeadFormValues>(emptyLeadValues);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const startedAtRef = useRef<number>(0);
  // Защита от повторной отправки: state обновляется асинхронно и второй
  // клик успевает проскочить до перерисовки.
  const inFlightRef = useRef(false);

  useEffect(() => {
    startedAtRef.current = Date.now();
    readUtm();
  }, []);

  const setValue = useCallback(<K extends keyof LeadFormValues>(key: K, value: LeadFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key as string]) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }, []);

  const submit = useCallback(
    async (calculator?: CalculatorAnswers) => {
      if (inFlightRef.current) return false;

      const localErrors: Record<string, string> = {};
      if (values.name.trim().length < 2) localErrors.name = 'Укажите имя';
      if (values.phone.replace(/\D/g, '').length < 10) localErrors.phone = 'Проверьте номер';
      if (!values.consent) localErrors.consent = 'Требуется согласие на обработку данных';

      if (Object.keys(localErrors).length) {
        setFieldErrors(localErrors);
        setStatus('error');
        setError(null);
        return false;
      }

      inFlightRef.current = true;
      setStatus('submitting');
      setError(null);
      setFieldErrors({});

      const utm = readUtm();

      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: values.name.trim(),
            phone: values.phone.trim(),
            message: values.message.trim() || undefined,
            consent: true,
            source,
            company: values.company || undefined,
            startedAt: startedAtRef.current,
            calculator: calculator
              ? { budget: calculator.budget, choices: calculator.choices }
              : undefined,
            utmSource: utm.source,
            utmMedium: utm.medium,
            utmCampaign: utm.campaign,
            utmContent: utm.content,
            utmTerm: utm.term,
            pageUrl: typeof window !== 'undefined' ? window.location.href.slice(0, 500) : undefined,
            referrer:
              typeof document !== 'undefined' && document.referrer
                ? document.referrer.slice(0, 500)
                : undefined,
          }),
        });

        const data = (await response.json().catch(() => null)) as
          | { ok: boolean; error?: string; fieldErrors?: Record<string, string> }
          | null;

        if (!response.ok || !data?.ok) {
          setFieldErrors(data?.fieldErrors ?? {});
          setError(data?.error ?? 'Не удалось отправить заявку. Попробуйте ещё раз.');
          setStatus('error');
          return false;
        }

        setStatus('success');
        return true;
      } catch {
        setError('Нет связи с сервером. Проверьте интернет или позвоните нам.');
        setStatus('error');
        return false;
      } finally {
        inFlightRef.current = false;
      }
    },
    [source, values],
  );

  const reset = useCallback(() => {
    setValues(emptyLeadValues);
    setStatus('idle');
    setError(null);
    setFieldErrors({});
    startedAtRef.current = Date.now();
  }, []);

  return { values, setValue, submit, reset, status, error, fieldErrors };
}
