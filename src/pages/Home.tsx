import { Button } from "@/components/ui/button"; // shadcn Button component
import { ArrowRight } from "lucide-react"; // Icon from lucide-react
import { useEffect, useRef, useState } from "react";
import { FaStar, FaHeart, FaRocket, FaBolt } from "react-icons/fa";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { ImageTextSection } from "@/components/ImageTextSection";


// Landing Section Component
function LandingSection() {
  const icons = [
    <FaStar className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500" />,
    <FaHeart className="w-12 h-12 sm:w-16 sm:h-16 text-red-500" />,
    <FaRocket className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500" />,
    <FaBolt className="w-12 h-12 sm:w-16 sm:h-16 text-purple-500" />,
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
    <section className="relative flex items-center justify-center bg-background overflow-hidden">
      <div className="text-center z-10 max-w-4xl mx-auto px-4">
        {/* Icon wrapper with background div for depth */}
        <div className="relative h-20 sm:h-24 mb-4 sm:mb-6 flex justify-center">
          {/* Static background enclosure for depth */}
          <div className="absolute w-20 h-20 bg-muted/50 rounded-xl shadow-md transform translate-y-4 scale-90 z-0"></div>
          {icons.map((icon, index) => (
            <div
              key={index}
              className={`absolute w-21 h-21 bg-muted rounded-xl overflow-hidden left-1/2 -translate-x-1/2 transition-all ease-in-out z-10 ${
                index === currentIndex
                  ? "animate-slide-up animation-delay-0" // Current: starts now
                  : index === prevIndex
                  ? "animate-slide-up animation-delay-[-0.5s]" // Previous: halfway done
                  : "opacity-0 translate-y-[50%] hidden" // Fully hidden
              }`}
            >
              {/* Centered icon */}
              <div className="absolute w-12 h-12 sm:w-16 sm:h-16 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                {icon}
              </div>
            </div>
          ))}
        </div>
        {/* Header content */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground tracking-tight">
          Craft Icon Packs with <span className="text-primary">InkBlink</span>
        </h1>
        <p className="my-4 text-base sm:text-lg text-muted-foreground">
          Generate, style, and edit cohesive icon sets using InkBucks. Your creativity, our tools.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button
            className="w-full sm:w-auto bg-white text-primary hover:bg-accent hover:text-white transition-all duration-300 rounded-full border-primary border-1"
            size="lg"
            variant="outline"
          >
            Join for free <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            className="w-full sm:w-auto bg-primary text-white hover:bg-accent transition-all duration-300 rounded-full border-primary border-1"
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayInterval = useRef<NodeJS.Timeout | null>(null); // Store autoplay interval
  const resumeTimeout = useRef<NodeJS.Timeout | null>(null); // Store resume timeout

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      pauseAndResume(); // Pause and reset timer on interaction
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      pauseAndResume(); // Pause and reset timer on interaction
    }
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

  // Function to start or restart autoplay
  const startAutoplay = useCallback(() => {
    if (autoplayInterval.current) clearInterval(autoplayInterval.current);
    autoplayInterval.current = setInterval(() => {
      if (emblaApi && !isPaused) emblaApi.scrollNext();
    }, 3000); // 3-second interval
  }, [emblaApi, isPaused]);

  // Function to pause and resume with timer reset
  const pauseAndResume = useCallback(() => {
    setIsPaused(true);
    if (autoplayInterval.current) clearInterval(autoplayInterval.current);
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current); // Clear existing timeout

    resumeTimeout.current = setTimeout(() => {
      setIsPaused(false);
      startAutoplay();
    }, 5000); // 5-second delay
  }, [startAutoplay]);

  // Start autoplay on mount and cleanup on unmount
  useEffect(() => {
    if (!emblaApi) return;
    startAutoplay();
    return () => {
      if (autoplayInterval.current) clearInterval(autoplayInterval.current);
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    };
  }, [emblaApi, startAutoplay]);

  // Handle interaction with the carousel container
  const handleCarouselInteraction = useCallback(() => {
    pauseAndResume();
  }, [pauseAndResume]);

  return (
    <section className="py-8 sm:py-16 mx-auto bg-primary rounded-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-white mb-12">
          Explore Icon Packs
        </h2>
        <div className="relative">
          <div
            ref={emblaRef}
            className="overflow-hidden"
            onClick={handleCarouselInteraction} // Pause and reset on click
          >
            <div className="flex">
              {["Minimalist", "Bold", "Hand-Drawn", "Tech", "Animal", "Tools"].map((style, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0 px-2 sm:px-3"
                >
                  <div className="group relative bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-border hover:border-primary w-full">
                    <div className="h-40 bg-accent/20 rounded-md mb-4 flex items-center justify-center">
                      <span className="text-muted-foreground">
                        [Placeholder: Sample {style} icon pack preview]
                      </span>
                    </div>
                    <h3 className="text-base font-medium text-card-foreground">
                      {style} Icons
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Starting at 50 InkBucks
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 w-full bg-white text-primary hover:bg-accent hover:text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full border-primary border-1"
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
            <Button
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-foreground"
              onClick={scrollPrev}
              aria-label="Previous slide"
            >
              ←
            </Button>

            <div className="flex gap-2">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === selectedIndex
                      ? "bg-white"
                      : "bg-white/20 hover:bg-accent/40"
                  }`}
                  onClick={() => {
                    if (emblaApi) {
                      emblaApi.scrollTo(index);
                      pauseAndResume(); // Pause and reset on dot click
                    }
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

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

// Angled Image + Text Section Component
const AngledImageTextSection = () => (
  <section className="py-8 sm:py-16 bg-gradient-to-br from-primary to-secondary text-primary-foreground relative rounded-lg overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Style Your Way</h2>
        <p className="text-base sm:text-lg max-w-2xl mx-auto">
          Use InkBucks to tweak colors, sizes, and effects. Make every icon pack uniquely yours.
        </p>
      </div>
      <div className="mt-12 h-64 sm:h-80 bg-accent/20 rounded-lg transform -skew-y-6 flex items-center justify-center">
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
    <main className="flex flex-col min-h-screen max-w-7xl mx-auto gap-8 sm:gap-16">
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
