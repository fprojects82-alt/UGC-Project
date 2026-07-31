import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/page-header';

/** Renders a legal document from messages: legal.<doc>.{title,intro?,body[]}. */
export async function LegalArticle({ locale, doc }: { locale: string; doc: 'privacy' | 'terms' | 'disclosure' }) {
  const t = await getTranslations({ locale, namespace: `legal.${doc}` });
  const tRoot = await getTranslations({ locale, namespace: 'legal' });
  const body = t.raw('body') as [string, string][];
  const intro = t.has('intro') ? t('intro') : null;

  return (
    <>
      <PageHeader eyebrow={`${tRoot('updated')}: 2026`} title={t('title')} />
      <article className="container max-w-3xl py-16">
        {intro && <p className="mb-10 text-lg text-muted-foreground">{intro}</p>}
        <div className="space-y-8">
          {body.map(([heading, text]) => (
            <section key={heading}>
              <h2 className="mb-2 font-display text-xl font-bold">{heading}</h2>
              <p className="leading-relaxed text-muted-foreground">{text}</p>
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
