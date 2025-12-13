import { Search } from "lucide-react";
import { Input } from "./ui/input";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const HeroSection = ({ searchQuery, onSearchChange }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden py-6 md:py-8 font-playfair">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">

          {/* Events count pill */}
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-1.5 text-sm font-semibold text-orange-600">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
            </span>
            6 Events This Month
          </div>
          <br />
          <br />
          {/* Heading */}
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Discover What’s{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Happening
            </span>{" "}
            on Campus
          </h1>

          {/* Subtitle */}
          <p className="mb-4 text-base text-muted-foreground">
            Find workshops, hackathons, fests, and more happening around you.
          </p>

          {/* Search */}
          <div className="relative mx-auto mt-2 max-w-lg">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events, societies, venues..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="
                h-12
                rounded-xl
                border-2
                border-border
                bg-card
                pl-12
                pr-4
                text-sm
                shadow-sm
                transition-all
                placeholder:text-muted-foreground
                focus:border-orange-500
                focus:ring-2
                focus:ring-orange-500/20
              "
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
