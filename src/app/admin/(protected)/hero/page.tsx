import { prisma } from '@/lib/db';
import { DEFAULT_HERO } from '@/content/defaults';
import { SingletonPage } from '@/components/admin/SingletonPage';

export const dynamic = 'force-dynamic';

export default async function HeroAdminPage() {
  const row = await prisma.heroSection.findUnique({ where: { id: 'hero' } }).catch(() => null);

  return (
    <SingletonPage
      singleton="hero"
      missing={!row}
      values={(row ?? { ...DEFAULT_HERO, enabled: true }) as unknown as Record<string, unknown>}
    />
  );
}
