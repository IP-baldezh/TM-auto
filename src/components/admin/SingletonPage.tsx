import { SINGLETONS, type SingletonKey } from '@/lib/admin/entities';
import { SingletonForm } from './SingletonForm';
import { AdminCard, PageHeader, type AdminValues } from './ui';

export function SingletonPage({
  singleton,
  values,
  missing,
  children,
}: {
  singleton: SingletonKey;
  values: AdminValues;
  missing?: boolean;
  children?: React.ReactNode;
}) {
  const config = SINGLETONS[singleton];

  return (
    <>
      <PageHeader title={config.title} description={config.description} />

      {missing && (
        <AdminCard className="mb-3 border-brand/25 bg-brand/4 p-4 text-[0.8125rem] text-black/65">
          Записи ещё нет в базе — показаны значения по умолчанию. После сохранения они будут
          записаны.
        </AdminCard>
      )}

      <SingletonForm singleton={singleton} fields={config.fields} values={values} />

      {children}
    </>
  );
}
