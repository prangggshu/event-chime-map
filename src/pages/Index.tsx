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
};

const STORAGE_KEY = 'manage-events:v1';
const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=600&h=400&fit=crop&auto=format&dpr=1';

const Index = () => {
  const [currentView, setCurrentView] = useState<'grid' | 'calendar'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [localEvents, setLocalEvents] = useState<Event[]>([]);

  const mapStoredToEvent = useCallback((item: StoredEvent): Event => {
    return {
      id: `local-${item.id}`,
      title: item.title || 'Untitled event',
      description: item.description || 'Details coming soon.',
      date: item.date || new Date().toISOString().slice(0, 10),
      time: 'All day',
      venue: item.venue || 'TBD',
      society: 'Your Society',
      category: 'academic',
      posterUrl: item.posterUrl || DEFAULT_POSTER,
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

  const allEvents = useMemo(() => [...localEvents, ...staticEvents], [localEvents]);

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.society.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allEvents, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header onViewChange={setCurrentView} currentView={currentView} />
      <HeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      {currentView === 'grid' ? (
        <EventGrid events={filteredEvents} />
      ) : (
        <CalendarView events={filteredEvents} />
      )}
      
      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Events Everywhere. Your unified campus event portal.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
