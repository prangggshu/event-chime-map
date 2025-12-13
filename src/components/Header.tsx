import { CalendarDays, MapPin, Sparkles, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onViewChange: (view: 'grid' | 'calendar') => void;
  currentView: 'grid' | 'calendar';
}

const Header = ({ onViewChange, currentView }: HeaderProps) => {
  const isSociety =
    typeof window !== 'undefined' &&
    localStorage.getItem('auth:role') === 'society';

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg font-playfair">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl
                            bg-gradient-to-br from-orange-500 to-amber-500">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-wide text-foreground">
                Events<span className="text-orange-600">Everywhere</span>
              </h1>
              <p className="text-xs font-normal text-muted-foreground">
                Campus Event Navigator
              </p>
            </div>
          </div>

          {/* NAV */}
          <nav className="hidden items-center gap-2 md:flex">
            <Button
              variant={currentView === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('grid')}
              className={`gap-2 font-semibold tracking-wide ${
                currentView === 'grid'
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : ''
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Events
            </Button>

            <Button
              variant={currentView === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('calendar')}
              className={`gap-2 font-semibold tracking-wide ${
                currentView === 'calendar'
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : ''
              }`}
            >
              <CalendarDays className="h-4 w-4" />
              Calendar
            </Button>
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold tracking-wide"
            >
              <Link to="/login" className="gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            </Button>

            <Button
              asChild
              size="sm"
              className="hidden md:flex bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-90 font-semibold tracking-wide"
            >
              <Link to={isSociety ? '/manage-events' : '/login?role=society'}>
                Post Event
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
