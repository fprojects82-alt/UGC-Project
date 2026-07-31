'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/primitives';

const inputCls =
  'w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-ring';

export function AuthForm({ mode, configured }: { mode: 'signin' | 'signup'; configured: boolean }) {
  const t = useTranslations('auth');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const isSignup = mode === 'signup';

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!configured) {
      setMsg(t('notConfigured'));
      return;
    }
    setLoading(true);
    setMsg(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email'));
    const password = String(form.get('password'));
    const fullName = String(form.get('fullName') || '');
    const supabase = createClient();

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        });
        if (error) throw error;
        setMsg(t('checkEmail'));
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setMsg(t('genericError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md p-8">
      <h1 className="font-display text-2xl font-bold">{isSignup ? t('signUpTitle') : t('signInTitle')}</h1>
      {!configured && (
        <p className="mt-3 rounded-md bg-accent/10 px-3 py-2 text-sm text-accent">{t('notConfigured')}</p>
      )}
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {isSignup && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">{t('fullName')}</span>
            <input name="fullName" className={inputCls} />
          </label>
        )}
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">{t('email')}</span>
          <input name="email" type="email" required className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">{t('password')}</span>
          <input name="password" type="password" required minLength={6} className={inputCls} />
        </label>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t('working') : isSignup ? t('signUpCta') : t('signInCta')}
        </Button>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isSignup ? t('haveAccount') : t('noAccount')}{' '}
        <Link href={isSignup ? '/login' : '/signup'} className="text-primary hover:underline">
          {isSignup ? t('signInLink') : t('signUpLink')}
        </Link>
      </p>
    </Card>
  );
}
