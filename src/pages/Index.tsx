import { useEffect, useMemo, useState, useCallback } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategoryFilter from '@/components/CategoryFilter';
import EventGrid from '@/components/EventGrid';
import CalendarView from '@/components/CalendarView';
import { events as staticEvents, EventCategory, Event } from '@/data/events';

type StoredEvent = {
  id: string;
  title: string;
  date: string;
  venue: string;
  description?: string;
  status?: 'Draft' | 'Published';
  posterUrl?: string;
  coverUrl?: string;
  society?: string;
};

const STORAGE_KEY = 'manage-events:v1';
const PREFERENCES_KEY = 'event-preferences:v1';
const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=600&h=400&fit=crop&auto=format&dpr=1';

type CategoryPreferences = Record<EventCategory, number>;

const Index = () => {
  const [currentView, setCurrentView] = useState<'grid' | 'calendar'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [localEvents, setLocalEvents] = useState<Event[]>([]);
  const [categoryPreferences, setCategoryPreferences] = useState<CategoryPreferences>(() => {
    if (typeof window === 'undefined') return { technical: 0, cultural: 0, sports: 0, academic: 0 };
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY);
      return stored ? JSON.parse(stored) : { technical: 0, cultural: 0, sports: 0, academic: 0 };
    } catch {
      return { technical: 0, cultural: 0, sports: 0, academic: 0 };
    }
  });

  const mapStoredToEvent = useCallback((item: StoredEvent): Event => {
    return {
      id: `local-${item.id}`,
      title: item.title || 'Untitled event',
      description: item.description || 'Details coming soon.',
      date: item.date || new Date().toISOString().slice(0, 10),
      time: 'All day',
      venue: item.venue || 'TBD',
      society: item.society || 'Your Society',
      category: 'academic',
      posterUrl: item.coverUrl || item.posterUrl || DEFAULT_POSTER,
      interestedCount: 0,
    };
  }, []);

  const loadLocalPublished = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setLocalEvents([]);
        return;
      }
      const parsed: StoredEvent[] = JSON.parse(stored);
      const published = parsed
        .filter((item) => item.status === 'Published')
        .map(mapStoredToEvent);
      setLocalEvents(published);
    } catch (error) {
      console.error('Failed to read local events', error);
    }
  }, [mapStoredToEvent]);

  useEffect(() => {
    loadLocalPublished();

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        loadLocalPublished();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [loadLocalPublished]);

  const trackEventClick = useCallback((category: EventCategory) => {
    setCategoryPreferences((prev) => {
      const updated = { ...prev, [category]: prev[category] + 1 };
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
      console.log('Tracking click for category:', category, 'Updated preferences:', updated);
      return updated;
    });
  }, []);

  const allEvents = useMemo(() => [...localEvents, ...staticEvents], [localEvents]);

  const sortedEvents = useMemo(() => {
    if (selectedCategory !== 'all') return allEvents;
    
    const totalClicks = Object.values(categoryPreferences).reduce((a, b) => a + b, 0);
    console.log('Category preferences:', categoryPreferences, 'Total clicks:', totalClicks);
    if (totalClicks === 0) return allEvents;

    const sorted = [...allEvents].sort((a, b) => {
      const prefA = categoryPreferences[a.category] || 0;
      const prefB = categoryPreferences[b.category] || 0;
      return prefB - prefA;
    });
    console.log('Sorted events by preferences. First 3:', sorted.slice(0, 3).map(e => ({ title: e.title, category: e.category })));
    return sorted;
  }, [allEvents, categoryPreferences, selectedCategory]);

  const filteredEvents = useMemo(() => {
    return sortedEvents.filter((event) => {
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.society.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [sortedEvents, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header onViewChange={setCurrentView} currentView={currentView} />
      <HeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      {currentView === 'grid' ? (
        <EventGrid events={filteredEvents} onEventClick={trackEventClick} />
      ) : (
        <CalendarView events={filteredEvents} />
      )}
      
      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-5">
        <div className="container mx-auto px-2 text-center">
          <p className="text-sm text-muted-foreground">
            Made by Arundhati
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
