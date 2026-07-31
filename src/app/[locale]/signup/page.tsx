import { setRequestLocale } from 'next-intl/server';
import { AuthForm } from '@/components/auth/auth-form';
import { isConfigured } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default function SignupPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return (
    <div className="container flex min-h-[70vh] items-center py-16">
      <AuthForm mode="signup" configured={isConfigured()} />
    </div>
  );
}
