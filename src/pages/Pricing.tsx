// PricingCard.tsx
import { Button } from '@/components/ui/button';
import Accordion, { AccordionItem } from '@/components/accordion';
import { ImageTextSection } from '@/components/ImageTextSection';

interface Plan {
  type: 'one-time' | 'subscription';
  ib: number;
  features: [string, boolean][];
  price: number;
}

interface PricingCardProps {
  plan: Plan;
}

export function PricingCard({ plan }: PricingCardProps) {
  const isSubscription = plan.type === 'subscription';
  const description = isSubscription
    ? `${plan.ib} IB every month`
    : `${plan.ib} IB`;
  const priceText = isSubscription ? `$${plan.price}/month` : `$${plan.price}`;

  return (
    <div
      className={`border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow ${
        isSubscription ? 'bg-primary text-white' : 'bg-muted text-primary'
      }`}
    >
      {isSubscription && (
        <div className="mb-2">
          <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
            Recommended
          </span>
        </div>
      )}
      <h2
        className={`text-m font-semibold mb-2 ${
          isSubscription ? 'text-white' : 'text-primary/70'
        }`}
      >
        {description}
      </h2>
      <p className="text-3xl font-bold mb-6">{priceText}</p>
      <ul className="text-left mb-6 space-y-2">
        {plan.features.map(([feature, included], index) => (
          <li key={index} className="flex items-center">
            <span
              className={`mr-2 ${included ? 'text-green-500' : 'text-gray-400'}`}
            >
              {included ? '✓' : '✗'}
            </span>
            <span
              className={
                isSubscription
                  ? 'text-white font-medium'
                  : included
                  ? 'text-primary/70 font-medium'
                  : 'text-primary/40 line-through decoration-1 decoration-primary'
              }
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>
      <Button
        variant="outline"
        className={`w-full rounded-full border-primary border-1 hover:border-1 ${
          isSubscription
            ? 'bg-white text-primary hover:bg-accent hover:text-white'
            : 'bg-primary text-white hover:bg-accent hover:text-white'
        }`}
      >
        {isSubscription ? 'Subscribe Now' : 'Buy Now'}
      </Button>
    </div>
  );
}

function PricingSection() {
  const plans: Plan[] = [
    {
      type: 'one-time',
      ib: 50,
      price: 5,
      features: [
        ['Free icon storage', true],
        ['Commercial License (CCO)', true],
        ['Export .png', true],
        ['Consistent style in packs', true],
        ['On the spot icon editing features', true],
        ['Export .svg', false],
      ],
    },
    {
      type: 'one-time',
      ib: 120,
      price: 10,
      features: [
        ['Free icon storage', true],
        ['Commercial License (CCO)', true],
        ['Export .png', true],
        ['Consistent style in packs', true],
        ['On the spot icon editing features', true],
        ['Export .svg', true],
      ],
    },
    {
      type: 'one-time',
      ib: 250,
      price: 20,
      features: [
        ['Free icon storage', true],
        ['Commercial License (CCO)', true],
        ['Export .png', true],
        ['Consistent style in packs', true],
        ['On the spot icon editing features', true],
        ['Export .svg', true],
      ],
    },
    {
      type: 'subscription',
      ib: 200,
      price: 15,
      features: [
        ['Free icon storage', true],
        ['Commercial License (CCO)', true],
        ['Export .png', true],
        ['Consistent style in packs', true],
        ['On the spot icon editing features', true],
        ['Export .svg', true],
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {plans.map((plan, index) => (
        <PricingCard key={index} plan={plan} />
      ))}
    </div>
  );
}

// UsageSection.tsx
function UsageSection() {
  return (
    <div className="my-12">
      <h2 className="text-3xl font-bold mb-6 text-center">
        What Can You Do with Inkbucks?
      </h2>
      <div className="space-y-6">
        <ImageTextSection
          //image="/images/generate-icons.png" // Placeholder image path
          title="Generate Icons"
          description="Create unique icons tailored to your needs. Each generation costs 1 IB."
          imageSide="right"
          imageDescription="Generate icons"
        />
        <ImageTextSection
          //image="/images/edit-icons.png" // Placeholder image path
          title="Edit Icons"
          description="Modify existing icons to fit your style. Adding elements costs 1 IB, while cropping and removing are free."
          imageSide="left"
          imageDescription="Edit icons"
        />
        <ImageTextSection
          //image="/images/create-packs.png" // Placeholder image path
          title="Create Packs"
          description="Organize your icons into packs with a consistent style. Creating packs is free."
          imageSide="right"
          imageDescription="Create packs"
        />
      </div>
    </div>
  );
}

// FAQSection.tsx
function FAQSection() {
  const faqs: AccordionItem[] = [
    {
      header: 'What is an InkBuck (IB)?',
      content:
        'Inkbucks are the currency used within our platform to generate and edit icons. You can purchase them in bundles or through a monthly subscription.',
    },
    {
      header: 'How do I use Inkbucks?',
      content:
        'You can use Inkbucks to generate new icons or edit existing ones. Each generation or edit (adding elements) costs 1 IB.',
    },
    {
      header: 'Are there any free actions?',
      content:
        'Yes, cropping and removing elements from icons are free. Only adding new elements costs 1 IB.',
    },
    {
      header: 'What is an icon pack?',
      content:
        'An icon pack is a collection of icons that share the same style. Creating a pack is free, and all icons within a pack will maintain consistency in design.',
    },
    {
      header: 'Can I cancel my subscription?',
      content:
        'Yes, you can cancel your subscription at any time. Your Inkbucks will remain available until they are used.',
    },
    {
      header: 'Do Inkbucks expire?',
      content: 'No, Inkbucks do not expire. You can use them whenever you need.',
    },
  ];

  return (
    <div>
      <h2 className="text-3xl text-primary font-bold mb-8">Frequently Asked Questions</h2>
      <Accordion items={faqs} />
    </div>
  );
}

export default function Pricing() {
  return (
    <div className="flex flex-col container mx-auto px-4 sm:py-16 gap-4 sm:gap-16 mt-30">
      <h1 className="text-primary text-4xl font-bold text-center mb-8 sm:mb-32">
        Pricing
      </h1>
      <PricingSection />
      <UsageSection />
      <FAQSection />
    </div>
  );
}
