import { Event, EventCategory } from '@/data/events';
import EventCard from './EventCard';
import { CalendarX } from 'lucide-react';

interface EventGridProps {
  events: Event[];
  onEventClick?: (category: EventCategory) => void;
}

const EventGrid = ({ events, onEventClick }: EventGridProps) => {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center font-playfair">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
          <CalendarX className="h-8 w-8 text-orange-500" />
        </div>

        <h3 className="mb-2 text-lg font-semibold text-orange-700">
          No events found
        </h3>

        <p className="text-sm text-orange-600/80">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 font-playfair">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events.map((event, index) => (
          <div
            key={event.id}
            className="animate-fade-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <EventCard event={event} onEventClick={onEventClick} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventGrid;
