import { prisma } from '@/lib/db';
import { DEFAULT_SEO } from '@/content/defaults';
import { SingletonPage } from '@/components/admin/SingletonPage';

export const dynamic = 'force-dynamic';

export default async function SeoAdminPage() {
  const row = await prisma.seoSettings.findUnique({ where: { id: 'seo' } }).catch(() => null);

  return (
    <SingletonPage
      singleton="seo"
      missing={!row}
      values={(row ?? DEFAULT_SEO) as unknown as Record<string, unknown>}
    />
  );
}
