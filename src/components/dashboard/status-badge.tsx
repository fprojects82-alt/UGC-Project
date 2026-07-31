import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

const styles: Record<string, string> = {
  new: 'bg-muted text-muted-foreground',
  brief_confirmed: 'bg-primary/15 text-primary',
  in_production: 'bg-primary/15 text-primary',
  internal_qa: 'bg-accent/15 text-accent',
  client_review: 'bg-accent/15 text-accent',
  revision: 'bg-accent/20 text-accent',
  delivered: 'bg-green-500/15 text-green-400',
  closed: 'bg-muted text-muted-foreground'
};

export function StatusBadge({ status }: { status: string }) {
  const t = useTranslations('dashboard.status');
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        styles[status] ?? 'bg-muted text-muted-foreground'
      )}
    >
      {t.has(status) ? t(status) : status}
    </span>
  );
}
