'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './language-switcher';
import { brand } from '@/brand/tokens';

const links = [
  { href: '/services', key: 'services' },
  { href: '/work', key: 'work' },
  { href: '/influencers', key: 'influencers' },
  { href: '/pricing', key: 'pricing' },
  { href: '/about', key: 'about' }
] as const;

export function Navbar() {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="container flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Link href="/" className="font-display text-lg font-bold tracking-tight">
          {brand.name}
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.key}>
              <Link
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t(l.key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <Link href="/contact">
            <Button size="sm">{t('bookCall')}</Button>
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <ul className="container flex flex-col gap-1 py-4">
            {links.map((l) => (
              <li key={l.key}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-sm hover:bg-card"
                >
                  {t(l.key)}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex items-center justify-between gap-3">
              <LanguageSwitcher />
              <Link href="/contact" onClick={() => setOpen(false)} className="flex-1">
                <Button size="sm" className="w-full">
                  {t('bookCall')}
                </Button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
