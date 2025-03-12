import { cn } from "@/lib/utils"; // shadcn utility for className merging
import { Button } from "@/components/ui/button"; // shadcn Button component
import { ArrowRight } from "lucide-react"; // Icon from lucide-react

// Image + Text Section Component (Reusable)
export const ImageTextSection = ({
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
  <section className={cn("py-8 sm:py-16", bgColor)}>
    <div className="container mx-auto px-4">
      <div
        className={cn(
          "flex flex-col md:flex-row items-center gap-12",
          imageSide === "right" && "md:flex-row-reverse"
        )}
      >
        <div className="flex-1 h-48 sm:h-64 bg-accent/20 rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground">[Placeholder: {imageDescription}]</span>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl text-primary font-semibold text-foreground mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground">{description}</p>
          <Button variant="outline" className="mt-4 text-primary p-0 rounded-full bg-white text-primary hover:bg-accent hover:text-white border-primary border-1">
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </section>
);


