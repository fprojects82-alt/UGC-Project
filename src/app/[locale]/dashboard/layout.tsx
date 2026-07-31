import { setRequestLocale, getTranslations } from 'next-intl/server';
import { redirect } from '@/i18n/routing';
import { getSessionUser, isConfigured } from '@/lib/auth';
import { Sidebar } from '@/components/dashboard/sidebar';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const configured = isConfigured();
  const user = await getSessionUser();

  // Server-side access control: no client-side route guard.
  if (configured && !user) {
    redirect({ href: '/login', locale });
  }

  const t = await getTranslations('dashboard');
  const role = user?.role ?? 'client';

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar role={role} name={user?.name ?? null} email={user?.email ?? null} />
      <div className="flex-1">
        {!configured && (
          <div className="border-b border-accent/30 bg-accent/10 px-6 py-3 text-sm text-accent">
            {t('notConfigured')}
          </div>
        )}
        <div className="p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}
