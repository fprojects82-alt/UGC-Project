'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/primitives';
import { services } from '@/data/site';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const inputCls =
  'w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-ring';

export function IntakeForm() {
  const t = useTranslations('contact');
  const tServices = useTranslations('services');
  const [status, setStatus] = useState<Status>('idle');
  const [msg, setMsg] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries()) as Record<string, string>;

    if (!data.name?.trim() || !data.email?.trim()) {
      setStatus('error');
      setMsg(t('required'));
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setMsg(t('success'));
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus('error');
      setMsg(t('error'));
    }
  }

  const platforms = t.raw('options.platforms') as string[];
  const budgets = t.raw('options.budgets') as string[];
  const timelines = t.raw('options.timelines') as string[];
  const languages = t.raw('options.languages') as string[];

  return (
    <Card className="p-6 md:p-8">
      <h2 className="mb-6 font-display text-xl font-bold">{t('formTitle')}</h2>
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
        <Field label={`${t('fields.name')} *`}>
          <input name="name" required placeholder={t('placeholders.name')} className={inputCls} />
        </Field>
        <Field label={t('fields.company')}>
          <input name="company" placeholder={t('placeholders.company')} className={inputCls} />
        </Field>
        <Field label={`${t('fields.email')} *`}>
          <input name="email" type="email" required placeholder={t('placeholders.email')} className={inputCls} />
        </Field>
        <Field label={t('fields.whatsapp')}>
          <input name="whatsapp" inputMode="tel" placeholder={t('placeholders.whatsapp')} className={inputCls} />
        </Field>

        <Field label={t('fields.serviceType')}>
          <select name="serviceType" className={inputCls} defaultValue="">
            <option value="" disabled>{t('options.selectService')}</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>{tServices(`items.${s.key}.name`)}</option>
            ))}
          </select>
        </Field>
        <Field label={t('fields.targetPlatform')}>
          <select name="targetPlatform" className={inputCls} defaultValue={platforms[0]}>
            {platforms.map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label={t('fields.budget')}>
          <select name="budget" className={inputCls} defaultValue={budgets[1]}>
            {budgets.map((b) => <option key={b}>{b}</option>)}
          </select>
        </Field>
        <Field label={t('fields.timeline')}>
          <select name="timeline" className={inputCls} defaultValue={timelines[1]}>
            {timelines.map((tl) => <option key={tl}>{tl}</option>)}
          </select>
        </Field>
        <Field label={t('fields.language')}>
          <select name="language" className={inputCls} defaultValue={languages[2]}>
            {languages.map((l) => <option key={l}>{l}</option>)}
          </select>
        </Field>
        <Field label={t('fields.assets')}>
          {/* Phase 2: filename captured; direct-to-bucket signed upload wired with auth in Phase 3. */}
          <input name="assetName" type="file" className={`${inputCls} py-2`} />
        </Field>

        <div className="sm:col-span-2">
          <Field label={t('fields.message')}>
            <textarea name="message" rows={4} placeholder={t('placeholders.message')} className={inputCls} />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={status === 'submitting'}>
            {status === 'submitting' ? t('submitting') : t('submit')}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">{t('consent')}</p>
          {status === 'success' && (
            <p role="status" className="mt-3 rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">{msg}</p>
          )}
          {status === 'error' && (
            <p role="alert" className="mt-3 rounded-md bg-accent/10 px-3 py-2 text-sm text-accent">{msg}</p>
          )}
        </div>
      </form>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
