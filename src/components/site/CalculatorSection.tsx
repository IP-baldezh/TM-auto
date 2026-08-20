import type { CalculatorView, SectionView } from '@/lib/content';
import { Container, Section, SectionHeading } from '@/components/site/Section';
import { Calculator } from '@/components/calculator/Calculator';

export function CalculatorSection({
  section,
  calculator,
  privacyUrl,
  consentUrl,
}: {
  section: SectionView;
  calculator: CalculatorView;
  privacyUrl: string;
  consentUrl: string;
}) {
  if (!section.enabled || !calculator.enabled || calculator.steps.length === 0) return null;

  return (
    <Section id="calculator" tone="paper" className="pt-8 md:py-28 lg:py-32">
      <Container>
        <SectionHeading
          title={section.title ?? calculator.title}
          subtitle="Пройдите опрос, чтобы узнать точную стоимость пригона"
        />

        <div data-reveal="up">
          <Calculator config={calculator} privacyUrl={privacyUrl} consentUrl={consentUrl} />
        </div>
      </Container>
    </Section>
  );
}
