'use client';

import * as React from 'react';
import { AlertTriangle, Check, Loader2, Upload, X } from 'lucide-react';

import { cn } from '@/lib/utils';

// ── Описание полей ────────────────────────────────────────────────────────

export type AdminFieldType =
  | 'text'
  | 'textarea'
  | 'url'
  | 'number'
  | 'switch'
  | 'list'
  | 'image'
  | 'select'
  | 'date';

export type AdminFieldDef = {
  name: string;
  label: string;
  type: AdminFieldType;
  hint?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  options?: { value: string; label: string }[];
  /** Поле занимает всю ширину строки. */
  wide?: boolean;
};

export type AdminValues = Record<string, unknown>;

// ── Базовые элементы ─────────────────────────────────────────────────────

export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-[4px] border border-black/8 bg-white', className)}>{children}</div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-[-0.02em]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-black/55">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function AdminButton({
  variant = 'primary',
  className,
  loading,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
}) {
  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-dark',
    secondary: 'border border-black/12 bg-white text-black hover:bg-black/4',
    danger: 'border border-brand/40 bg-white text-brand hover:bg-brand hover:text-white',
    ghost: 'text-black/60 hover:bg-black/5 hover:text-black',
  } as const;

  return (
    <button
      className={cn(
        'inline-flex h-9 items-center justify-center gap-2 rounded-[3px] px-3.5 text-[0.8125rem] font-medium transition-colors disabled:opacity-50',
        variants[variant],
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

const inputClass =
  'w-full rounded-[3px] border border-black/12 bg-white px-3 py-2 text-[0.875rem] outline-none transition-colors placeholder:text-black/30 focus:border-black/45';

export function Toast({
  message,
  tone,
  onClose,
}: {
  message: string;
  tone: 'success' | 'error';
  onClose: () => void;
}) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      className={cn(
        'fixed bottom-5 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2.5 rounded-[4px] px-4 py-3 text-[0.8125rem] font-medium text-white shadow-lg',
        tone === 'success' ? 'bg-[#1c7a3e]' : 'bg-brand',
      )}
    >
      {tone === 'success' ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <AlertTriangle className="size-4" aria-hidden="true" />
      )}
      {message}
      <button type="button" onClick={onClose} aria-label="Закрыть" className="ml-1 opacity-70">
        <X className="size-3.5" />
      </button>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = React.useState<{ message: string; tone: 'success' | 'error' } | null>(
    null,
  );
  const show = React.useCallback(
    (message: string, tone: 'success' | 'error' = 'success') => setToast({ message, tone }),
    [],
  );
  const node = toast ? (
    <Toast message={toast.message} tone={toast.tone} onClose={() => setToast(null)} />
  ) : null;
  return { show, node };
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Удалить',
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Отмена"
        className="absolute inset-0 bg-black/45"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-md rounded-[4px] bg-white p-6 shadow-xl"
      >
        <h2 className="text-lg font-bold">{title}</h2>
        {description && <p className="mt-2 text-sm text-black/60">{description}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <AdminButton variant="secondary" onClick={onCancel}>
            Отмена
          </AdminButton>
          <AdminButton variant="danger" onClick={onConfirm} autoFocus>
            {confirmLabel}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}

// ── Загрузка изображения ─────────────────────────────────────────────────

function ImageInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append('file', file);
      const response = await fetch('/api/admin/upload', { method: 'POST', body });
      const data = (await response.json()) as { ok: boolean; url?: string; error?: string };
      if (!response.ok || !data.ok || !data.url) {
        setError(data.error ?? 'Не удалось загрузить файл');
        return;
      }
      onChange(data.url);
    } catch {
      setError('Не удалось загрузить файл');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="flex gap-3">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-[3px] border border-black/10 bg-black/4">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <span className="flex size-full items-center justify-center text-[0.625rem] text-black/30">
              нет
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            className={inputClass}
            value={value}
            placeholder="https://… или /uploads/…"
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void upload(file);
              }}
            />
            <AdminButton
              type="button"
              variant="secondary"
              loading={uploading}
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="size-3.5" aria-hidden="true" />
              Загрузить
            </AdminButton>
            {value && (
              <AdminButton type="button" variant="ghost" onClick={() => onChange('')}>
                Очистить
              </AdminButton>
            )}
          </div>
          {error && <p className="mt-1.5 text-[0.75rem] text-brand">{error}</p>}
        </div>
      </div>
    </div>
  );
}

