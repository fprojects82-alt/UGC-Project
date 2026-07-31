import { setRequestLocale, getTranslations } from 'next-intl/server';
import {
  getRevenueSummary,
  getUnassignedJobs,
  getCreatorWorkload,
  getAllOrders,
  getInfluencerLibrary
} from '@/lib/staff-queries';
import { Card } from '@/components/ui/primitives';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { AssignControl } from '@/components/dashboard/assign-control';
import { PIPELINE } from '@/lib/pipeline';
import { cn } from '@/lib/utils';
import { Ban, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('admin');
  const tStatus = await getTranslations('dashboard.status');

  const [rev, unassigned, workload, orders, library] = await Promise.all([
    getRevenueSummary(),
    getUnassignedJobs(),
    getCreatorWorkload(),
    getAllOrders(),
    getInfluencerLibrary()
  ]);

  const kpis = [
    { key: 'revenue', value: `$${rev.revenue.toLocaleString()}` },
    { key: 'cost', value: `$${rev.cost.toLocaleString()}` },
    { key: 'margin', value: `$${rev.margin.toLocaleString()}` },
    { key: 'orders', value: rev.count.toString() }
  ];

  const board = PIPELINE.map((s) => ({
    status: s,
    items: (orders as any[]).filter((o) => o.status === s)
  }));

  return (
    <div className="space-y-12">
      <h1 className="font-display text-2xl font-bold">{t('title')}</h1>

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.key} className="p-5">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{t(`kpi.${k.key}`)}</div>
            <div className="mt-1 font-display text-2xl font-bold text-accent">{k.value}</div>
          </Card>
        ))}
      </section>

      {/* Unassigned pool */}
      <section id="pipeline">
        <h2 className="mb-4 font-display text-xl font-bold">{t('unassigned')}</h2>
        {unassigned.length === 0 ? (
          <Card className="p-6 text-center text-sm text-muted-foreground">{t('noUnassigned')}</Card>
        ) : (
          <div className="grid gap-3">
            {(unassigned as any[]).map((j) => (
              <Card key={j.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{j.title}</span>
                  <StatusBadge status={j.status} />
                </div>
                <AssignControl jobId={j.id} creators={workload} />
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Pipeline board */}
      <section>
        <h2 className="mb-4 font-display text-xl font-bold">{t('pipeline')}</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
          {board.map((col) => (
            <div key={col.status} className="rounded-lg border border-border bg-card/40 p-3">
              <div className="mb-2 text-xs font-semibold">{tStatus(col.status)}</div>
              <div className="space-y-2">
                {col.items.map((o: any) => (
                  <div key={o.id} className="rounded-md border border-border bg-card p-2 text-xs">
                    {o.title}
                  </div>
                ))}
                {col.items.length === 0 && <div className="text-xs text-muted-foreground">—</div>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Creator capacity */}
      <section id="clients">
        <h2 className="mb-4 font-display text-xl font-bold">{t('workload')}</h2>
        {workload.length === 0 ? (
          <Card className="p-6 text-center text-sm text-muted-foreground">{t('empty')}</Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {workload.map((c: any) => {
              const full = c.load >= c.capacity;
              const pct = Math.min(100, Math.round((c.load / Math.max(1, c.capacity)) * 100));
              return (
                <Card key={c.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{c.name || c.id.slice(0, 6)}</span>
                    <span className={cn('text-xs', full ? 'text-accent' : 'text-muted-foreground')}>
                      {c.load}/{c.capacity} {full && `· ${t('atCapacity')}`}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div className={cn('h-full', full ? 'bg-accent' : 'bg-primary')} style={{ width: `${pct}%` }} />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Influencer library — sensitive: expired/missing licenses are BLOCKED. */}
      <section id="influencers">
        <h2 className="mb-4 font-display text-xl font-bold">{t('influencers')}</h2>
        {library.length === 0 ? (
          <Card className="p-6 text-center text-sm text-muted-foreground">{t('empty')}</Card>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="bg-card/60 text-start text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  {['name', 'license', 'start', 'expiry', 'permitted', 'forbidden', 'approval', 'rate', 'select'].map((h) => (
                    <th key={h} className="px-3 py-2 text-start font-medium">{t(`lib.${h}`)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(library as any[]).map((row) => (
                  <tr key={row.id} className={cn(!row.selectable && 'bg-accent/5 opacity-90')}>
                    <td className="px-3 py-2 font-medium">{row.name}</td>
                    <td className="px-3 py-2">
                      <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs',
                        row.selectable ? 'bg-green-500/15 text-green-400' : 'bg-accent/20 text-accent')}>
                        {row.selectable ? <ShieldCheck className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{row.start || '—'}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.expiry || '—'}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{(row.permitted || []).join(', ') || '—'}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{(row.forbidden || []).join(', ') || '—'}</td>
                    <td className="px-3 py-2">{row.approvalRequired ? t('lib.yes') : t('lib.no')}</td>
                    <td className="px-3 py-2">{row.rate ? `$${row.rate}` : '—'}</td>
                    <td className="px-3 py-2">
                      {row.selectable ? (
                        <button className="rounded-md border border-border px-2.5 py-1 text-xs hover:bg-card">
                          {t('lib.select')}
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent" title={t('lib.blocked')}>
                          <Ban className="h-3 w-3" /> {t('lib.blocked')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Catalog note */}
      <section id="catalog">
        <h2 className="mb-2 font-display text-xl font-bold">{t('catalog')}</h2>
        <p className="text-sm text-muted-foreground">{t('catalogManage')}</p>
      </section>
    </div>
  );
}
