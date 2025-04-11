import { Button } from "@/components/ui/button"; // shadcn Button component
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import useEmblaCarousel from "embla-carousel-react";
import {
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaImage,
} from "react-icons/fa";
import { InkBlobs } from "@/components/InkBlobs";
import { Waypoints } from "lucide-react";
import TweetCard from "@/components/TweetCard";

// Landing Section Component
type Platform = {
  id: string;
  name: string;
  icon: React.ReactNode;
};

const platforms: Platform[] = [
  {
    id: "twitter",
    name: "Twitter",
    icon: <FaTwitter className="text-primary bg-transparent" />,
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: <FaInstagram className="text-primary bg-transparent" />,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: <FaLinkedin className="text-primary bg-transparent" />,
  },
];

function PlatformSelectMulti({
  onChange,
}: {
  onChange?: (selected: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle selection
  const togglePlatform = (id: string) => {
    setSelected((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      onChange?.(updated);
      return updated;
    });
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get selected platform details
  const selectedPlatforms = platforms.filter((p) => selected.includes(p.id));

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center px-2 py-1 min-h-[40px] rounded-full border border-primary/30 bg-primary/10 hover:border-primary transition-all"
      >
        {selected.length === 0 ? (
          <span className="text-sm text-primary"><Waypoints /></span>
        ) : (
          <div className="flex">
            {selectedPlatforms.map((platform) => (
              <div
                key={platform.id}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-blur"
              >
                {platform.icon}
              </div>
            ))}
          </div>
        )}
        <svg
          className={`w-4 h-4 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 bg-primary/10 rounded-md shadow-lg z-50 border border-primary/20">
          <div>
            {platforms.map((platform) => {
              const isChecked = selected.includes(platform.id);
              return (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm text-primary hover:bg-primary/10 transition ${
                    isChecked ? "bg-primary/20" : ""
                  }`}
                >
                  <span className="mr-2">{platform.icon}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function LandingSection() {
  const [postText, setPostText] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const user = getAuth().currentUser;

  const handlePost = () => {
    const prompt = encodeURIComponent(postText);
    const imageParam = imageFile ? encodeURIComponent(imageFile.name) : "";
    console.log(platforms)

    if (!user) {
      navigate(`/signup?prompt=${prompt}&image=${imageParam}&platforms=${platforms}`);
    } else {
      navigate(`/create?prompt=${prompt}&image=${imageParam}&platforms=${platforms}`);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-white overflow-hidden">
      <InkBlobs /> 
      <div className="w-full max-w-2xl flex flex-col space-y-4 text-center">
        <h1 className="text-4xl font-bold text-primary drop-shadow">InkBlink</h1>
        <p className="text-muted-foreground text-lg">Turn posts into trends</p>

        {/* Prompt Row */}
        <div className="flex w-full gap-3 items-center justify-center">
          {/* Platform Select */}
          <PlatformSelectMulti onChange={setPlatforms} />

          {/* Prompt Input */}
          <div className="flex flex-grow bg-primary/10 rounded-full px-4 py-2 items-center gap-3 transition-all border border-primary/20">
            <div className="flex gap-2 text-primary cursor-pointer">
              {/* Image Upload */}
              <label className="cursor-pointer">
                <FaImage className="hover:text-primary/80" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
            <input
              type="text"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Write your best post..."
              className="bg-transparent flex-grow outline-none text-sm text-primary placeholder:text-primary/50"
            />
            <button
              className="bg-primary text-white px-4 py-1 rounded-full text-sm hover:bg-primary/80 transition"
              onClick={handlePost}
            >
              Post
            </button>
          </div>
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


//      <ImageTextSection
//        title="Generate with Ease"
//        description="Pick a base style and let InkBlink create a cohesive icon pack in seconds."
//        imageSide="left"
//        imageDescription="Screenshot of icon generation interface"
//      />
//      <ImageTextSection
//        title="Edit Like a Pro"
//        description="Fine-tune your icons with our intuitive editor. Spend InkBucks for premium features."
//        imageSide="right"
//        imageDescription="Close-up of icon editing tools"
//        bgColor="bg-muted"
//      />

// Main Home Component
export default function Home() {
  return (
    <main className="flex flex-col min-h-screen max-w-7xl mx-auto gap-8 sm:gap-16">
      <LandingSection />
      <GridSection />
      <TweetCard />
    </main>
  );
}
