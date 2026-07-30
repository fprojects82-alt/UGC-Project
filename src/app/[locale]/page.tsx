import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/home/hero';
import { TrustBar } from '@/components/home/trust-bar';
import { ProblemFraming } from '@/components/home/problem-framing';
import { ServicesGrid } from '@/components/home/services-grid';
import { HowItWorks } from '@/components/home/how-it-works';
import { ResultsSection } from '@/components/home/results-section';
import { InfluencerShowcase } from '@/components/home/influencer-showcase';
import { Testimonials } from '@/components/home/testimonials';
import { Pricing } from '@/components/home/pricing';
import { Faq } from '@/components/home/faq';
import { FinalCta } from '@/components/home/final-cta';
import { brand } from '@/brand/tokens';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    url: `https://${brand.domain}`,
    sameAs: Object.values(brand.social),
    description: 'AI-generated marketing content agency for the Middle East.'
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <Hero />
      <TrustBar />
      <ProblemFraming />
      <ServicesGrid />
      <HowItWorks />
      <ResultsSection />
      <InfluencerShowcase />
      <Testimonials />
      <Pricing />
      <Faq />
      <FinalCta />
    </>
  );
}
