import { CalendarDays, MapPin, Sparkles, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onViewChange: (view: 'grid' | 'calendar') => void;
  currentView: 'grid' | 'calendar';
}

const Header = ({ onViewChange, currentView }: HeaderProps) => {
  const isSociety = typeof window !== 'undefined' && localStorage.getItem('auth:role') === 'society';

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Events Everywhere</h1>
              <p className="text-xs text-muted-foreground">Campus Event Navigator</p>
            </div>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            <Button
              variant={currentView === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('grid')}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Events
            </Button>
            <Button
              variant={currentView === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('calendar')}
              className="gap-2"
            >
              <CalendarDays className="h-4 w-4" />
              Calendar
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/login" className="gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            </Button>
            <Button asChild variant="gradient" size="sm" className="hidden md:flex">
              <Link to={isSociety ? '/manage-events' : '/login?role=society'}>Post Event</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
