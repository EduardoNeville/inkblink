import { Button } from "@/components/ui/button"; // shadcn Button component
import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { ImageTextSection } from "@/components/ImageTextSection";
import {
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaChevronDown,
  FaImage,
  FaVideo,
} from "react-icons/fa";
import { InkBlobs } from "@/components/InkBlobs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Landing Section Component
const platforms = [
  { id: "twitter", name: "Twitter", icon: <FaTwitter className="text-blue-500" /> },
  { id: "instagram", name: "Instagram", icon: <FaInstagram className="text-pink-500" /> },
  { id: "linkedin", name: "LinkedIn", icon: <FaLinkedin className="text-blue-700" /> },
];

function PlatformSelect({
  onSelect,
}: {
  onSelect?: (platform: typeof platforms[0]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(platforms[0]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle selection
  const handleSelect = (platform: typeof platforms[0]) => {
    setSelected(platform);
    onSelect?.(platform);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-xs" ref={wrapperRef}>
      {/* Trigger */}
      <button
        className="w-full bg-primary/30 text-primary border border-primary/20 rounded-full px-4 py-2 flex items-center justify-between shadow-md hover:border-primary transition"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          {selected.icon}
          <span>{selected.name}</span>
        </span>
        <svg
          className={`w-4 h-4 ml-2 transform transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown list */}
      {isOpen && (
        <ul
          className="absolute z-50 mt-2 w-full bg-white border border-primary/10 rounded-md shadow-md max-h-[200px] overflow-auto"
          role="listbox"
        >
          {platforms.map((platform) => (
            <li
              key={platform.id}
              onClick={() => handleSelect(platform)}
              role="option"
              aria-selected={selected.id === platform.id}
              className={`px-4 py-2 flex items-center gap-2 hover:bg-primary/10 cursor-pointer ${
                selected.id === platform.id ? "bg-primary/10" : ""
              }`}
            >
              {platform.icon}
              <span>{platform.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const LandingSection = () => {
  const [text, setText] = useState("");

  return (
    <section className="relative flex justify-center items-center min-h-screen px-4 bg-white">
      {/* Blurred Background Image */}
      <InkBlobs />

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-2xl w-full">
        {/* Title */}
        <h1 className="text-5xl sm:text-6xl font-bold drop-shadow-md text-primary">
          InkBlink
        </h1>
        <p className="text-xl sm:text-2xl text-primary/90 font-light">
          Turn posts into trends
        </p>

        {/* Prompt Bar */}
        <div className="sticky flex flex-col sm:flex-row items-stretch w-full gap-3 mt-8">
          {/* Social Media Bubble */}
          <PlatformSelect />

          {/* Input Bubble */}
          <div className="flex w-full bg-primary/30 text-black rounded-full px-4 py-2 shadow-md items-center gap-3">
            {/* Attach icon */}
            <div className="flex gap-2 text-primary cursor-pointer">
              <FaImage className="hover:text-primary/80" />
              <FaVideo className="hover:text-primary/80" />
            </div>
            {/* Text input */}
            <input
              type="text"
              placeholder="Write your best post..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-grow outline-none bg-transparent text-sm placeholder:text-primary/80"
            />
            {/* Post button */}
            <Button
              className="bg-primary text-white rounded-full px-4 py-1 text-sm hover:bg-primary/80 transition"
              size="sm"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

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
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12">
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
                    <h3 className="text-base font-bold text-card-foreground text-primary">
                      {style} Icons
                    </h3>
                    <p className="text-sm text-primary/50 font-display">
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
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Style Your Way</h2>
        <p className="text-base sm:text-lg font-display max-w-2xl mx-auto">
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
