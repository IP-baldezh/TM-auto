'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, GripVertical, Plus, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { EntityKey } from '@/lib/admin/entities';
import { deleteEntityItem, reorderEntity, saveEntityItem } from '@/app/admin/actions';
import {
  AdminButton,
  AdminCard,
  AdminFieldGrid,
  ConfirmDialog,
  useToast,
  type AdminFieldDef,
  type AdminValues,
} from './ui';

type Row = AdminValues & { id: string };

export function CollectionEditor({
  entity,
  fields,
  items,
  titleField,
  singular,
  sortable = true,
  creatable = true,
  deletable = true,
  parentStepId,
  defaults,
  compact = false,
}: {
  entity: EntityKey;
  fields: AdminFieldDef[];
  items: Row[];
  titleField: string;
  singular: string;
  sortable?: boolean;
  creatable?: boolean;
  deletable?: boolean;
  parentStepId?: string;
  defaults?: AdminValues;
  compact?: boolean;
}) {
  const [rows, setRows] = React.useState<Row[]>(items);
  const [drafts, setDrafts] = React.useState<Record<string, AdminValues>>({});
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [savingId, setSavingId] = React.useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<Row | null>(null);
  const dragIndex = React.useRef<number | null>(null);
  const { show, node: toastNode } = useToast();
  const router = useRouter();

  // Синхронизация с серверными данными выполняется во время рендера, а не в
  // эффекте: это рекомендованный React способ пересчитать состояние при смене
  // пропсов, и он не вызывает лишнего прохода отрисовки.
  // Несохранённые новые строки при этом сохраняются.
  const [syncedItems, setSyncedItems] = React.useState(items);
  if (items !== syncedItems) {
    setSyncedItems(items);
    setRows((prev) => [...items, ...prev.filter((row) => row.id.startsWith('new:'))]);
  }

  const valuesFor = (row: Row): AdminValues => drafts[row.id] ?? row;

  const setValue = (id: string, name: string, next: unknown) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? rows.find((r) => r.id === id) ?? {}), [name]: next },
    }));
  };

  const save = async (row: Row) => {
    setSavingId(row.id);
    const isNew = row.id.startsWith('new:');
    const payload = valuesFor(row);

    const result = await saveEntityItem(
      entity,
      isNew ? null : row.id,
      payload,
      parentStepId ? { stepId: parentStepId } : undefined,
    );

    setSavingId(null);

    if (!result.ok) {
      show(result.error, 'error');
      return;
    }

    show('Сохранено');
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[row.id];
      return next;
    });
    if (isNew) setRows((prev) => prev.filter((r) => r.id !== row.id));
    // Подтягиваем серверное состояние: у новой записи появляется настоящий id.
    router.refresh();
  };

  const remove = async (row: Row) => {
    setPendingDelete(null);
    if (row.id.startsWith('new:')) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      return;
    }
    const result = await deleteEntityItem(entity, row.id);
    if (!result.ok) {
      show(result.error, 'error');
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    show('Удалено');
  };

  const addRow = () => {
    const id = `new:${Date.now()}`;
    const blank: Row = { id, sortOrder: rows.length, enabled: true, ...defaults };
    for (const field of fields) {
      if (field.name in blank) continue;
      blank[field.name] =
        field.type === 'switch'
          ? field.name === 'enabled' || field.name === 'published'
          : field.type === 'list'
            ? []
            : field.type === 'number'
              ? null
              : field.type === 'select'
                ? (field.options?.[0]?.value ?? '')
                : '';
    }
    setRows((prev) => [...prev, blank]);
    setOpenId(id);
  };

  const persistOrder = async (next: Row[]) => {
    const ids = next.filter((r) => !r.id.startsWith('new:')).map((r) => r.id);
    const result = await reorderEntity(entity, ids);
    if (!result.ok) show(result.error, 'error');
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= rows.length) return;
    const next = [...rows];
    const [moved] = next.splice(from, 1);
    if (!moved) return;
    next.splice(to, 0, moved);
    setRows(next);
    void persistOrder(next);
  };

  return (
    <div className={compact ? '' : 'space-y-3'}>
      {rows.length === 0 && (
        <AdminCard className="p-8 text-center text-sm text-black/45">
          Пока пусто. Добавьте первый элемент.
        </AdminCard>
      )}

      <ul className="space-y-2">
        {rows.map((row, index) => {
          const values = valuesFor(row);
          const isOpen = openId === row.id;
          const dirty = Boolean(drafts[row.id]) || row.id.startsWith('new:');
          const label = String(values[titleField] ?? '') || `Новый ${singular}`;
          const hidden = values.enabled === false || values.published === false;

          return (
            <li
              key={row.id}
              draggable={sortable && !isOpen}
              onDragStart={() => {
                dragIndex.current = index;
              }}
              onDragOver={(e) => {
                if (sortable) e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex.current !== null && dragIndex.current !== index) {
                  move(dragIndex.current, index);
                }
                dragIndex.current = null;
              }}
            >
              <AdminCard>
                <div className="flex items-center gap-2 px-3 py-2.5">
                  {sortable && (
                    <span
                      className="cursor-grab text-black/25 active:cursor-grabbing"
                      aria-hidden="true"
                      title="Перетащите, чтобы изменить порядок"
                    >
                      <GripVertical className="size-4" />
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : row.id)}
                    aria-expanded={isOpen}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  >
                    <ChevronDown
                      className={cn(
                        'size-4 shrink-0 text-black/40 transition-transform',
                        isOpen && 'rotate-180',
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate text-[0.875rem] font-medium">{label}</span>
                    {hidden && (
                      <span className="shrink-0 rounded-[2px] bg-black/8 px-1.5 py-0.5 text-[0.625rem] text-black/50">
                        скрыто
                      </span>
                    )}
                    {dirty && (
                      <span className="shrink-0 rounded-[2px] bg-brand/12 px-1.5 py-0.5 text-[0.625rem] text-brand">
                        не сохранено
                      </span>
                    )}
                  </button>

                  {sortable && (
                    <span className="hidden shrink-0 gap-0.5 sm:flex">
                      <AdminButton
                        variant="ghost"
                        aria-label="Выше"
                        className="h-7 px-1.5"
                        onClick={() => move(index, index - 1)}
                        disabled={index === 0}
                      >
                        ↑
                      </AdminButton>
                      <AdminButton
                        variant="ghost"
                        aria-label="Ниже"
                        className="h-7 px-1.5"
                        onClick={() => move(index, index + 1)}
                        disabled={index === rows.length - 1}
                      >
                        ↓
                      </AdminButton>
                    </span>
                  )}

                  {deletable && (
                    <AdminButton
                      variant="ghost"
                      aria-label={`Удалить ${singular}`}
                      className="h-7 shrink-0 px-1.5"
                      onClick={() => setPendingDelete(row)}
                    >
                      <Trash2 className="size-4" />
                    </AdminButton>
                  )}
                </div>

                {isOpen && (
                  <div className="border-t border-black/8 p-4">
                    <AdminFieldGrid
                      fields={fields}
                      values={values}
                      onChange={(name, next) => setValue(row.id, name, next)}
                    />
                    <div className="mt-5 flex justify-end gap-2">
                      <AdminButton variant="secondary" onClick={() => setOpenId(null)}>
                        Свернуть
                      </AdminButton>
                      <AdminButton
                        loading={savingId === row.id}
                        onClick={() => void save(row)}
                      >
                        Сохранить
                      </AdminButton>
                    </div>
                  </div>
                )}
              </AdminCard>
            </li>
          );
        })}
      </ul>

      {creatable && (
        <AdminButton variant="secondary" className="mt-3" onClick={addRow}>
          <Plus className="size-4" aria-hidden="true" />
          Добавить {singular}
        </AdminButton>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Удалить ${singular}?`}
        description="Действие нельзя отменить."
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) void remove(pendingDelete);
        }}
      />

      {toastNode}
    </div>
  );
}
