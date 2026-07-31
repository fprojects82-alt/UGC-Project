'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { LogOut } from 'lucide-react';

export function SignOutButton() {
  const t = useTranslations('auth');
  const router = useRouter();

  async function signOut() {
    await createClient().auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={signOut}
      className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-card hover:text-foreground"
    >
      <LogOut className="h-4 w-4 rtl:rotate-180" />
      {t('signOut')}
    </button>
  );
}
