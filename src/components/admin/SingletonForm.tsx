'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import type { SingletonKey } from '@/lib/admin/entities';
import { saveSingleton } from '@/app/admin/actions';
import {
  AdminButton,
  AdminCard,
  AdminFieldGrid,
  useToast,
  type AdminFieldDef,
  type AdminValues,
} from './ui';

export function SingletonForm({
  singleton,
  fields,
  values: initial,
}: {
  singleton: SingletonKey;
  fields: AdminFieldDef[];
  values: AdminValues;
}) {
  const [values, setValues] = React.useState<AdminValues>(initial);
  const [saving, setSaving] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);
  const { show, node } = useToast();
  const router = useRouter();

  const onChange = (name: string, next: unknown) => {
    setValues((prev) => ({ ...prev, [name]: next }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    const result = await saveSingleton(singleton, values);
    setSaving(false);

    if (!result.ok) {
      show(result.error, 'error');
      return;
    }
    setDirty(false);
    show('Сохранено');
    router.refresh();
  };

  return (
    <>
      <AdminCard className="p-5 sm:p-6">
        <AdminFieldGrid fields={fields} values={values} onChange={onChange} />
      </AdminCard>

      <div className="sticky bottom-0 mt-4 flex items-center justify-end gap-3 border-t border-black/8 bg-[#f6f6f4]/90 py-3 backdrop-blur">
        {dirty && <span className="text-[0.75rem] text-black/50">Есть несохранённые изменения</span>}
        <AdminButton loading={saving} onClick={() => void save()}>
          Сохранить
        </AdminButton>
      </div>

      {node}
    </>
  );
}
