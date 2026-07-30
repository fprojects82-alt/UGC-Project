'use client';

import { useLocale, useTranslations } from 'next-intl';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Card } from '@/components/ui/primitives';
import { costPerAsset, turnaround, engagementLift } from '@/data/results-charts';
import { isRtl } from '@/i18n/routing';

const COLORS = {
  traditional: 'hsl(240 8% 46%)',
  sana: 'hsl(252 83% 62%)',
  accent: 'hsl(38 78% 60%)'
};

function useAxisProps() {
  const locale = useLocale();
  const rtl = isRtl(locale);
  // Mirror the category axis so bars read start→end in the reading direction.
  return { rtl, xReversed: rtl, yOrientation: (rtl ? 'right' : 'left') as 'right' | 'left' };
}

function ChartCard({
  title,
  caption,
  children
}: {
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col p-5">
      <h3 className="mb-1 text-sm font-semibold">{title}</h3>
      <div className="h-56 w-full" dir="ltr">
        {/* Chart canvas kept LTR; category axis is reversed under RTL instead. */}
        {children}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{caption}</p>
    </Card>
  );
}

const tooltipStyle = {
  contentStyle: {
    background: 'hsl(240 18% 10%)',
    border: '1px solid hsl(240 12% 18%)',
    borderRadius: 12,
    fontSize: 12
  },
  labelStyle: { color: 'hsl(240 20% 96%)' }
};

export function CostChart() {
  const t = useTranslations('results');
  const locale = useLocale();
  const { xReversed, yOrientation } = useAxisProps();
  const data = costPerAsset.map((d) => ({
    name: locale === 'ar' ? d.labelAr : d.labelEn,
    traditional: d.traditional,
    sana: d.sana
  }));

  return (
    <ChartCard title={t('cost.title')} caption={t('cost.caption')}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="hsl(240 12% 18%)" />
          <XAxis dataKey="name" reversed={xReversed} tick={{ fontSize: 11, fill: 'hsl(240 8% 66%)' }} axisLine={false} tickLine={false} />
          <YAxis orientation={yOrientation} tick={{ fontSize: 11, fill: 'hsl(240 8% 66%)' }} axisLine={false} tickLine={false} width={38} />
          <Tooltip {...tooltipStyle} cursor={{ fill: 'hsl(240 12% 14% / 0.5)' }} />
          <Legend formatter={(v) => t(`legend.${v}`)} wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="traditional" fill={COLORS.traditional} radius={[4, 4, 0, 0]} />
          <Bar dataKey="sana" fill={COLORS.sana} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function TurnaroundChart() {
  const t = useTranslations('results');
  const locale = useLocale();
  const { xReversed, yOrientation } = useAxisProps();
  const data = turnaround.map((d) => ({
    name: locale === 'ar' ? d.labelAr : d.labelEn,
    traditional: d.traditional,
    sana: d.sana
  }));

  return (
    <ChartCard title={t('turnaround.title')} caption={t('turnaround.caption')}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="hsl(240 12% 18%)" />
          <XAxis dataKey="name" reversed={xReversed} tick={{ fontSize: 11, fill: 'hsl(240 8% 66%)' }} axisLine={false} tickLine={false} />
          <YAxis orientation={yOrientation} tick={{ fontSize: 11, fill: 'hsl(240 8% 66%)' }} axisLine={false} tickLine={false} width={28} />
          <Tooltip {...tooltipStyle} cursor={{ fill: 'hsl(240 12% 14% / 0.5)' }} />
          <Legend formatter={(v) => t(`legend.${v}`)} wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="traditional" fill={COLORS.traditional} radius={[4, 4, 0, 0]} />
          <Bar dataKey="sana" fill={COLORS.sana} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function EngagementChart() {
  const t = useTranslations('results');
  const locale = useLocale();
  const { xReversed, yOrientation } = useAxisProps();
  const data = engagementLift.map((d) => ({
    name: locale === 'ar' ? d.labelAr : d.labelEn,
    before: d.before,
    after: d.after
  }));

  return (
    <ChartCard title={t('engagement.title')} caption={t('engagement.caption')}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="hsl(240 12% 18%)" />
          <XAxis dataKey="name" reversed={xReversed} tick={{ fontSize: 11, fill: 'hsl(240 8% 66%)' }} axisLine={false} tickLine={false} />
          <YAxis orientation={yOrientation} tick={{ fontSize: 11, fill: 'hsl(240 8% 66%)' }} axisLine={false} tickLine={false} width={28} unit="%" />
          <Tooltip {...tooltipStyle} cursor={{ fill: 'hsl(240 12% 14% / 0.5)' }} />
          <Bar dataKey="after" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS.accent} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
