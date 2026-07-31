'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import type { Role } from '@/lib/auth';
import { SignOutButton } from './sign-out';
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Receipt,
  ListChecks,
  KanbanSquare,
  Users,
  UserSquare,
  BookImage
} from 'lucide-react';

const navByRole: Record<Role, { href: string; key: string; Icon: any }[]> = {
  client: [
    { href: '/dashboard', key: 'orders', Icon: Package },
    { href: '/dashboard#invoices', key: 'invoices', Icon: Receipt }
  ],
  creator: [{ href: '/dashboard/creator', key: 'queue', Icon: ListChecks }],
  account_manager: [
    { href: '/dashboard/admin', key: 'pipeline', Icon: KanbanSquare },
    { href: '/dashboard/admin#clients', key: 'clients', Icon: Users }
  ],
  admin: [
    { href: '/dashboard/admin', key: 'overview', Icon: LayoutDashboard },
    { href: '/dashboard/admin#pipeline', key: 'pipeline', Icon: KanbanSquare },
    { href: '/dashboard/admin#influencers', key: 'influencers', Icon: BookImage },
    { href: '/dashboard/admin#clients', key: 'clients', Icon: Users },
    { href: '/dashboard/admin#catalog', key: 'catalog', Icon: UserSquare }
  ]
};

export function Sidebar({ role, name, email }: { role: Role; name: string | null; email: string | null }) {
  const t = useTranslations('dashboard');
  const pathname = usePathname();
  const items = navByRole[role] ?? navByRole.client;

  return (
    <aside className="flex w-full flex-col gap-1 border-b border-border bg-card/40 p-4 md:h-[calc(100dvh-4rem)] md:w-64 md:border-b-0 md:border-e">
      <div className="mb-4 px-2">
        <p className="text-sm font-semibold">{name || email}</p>
        <p className="text-xs text-muted-foreground capitalize">{role.replace('_', ' ')}</p>
      </div>
      <nav className="flex flex-1 flex-row gap-1 md:flex-col">
        {items.map(({ href, key, Icon }) => (
          <Link
            key={key}
            href={href}
            className={cn(
              'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-card hover:text-foreground',
              pathname === href && 'bg-card text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{t(`nav.${key}`)}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto hidden md:block">
        <SignOutButton />
      </div>
    </aside>
  );
}
