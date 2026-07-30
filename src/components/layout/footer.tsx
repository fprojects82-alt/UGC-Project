import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Instagram, Linkedin } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { brand } from '@/brand/tokens';

export function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  const cols = [
    {
      title: t('services'),
      links: [
        { href: '/services/ai-characters', label: t('services') },
        { href: '/work', label: t('work') },
        { href: '/influencers', label: t('social') }
      ]
    },
    {
      title: t('company'),
      links: [
        { href: '/about', label: t('about') },
        { href: '/contact', label: t('contact') }
      ]
    },
    {
      title: t('legal'),
      links: [
        { href: '/legal/privacy', label: t('privacy') },
        { href: '/legal/terms', label: t('terms') },
        { href: '/legal/ai-disclosure', label: t('disclosure') }
      ]
    }
  ];

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container grid gap-10 py-16 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold">{brand.name}</p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{t('tagline')}</p>
          <div className="mt-5 flex gap-3">
            <a href={brand.social.instagram} aria-label="Instagram" className="text-muted-foreground hover:text-foreground">
              <Instagram className="h-5 w-5" />
            </a>
            <a href={brand.social.linkedin} aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 text-sm font-semibold">{col.title}</h3>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {year} {brand.name}. {t('rights')}</p>
          <div className="flex items-center gap-2">
            <span className="sr-only">{t('language')}</span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
