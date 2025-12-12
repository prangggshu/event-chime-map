import { Search, UserRound, Building2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const HeroSection = ({ searchQuery, onSearchChange }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden gradient-hero py-16 md:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary animate-fade-up">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            8 Events This Week
          </div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Discover What's{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Happening
            </span>{' '}
            on Campus
          </h1>

          <p className="mb-8 text-lg text-muted-foreground animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Never miss a seminar, workshop, hackathon, or cultural event again. 
            Your unified portal to all campus activities.
          </p>

          <div className="relative mx-auto max-w-xl animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events, societies, venues..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-14 rounded-2xl border-2 border-border bg-card pl-12 pr-4 text-base shadow-card transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:shadow-card-hover"
            />
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Button asChild variant="gradient" size="lg" className="gap-2">
              <Link to="/login?role=student">
                <UserRound className="h-4 w-4" />
                Student login
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 border-border">
              <Link to="/login?role=society">
                <Building2 className="h-4 w-4" />
                Society login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
