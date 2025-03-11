import { Button } from "@/components/ui/button"; // shadcn Button component
import { cn } from "@/lib/utils"; // shadcn utility for className merging
import { ArrowRight } from "lucide-react"; // Icon from lucide-react
import { useEffect, useState } from "react";
import { FaStar, FaHeart, FaRocket, FaBolt } from "react-icons/fa";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";


// Landing Section Component
function LandingSection() {
  const icons = [
    <FaStar className="w-16 h-16 text-yellow-500" />,
    <FaHeart className="w-16 h-16 text-red-500" />,
    <FaRocket className="w-16 h-16 text-blue-500" />,
    <FaBolt className="w-16 h-16 text-purple-500" />,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Cycle through icons every 2 seconds to match animation duration
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % icons.length);
    }, 2000); // 2-second interval
    return () => clearInterval(interval);
  }, [icons.length]);

  // Previous index for the outgoing enclosure
  const prevIndex = (currentIndex - 1 + icons.length) % icons.length;

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <div className="text-center z-10 max-w-4xl mx-auto px-4">
        {/* Icon wrapper with background div for depth */}
        <div className="relative h-24 mb-6 flex justify-center">
          {/* Static background enclosure for depth */}
          <div className="absolute w-20 h-20 bg-muted/50 rounded-full shadow-md transform translate-y-2 scale-90 z-0"></div>
          {/* Animated enclosures */}
          {icons.map((icon, index) => (
            <div
              key={index}
              className={`absolute h-20 w-20 bg-muted rounded-full overflow-hidden left-1/2 -translate-x-1/2 transition-all ease-in-out z-10 ${
                index === currentIndex
                  ? "animate-slide-up animation-delay-0" // Current: starts now
                  : index === prevIndex
                  ? "animate-slide-up animation-delay-[-0.5s]" // Previous: halfway done
                  : "opacity-0 translate-y-[50%] hidden" // Fully hidden
              }`}
            >
              {/* Centered icon */}
              <div className="absolute w-16 h-16 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                {icon}
              </div>
            </div>
          ))}
        </div>
        {/* Header content */}
        <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight">
          Craft Icon Packs with <span className="text-primary">InkBlink</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Generate, style, and edit cohesive icon sets using InkBucks. Your creativity, our tools.
        </p>
        <div className="flex justify-center gap-3">
          <Button
            className="mt-6 bg-white text-primary hover:bg-accent hover:text-white transition-all duration-300 rounded-full"
            size="lg"
            variant="outline"
          >
            Join for free <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            className="mt-6 bg-primary text-white hover:bg-accent transition-all duration-300 rounded-full"
            size="lg"
          >
            See our plans <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

// Grid Section Component
const GridSection = () => {
  // Initialize Embla Carousel with loop enabled
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Update selected index and scroll snaps when carousel changes
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());
  }, [emblaApi]);

  // Initialize and listen to carousel changes
  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 1000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="py-16 mx-auto bg-primary rounded-lg">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-4xl font-semibold text-center text-white mb-12">
          Explore Icon Packs
        </h2>

        {/* Carousel Container */}
        <div className="relative">
          {/* Embla Viewport */}
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {["Minimalist", "Bold", "Hand-Drawn", "Tech", "Animal", "Tools"].map((style, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0 px-3"
                >
                  {/* Card */}
                  <div className="group relative bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-border hover:border-primary">
                    <div className="h-40 bg-accent/20 rounded-md mb-4 flex items-center justify-center">
                      <span className="text-muted-foreground">
                        [Placeholder: Sample {style} icon pack preview]
                      </span>
                    </div>
                    <h3 className="text-xl font-medium text-card-foreground">
                      {style} Icons
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Starting at 50 InkBucks
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 w-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Customize
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation and Tracer */}
          <div className="flex justify-center items-center mt-6 gap-4">
            {/* Previous Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-foreground"
              onClick={scrollPrev}
              aria-label="Previous slide"
            >
              ←
            </Button>

            {/* Pagination Dots */}
            <div className="flex gap-2">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === selectedIndex
                      ? "bg-white"
                      : "bg-white/20 hover:bg-accent/40"
                  }`}
                  onClick={() => emblaApi && emblaApi.scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-foreground"
              onClick={scrollNext}
              aria-label="Next slide"
            >
              →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

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
