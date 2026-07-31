export function PageHeader({
  eyebrow,
  title,
  subtitle
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b border-border bg-card/20">
      <div className="container py-16 md:py-20">
        {eyebrow && (
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">{eyebrow}</p>
        )}
        <h1 className="max-w-3xl font-display text-3xl font-bold tracking-tight md:text-5xl">
          {title}
        </h1>
        {subtitle && <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">{subtitle}</p>}
      </div>
    </section>
  );
}
