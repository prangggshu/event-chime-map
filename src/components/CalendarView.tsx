import { useState } from 'react';
import { Calendar } from './ui/calendar';
import { Link } from 'react-router-dom';
import { Event, categoryColors, categoryLabels } from '@/data/events';
import { format, parseISO, isSameDay } from 'date-fns';
import { Badge } from './ui/badge';
import { Clock, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  events: Event[];
}

const CalendarView = ({ events }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const eventDates = events.map((event) => parseISO(event.date));

  const eventsOnSelectedDate = selectedDate
    ? events.filter((event) => isSameDay(parseISO(event.date), selectedDate))
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
        {/* Calendar */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="mb-4 text-lg font-bold text-card-foreground">Event Calendar</h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{
              hasEvent: eventDates,
            }}
            modifiersStyles={{
              hasEvent: {
                fontWeight: 'bold',
                backgroundColor: 'hsl(var(--primary) / 0.15)',
                borderRadius: '50%',
              },
            }}
            className="rounded-lg pointer-events-auto"
          />
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-3 w-3 rounded-full bg-primary/20" />
            <span>Days with events</span>
          </div>
        </div>

        {/* Events for selected date */}
        <div>
          <h2 className="mb-6 text-xl font-bold text-foreground">
            {selectedDate
              ? `Events on ${format(selectedDate, 'MMMM dd, yyyy')}`
              : 'Select a date'}
          </h2>

          {eventsOnSelectedDate.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
              <p className="text-muted-foreground">
                No events scheduled for this date
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {eventsOnSelectedDate.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition-all hover:shadow-card-hover"
                >
                  <img
                    src={event.posterUrl}
                    alt={event.title}
                    className="h-24 w-32 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <Badge
                          className={cn(
                            'mb-2 border-0 text-xs font-semibold text-primary-foreground',
                            categoryColors[event.category]
                          )}
                        >
                          {categoryLabels[event.category]}
                        </Badge>
                        <h3 className="font-bold text-card-foreground">
                          {event.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {event.society}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {event.venue}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {event.interestedCount} interested
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
