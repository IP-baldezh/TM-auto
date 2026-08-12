import { ENTITIES, type EntityKey } from '@/lib/admin/entities';
import { loadEntity } from '@/lib/admin/queries';
import { CollectionEditor } from './CollectionEditor';
import { AdminCard, PageHeader } from './ui';

/**
 * Одна серверная обёртка на все списочные разделы: тянет записи, берёт
 * описание полей из реестра сущностей и отдаёт их редактору.
 */
export async function CollectionPage({
  entity,
  title,
  description,
}: {
  entity: EntityKey;
  title?: string;
  description?: string;
}) {
  const config = ENTITIES[entity];
  const items = await loadEntity(entity);

  return (
    <>
      <PageHeader title={title ?? config.title} description={description} />

      {items.length === 0 && (
        <AdminCard className="mb-3 border-brand/25 bg-brand/4 p-4 text-[0.8125rem] text-black/65">
          Список пуст. Если данные должны быть — проверьте, что база доступна и выполнены команды{' '}
          <code className="rounded-[2px] bg-black/6 px-1">npm run db:deploy</code> и{' '}
          <code className="rounded-[2px] bg-black/6 px-1">npm run db:seed</code>.
        </AdminCard>
      )}

      <CollectionEditor
        entity={entity}
        fields={config.fields}
        items={items}
        titleField={config.titleField}
        singular={config.singular}
        sortable={config.sortable}
        creatable={config.creatable}
        deletable={config.deletable}
      />
    </>
  );
}
