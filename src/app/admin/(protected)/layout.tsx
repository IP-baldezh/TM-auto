import { requireAdmin } from '@/lib/auth/guard';
import { AdminShell } from '@/components/admin/AdminShell';
import { logoutAction } from '@/app/admin/actions';

export const dynamic = 'force-dynamic';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <AdminShell userName={session.name || session.email} onLogout={logoutAction}>
      {children}
    </AdminShell>
  );
}
