import { prisma } from '@/lib/db';
import { PageHeader } from '@/components/admin/ui';
import { LeadsTable, type LeadRow } from './LeadsTable';

export const dynamic = 'force-dynamic';

const STATUSES = ['NEW', 'IN_PROGRESS', 'DONE', 'SPAM'] as const;
type Status = (typeof STATUSES)[number];

function isStatus(value: string | undefined): value is Status {
  return STATUSES.includes((value ?? '') as Status);
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const status = isStatus(params.status) ? params.status : undefined;
  const query = (params.q ?? '').trim();

  const leads = await prisma.lead
    .findMany({
      where: {
        ...(status ? { status } : {}),
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: 'insensitive' as const } },
                { phone: { contains: query } },
                { message: { contains: query, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 300,
    })
    .catch(() => []);

  const counts = await prisma
    .$transaction([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'NEW' } }),
      prisma.lead.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.lead.count({ where: { status: 'DONE' } }),
      prisma.lead.count({ where: { status: 'SPAM' } }),
    ])
    .catch(() => [0, 0, 0, 0, 0]);

  const rows: LeadRow[] = leads.map((lead) => ({
    id: lead.id,
    createdAt: lead.createdAt.toISOString(),
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    message: lead.message,
    source: lead.source,
    status: lead.status,
    adminNote: lead.adminNote,
    webhookStatus: lead.webhookStatus,
    utm: {
      source: lead.utmSource,
      medium: lead.utmMedium,
      campaign: lead.utmCampaign,
      content: lead.utmContent,
      term: lead.utmTerm,
    },
    pageUrl: lead.pageUrl,
    calculatorData: lead.calculatorData as Record<string, unknown> | null,
  }));

  return (
    <>
      <PageHeader
        title="Заявки"
        description="Заявки из калькулятора и форм на сайте. Статус меняется прямо в списке."
      />
      <LeadsTable
        leads={rows}
        activeStatus={status ?? null}
        query={query}
        counts={{
          all: counts[0] ?? 0,
          NEW: counts[1] ?? 0,
          IN_PROGRESS: counts[2] ?? 0,
          DONE: counts[3] ?? 0,
          SPAM: counts[4] ?? 0,
        }}
      />
    </>
  );
}
