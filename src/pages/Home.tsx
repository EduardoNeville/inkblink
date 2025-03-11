import { Button } from "@/components/ui/button"; // shadcn Button component
import { cn } from "@/lib/utils"; // shadcn utility for className merging
import { ArrowRight } from "lucide-react"; // Icon from lucide-react

// Landing Section Component
const LandingSection = () => (
  <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
    {/* Blueprint Background Pattern */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--primary)_0%,transparent_70%)] opacity-10 animate-pulse" />
    <div className="absolute inset-0 bg-[url('/blueprint-grid.png')] opacity-5" /> {/* Placeholder for a subtle grid texture */}
    <div className="text-center z-10 max-w-4xl mx-auto px-4">
      <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight">
        Craft Icon Packs with <span className="text-primary">InkBlink</span>
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Generate, style, and edit cohesive icon sets using InkBucks. Your creativity, our tools.
      </p>
      <div className="flex justify-center gap-3">
        <Button className="mt-6 text-primary transition-all duration-300 rounded-full" size="lg" variant="outline">
          Join for free <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <Button className="mt-6 bg-secondary text-secondary-foreground hover:bg-accent transition-all duration-300 rounded-full" size="lg">
          See our plans <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  </section>
);

// Grid Section Component
const GridSection = () => (
  <section className="py-16 mx-auto bg-muted rounded-lg">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-semibold text-center text-foreground mb-12">
        Explore Icon Packs
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {["Minimalist", "Bold", "Hand-Drawn", "Tech"].map((style, index) => (
          <div
            key={index}
            className="group relative bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-border hover:border-primary"
          >
            <div className="h-40 bg-accent/20 rounded-md mb-4 flex items-center justify-center">
              <span className="text-muted-foreground">[Placeholder: Sample {style} icon pack preview]</span>
            </div>
            <h3 className="text-xl font-medium text-card-foreground">{style} Icons</h3>
            <p className="text-sm text-muted-foreground mt-2">Starting at 50 InkBucks</p>
            <Button
              variant="outline"
              className="mt-4 w-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Customize
            </Button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Image + Text Section Component (Reusable)
const ImageTextSection = ({
  title,
  description,
  imageSide = "left",
  imageDescription,
  bgColor = "bg-background",
}: {
  title: string;
  description: string;
  imageSide?: "left" | "right";
  imageDescription: string;
  bgColor?: string;
}) => (
  <section className={cn("py-16", bgColor)}>
    <div className="container mx-auto px-4">
      <div
        className={cn(
          "flex flex-col md:flex-row items-center gap-12",
          imageSide === "right" && "md:flex-row-reverse"
        )}
      >
        <div className="flex-1 h-64 bg-accent/20 rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground">[Placeholder: {imageDescription}]</span>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-semibold text-foreground mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground">{description}</p>
          <Button variant="link" className="mt-4 text-primary p-0">
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </section>
);

// Angled Image + Text Section Component
const AngledImageTextSection = () => (
  <section className="py-16 bg-gradient-to-br from-primary to-secondary text-primary-foreground relative">
    <div className="container mx-auto px-4">
      <div className="relative z-10 text-center">
        <h2 className="text-4xl font-bold mb-6">Style Your Way</h2>
        <p className="text-lg max-w-2xl mx-auto">
          Use InkBucks to tweak colors, sizes, and effects. Make every icon pack uniquely yours.
        </p>
      </div>
      <div className="mt-12 h-80 bg-accent/20 rounded-lg transform -skew-y-6 flex items-center justify-center">
        <span className="text-primary-foreground transform skew-y-6">
          [Placeholder: Animated demo of icon styling process]
        </span>
      </div>
    </div>
    <div className="absolute inset-0 bg-[url('/blueprint-dots.png')] opacity-10" /> {/* Subtle dot pattern */}
  </section>
);

// Main Home Component
export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <LandingSection />
      <GridSection />
      <ImageTextSection
        title="Generate with Ease"
        description="Pick a base style and let InkBlink create a cohesive icon pack in seconds."
        imageSide="left"
        imageDescription="Screenshot of icon generation interface"
      />
      <AngledImageTextSection />
      <ImageTextSection
        title="Edit Like a Pro"
        description="Fine-tune your icons with our intuitive editor. Spend InkBucks for premium features."
        imageSide="right"
        imageDescription="Close-up of icon editing tools"
        bgColor="bg-muted"
      />
    </main>
  );
}
