'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Search, Trash2 } from 'lucide-react';

import { deleteLead, saveLeadNote, updateLeadStatus } from '@/app/admin/actions';
import {
  AdminButton,
  AdminCard,
  ConfirmDialog,
  useToast,
} from '@/components/admin/ui';
import { cn, formatDateTimeRu, formatMoney, formatPhone, telHref } from '@/lib/utils';

export type LeadStatus = 'NEW' | 'IN_PROGRESS' | 'DONE' | 'SPAM';

export type LeadRow = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  source: string;
  status: LeadStatus;
  adminNote: string | null;
  webhookStatus: string | null;
  utm: Record<string, string | null>;
  pageUrl: string | null;
  calculatorData: Record<string, unknown> | null;
};

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: 'Новая',
  IN_PROGRESS: 'В работе',
  DONE: 'Завершена',
  SPAM: 'Спам',
};

const STATUS_STYLES: Record<LeadStatus, string> = {
  NEW: 'bg-brand text-white',
  IN_PROGRESS: 'bg-amber-100 text-amber-800',
  DONE: 'bg-emerald-100 text-emerald-800',
  SPAM: 'bg-black/10 text-black/50',
};

const SOURCE_LABELS: Record<string, string> = {
  CALCULATOR: 'Калькулятор',
  FINAL_CTA: 'Форма внизу',
  HEADER: 'Шапка',
  SERVICE: 'Услуги',
  CONTACTS: 'Контакты',
  OTHER: 'Другое',
};