// ── Список строк ─────────────────────────────────────────────────────────

function ListInput({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  return (
    <div className="space-y-2">
      {value.map((line, index) => (
        <div key={index} className="flex gap-2">
          <input
            className={inputClass}
            value={line}
            onChange={(e) => {
              const next = [...value];
              next[index] = e.target.value;
              onChange(next);
            }}
          />
          <AdminButton
            type="button"
            variant="ghost"
            aria-label="Удалить строку"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
          >
            <X className="size-4" />
          </AdminButton>
        </div>
      ))}
      <AdminButton type="button" variant="secondary" onClick={() => onChange([...value, ''])}>
        Добавить строку
      </AdminButton>
    </div>
  );
}

// ── Универсальное поле ───────────────────────────────────────────────────

export function AdminFieldControl({
  field,
  value,
  onChange,
}: {
  field: AdminFieldDef;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const id = `f-${field.name}`;

  const control = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={id}
            className={cn(inputClass, 'resize-y leading-relaxed')}
            rows={field.rows ?? 4}
            placeholder={field.placeholder}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case 'number':
        return (
          <input
            id={id}
            type="number"
            step="any"
            className={inputClass}
            placeholder={field.placeholder}
            value={value === null || value === undefined ? '' : String(value)}
            onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
          />
        );

      case 'date':
        return (
          <input
            id={id}
            type="date"
            className={inputClass}
            value={typeof value === 'string' ? value.slice(0, 10) : ''}
            onChange={(e) => onChange(e.target.value || null)}
          />
        );

      case 'switch':
        return (
          <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5">
            <input
              id={id}
              type="checkbox"
              className="peer sr-only"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
            />
            <span className="relative h-5 w-9 rounded-full bg-black/18 transition-colors peer-checked:bg-brand peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand">
              <span
                className={cn(
                  'absolute top-0.5 size-4 rounded-full bg-white transition-all',
                  value ? 'left-[1.125rem]' : 'left-0.5',
                )}
              />
            </span>
            <span className="text-[0.8125rem] text-black/65">{value ? 'Включено' : 'Выключено'}</span>
          </label>
        );

      case 'select':
        return (
          <select
            id={id}
            className={inputClass}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
          >
            {(field.options ?? []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'list':
        return (
          <ListInput
            value={Array.isArray(value) ? (value as string[]) : []}
            onChange={(next) => onChange(next)}
          />
        );

      case 'image':
        return (
          <ImageInput
            value={typeof value === 'string' ? value : ''}
            onChange={(next) => onChange(next)}
          />
        );

      default:
        return (
          <input
            id={id}
            type={field.type === 'url' ? 'url' : 'text'}
            className={inputClass}
            placeholder={field.placeholder}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div className={cn(field.wide && 'sm:col-span-2')}>
      <label
        htmlFor={field.type === 'list' || field.type === 'image' ? undefined : id}
        className="mb-1.5 block text-[0.8125rem] font-medium text-black/70"
      >
        {field.label}
        {field.required && <span className="text-brand"> *</span>}
      </label>
      {control()}
      {field.hint && <p className="mt-1.5 text-[0.75rem] text-black/45">{field.hint}</p>}
    </div>
  );
}

export function AdminFieldGrid({
  fields,
  values,
  onChange,
}: {
  fields: AdminFieldDef[];
  values: AdminValues;
  onChange: (name: string, next: unknown) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <AdminFieldControl
          key={field.name}
          field={field}
          value={values[field.name]}
          onChange={(next) => onChange(field.name, next)}
        />
      ))}
    </div>
  );
}
