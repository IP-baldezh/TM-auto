import { prisma } from '@/lib/db';
import { DEFAULT_SITE } from '@/content/defaults';
import { SingletonPage } from '@/components/admin/SingletonPage';
import { AdminCard } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function SettingsAdminPage() {
  const row = await prisma.siteSettings.findUnique({ where: { id: 'site' } }).catch(() => null);

  return (
    <SingletonPage
      singleton="settings"
      missing={!row}
      values={(row ?? DEFAULT_SITE) as unknown as Record<string, unknown>}
    >
      <AdminCard className="mt-6 p-5 text-[0.8125rem] leading-relaxed text-black/60">
        <p className="mb-2 font-semibold text-black/80">Телефоны подразделений</p>
        <p>
          Список телефонов редактируется в разделе «Контакты». Телефон, отмеченный как «Телефон
          автоподбора», показывается в шапке сайта и на главном экране; остальные — в подвале и в
          блоке контактов.
        </p>
      </AdminCard>
    </SingletonPage>
  );
}