export function LeadsTable({
  leads,
  activeStatus,
  query,
  counts,
}: {
  leads: LeadRow[];
  activeStatus: LeadStatus | null;
  query: string;
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [openId, setOpenId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [toDelete, setToDelete] = useState<LeadRow | null>(null);
  const [search, setSearch] = useState(query);
  const { show, node } = useToast();

  const setFilter = (status: LeadStatus | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status) params.set('status', status);
    else params.delete('status');
    startTransition(() => router.push(`/admin/leads?${params.toString()}`));
  };

  const applySearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) params.set('q', value.trim());
    else params.delete('q');
    startTransition(() => router.push(`/admin/leads?${params.toString()}`));
  };

  const changeStatus = async (lead: LeadRow, status: LeadStatus) => {
    const result = await updateLeadStatus(lead.id, status);
    if (!result.ok) show(result.error, 'error');
    else {
      show('Статус изменён');
      router.refresh();
    }
  };

  const persistNote = async (lead: LeadRow) => {
    const result = await saveLeadNote(lead.id, notes[lead.id] ?? '');
    if (!result.ok) show(result.error, 'error');
    else show('Заметка сохранена');
  };

  const remove = async (lead: LeadRow) => {
    setToDelete(null);
    const result = await deleteLead(lead.id);
    if (!result.ok) show(result.error, 'error');
    else {
      show('Заявка удалена');
      router.refresh();
    }
  };

  const filters: { key: LeadStatus | null; label: string; count: number }[] = [
    { key: null, label: 'Все', count: counts.all ?? 0 },
    { key: 'NEW', label: STATUS_LABELS.NEW, count: counts.NEW ?? 0 },
    { key: 'IN_PROGRESS', label: STATUS_LABELS.IN_PROGRESS, count: counts.IN_PROGRESS ?? 0 },
    { key: 'DONE', label: STATUS_LABELS.DONE, count: counts.DONE ?? 0 },
    { key: 'SPAM', label: STATUS_LABELS.SPAM, count: counts.SPAM ?? 0 },
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {filters.map((filter) => (
            <button
              key={filter.label}
              type="button"
              onClick={() => setFilter(filter.key)}
              aria-pressed={activeStatus === filter.key}
              className={cn(
                'rounded-[3px] border px-3 py-1.5 text-[0.8125rem] transition-colors',
                activeStatus === filter.key
                  ? 'border-black bg-black text-white'
                  : 'border-black/12 bg-white text-black/65 hover:border-black/35',
              )}
            >
              {filter.label}
              <span className="ml-1.5 tabular opacity-60">{filter.count}</span>
            </button>
          ))}
        </div>

        <form
          className="relative ml-auto"
          onSubmit={(e) => {
            e.preventDefault();
            applySearch(search);
          }}
        >
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/30"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Имя, телефон, текст"
            aria-label="Поиск по заявкам"
            className="h-9 w-56 rounded-[3px] border border-black/12 bg-white pl-9 pr-3 text-[0.8125rem] outline-none focus:border-black/45"
          />
        </form>
      </div>

      {leads.length === 0 ? (
        <AdminCard className="p-8 text-center text-sm text-black/45">
          Заявок не найдено.
        </AdminCard>
      ) : (
        <ul className={cn('space-y-2', pending && 'opacity-60')}>
          {leads.map((lead) => {
            const isOpen = openId === lead.id;
            const calc = lead.calculatorData as
              | {
                  budget?: { from: number; to: number } | null;
                  choices?: { question: string; labels: string[] }[];
                  estimate?: { price?: number; priceFrom?: number; priceTo?: number };
                }
              | null;

            return (
              <li key={lead.id}>
                <AdminCard>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 p-3.5">
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : lead.id)}
                      aria-expanded={isOpen}
                      className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                    >
                      <ChevronDown
                        className={cn(
                          'size-4 shrink-0 text-black/35 transition-transform',
                          isOpen && 'rotate-180',
                        )}
                        aria-hidden="true"
                      />
                      <span className="truncate text-[0.875rem] font-semibold">{lead.name}</span>
                      <span className="tabular shrink-0 text-[0.875rem] text-black/60">
                        {formatPhone(lead.phone)}
                      </span>
                      <span className="hidden shrink-0 text-[0.75rem] text-black/40 sm:inline">
                        {SOURCE_LABELS[lead.source] ?? lead.source}
                      </span>
                    </button>

                    <span
                      className={cn(
                        'shrink-0 rounded-[2px] px-2 py-0.5 text-[0.6875rem] font-medium',
                        STATUS_STYLES[lead.status],
                      )}
                    >
                      {STATUS_LABELS[lead.status]}
                    </span>

                    <span className="shrink-0 text-[0.75rem] tabular text-black/40">
                      {formatDateTimeRu(lead.createdAt)}
                    </span>
                  </div>

                  {isOpen && (
                    <div className="border-t border-black/8 p-4">
                      <div className="grid gap-5 lg:grid-cols-2">
                        <div>
                          <h3 className="mb-2 text-[0.8125rem] font-semibold">Контакты</h3>
                          <dl className="space-y-1.5 text-[0.8125rem]">
                            <div className="flex gap-3">
                              <dt className="w-28 shrink-0 text-black/45">Телефон</dt>
                              <dd>
                                <a
                                  href={`tel:${telHref(lead.phone)}`}
                                  className="font-medium text-brand hover:underline"
                                >
                                  {formatPhone(lead.phone)}
                                </a>
                              </dd>
                            </div>
                            {lead.email && (
                              <div className="flex gap-3">
                                <dt className="w-28 shrink-0 text-black/45">E-mail</dt>
                                <dd>{lead.email}</dd>
                              </div>
                            )}
                            {lead.message && (
                              <div className="flex gap-3">
                                <dt className="w-28 shrink-0 text-black/45">Сообщение</dt>
                                <dd className="whitespace-pre-wrap">{lead.message}</dd>
                              </div>
                            )}
                            {lead.pageUrl && (
                              <div className="flex gap-3">
                                <dt className="w-28 shrink-0 text-black/45">Страница</dt>
                                <dd className="min-w-0 truncate text-black/60">{lead.pageUrl}</dd>
                              </div>
                            )}
                            {Object.entries(lead.utm)
                              .filter(([, value]) => value)
                              .map(([key, value]) => (
                                <div key={key} className="flex gap-3">
                                  <dt className="w-28 shrink-0 text-black/45">utm_{key}</dt>
                                  <dd>{value}</dd>
                                </div>
                              ))}
                            {lead.webhookStatus && (
                              <div className="flex gap-3">
                                <dt className="w-28 shrink-0 text-black/45">Вебхук</dt>
                                <dd className="text-black/60">{lead.webhookStatus}</dd>
                              </div>
                            )}
                          </dl>
                        </div>

                        {calc && (
                          <div>
                            <h3 className="mb-2 text-[0.8125rem] font-semibold">Расчёт</h3>
                            <dl className="space-y-1.5 text-[0.8125rem]">
                              {calc.budget && (
                                <div className="flex gap-3">
                                  <dt className="w-40 shrink-0 text-black/45">Бюджет на авто</dt>
                                  <dd className="tabular">
                                    {formatMoney(calc.budget.from, false)}–
                                    {formatMoney(calc.budget.to)}
                                  </dd>
                                </div>
                              )}
                              {calc.estimate?.price !== undefined && (
                                <div className="flex gap-3">
                                  <dt className="w-40 shrink-0 text-black/45">Оценка услуги</dt>
                                  <dd className="tabular font-semibold">
                                    {formatMoney(calc.estimate.price)}
                                  </dd>
                                </div>
                              )}
                              {(calc.choices ?? []).map((choice) => (
                                <div key={choice.question} className="flex gap-3">
                                  <dt className="w-40 shrink-0 text-black/45">{choice.question}</dt>
                                  <dd>{choice.labels.join(', ')}</dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        )}
                      </div>

                      <div className="mt-5 border-t border-black/8 pt-4">
                        <label
                          htmlFor={`note-${lead.id}`}
                          className="mb-1.5 block text-[0.8125rem] font-medium text-black/70"
                        >
                          Заметка менеджера
                        </label>
                        <textarea
                          id={`note-${lead.id}`}
                          rows={2}
                          className="w-full rounded-[3px] border border-black/12 px-3 py-2 text-[0.8125rem] outline-none focus:border-black/45"
                          value={notes[lead.id] ?? lead.adminNote ?? ''}
                          onChange={(e) =>
                            setNotes((prev) => ({ ...prev, [lead.id]: e.target.value }))
                          }
                        />

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <AdminButton variant="secondary" onClick={() => void persistNote(lead)}>
                            Сохранить заметку
                          </AdminButton>

                          <span className="mx-1 h-5 w-px bg-black/10" aria-hidden="true" />

                          {(Object.keys(STATUS_LABELS) as LeadStatus[])
                            .filter((status) => status !== lead.status)
                            .map((status) => (
                              <AdminButton
                                key={status}
                                variant="secondary"
                                onClick={() => void changeStatus(lead, status)}
                              >
                                {STATUS_LABELS[status]}
                              </AdminButton>
                            ))}

                          <AdminButton
                            variant="danger"
                            className="ml-auto"
                            onClick={() => setToDelete(lead)}
                          >
                            <Trash2 className="size-3.5" aria-hidden="true" />
                            Удалить
                          </AdminButton>
                        </div>
                      </div>
                    </div>
                  )}
                </AdminCard>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Удалить заявку?"
        description="Заявка будет удалена безвозвратно."
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) void remove(toDelete);
        }}
      />

      {node}
    </>
  );
}
