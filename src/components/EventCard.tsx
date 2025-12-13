import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Event, EventCategory, categoryLabels, categoryColors } from '@/data/events';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface EventCardProps {
  event: Event;
  onEventClick?: (category: EventCategory) => void;
}

const INTERESTED_EVENTS_KEY = 'interested-events:v1';

type InterestedData = Record<string, { interested: boolean; count: number }>;

const EventCard = ({ event, onEventClick }: EventCardProps) => {
  const [isInterested, setIsInterested] = useState(false);
  const [interestCount, setInterestCount] = useState(event.interestedCount);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(INTERESTED_EVENTS_KEY);
      if (stored) {
        const data: InterestedData = JSON.parse(stored);
        if (data[event.id]) {
          setIsInterested(data[event.id].interested);
          setInterestCount(data[event.id].count);
        }
      }
    } catch (error) {
      console.error('Failed to load interested state', error);
    }
  }, [event.id]);

  const handleInterestClick = () => {
    const newIsInterested = !isInterested;
    const newCount = newIsInterested ? interestCount + 1 : interestCount - 1;
    
    setIsInterested(newIsInterested);
    setInterestCount(newCount);

    try {
      const stored = localStorage.getItem(INTERESTED_EVENTS_KEY);
      const data: InterestedData = stored ? JSON.parse(stored) : {};
      data[event.id] = { interested: newIsInterested, count: newCount };
      localStorage.setItem(INTERESTED_EVENTS_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save interested state', error);
    }
  };

  const handleEventClick = () => {
    onEventClick?.(event.category);
  };

  const formattedDate = format(parseISO(event.date), 'MMM dd, yyyy');

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 font-playfair">
      {/* Image */}
      <Link to={`/events/${event.id}`} onClick={handleEventClick} className="relative block aspect-[16/10] overflow-hidden">
        <img
          src={event.posterUrl}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Category */}
        <Badge
          className={cn(
            'absolute left-4 top-4 border-0 text-xs font-semibold text-white',
            categoryColors[event.category]
          )}
        >
          {categoryLabels[event.category]}
        </Badge>

        {/* Society */}
        <div className="absolute bottom-4 left-4">
          <span className="text-sm font-medium text-white/90">
            {event.society}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <Link to={`/events/${event.id}`} onClick={handleEventClick} className="block">
          <h3 className="mb-2 text-lg font-bold line-clamp-1 transition-colors group-hover:text-orange-600">
            {event.title}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        </Link>

        {/* Meta */}
        <div className="mb-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span>{event.venue}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="font-medium">{interestCount}</span>
            <span>interested</span>
          </div>

          <Button
            size="sm"
            onClick={handleInterestClick}
            className={cn(
              'gap-1.5 px-3 py-1.5 text-xs font-playfair transition-colors',
              isInterested
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-orange-100 text-orange-700 hover:bg-orange-200',
              'focus-visible:ring-orange-400'
            )}
          >
            <Heart className={cn('h-3.5 w-3.5', isInterested && 'fill-current')} />
            {isInterested ? 'Interested!' : "I'm Interested"}
          </Button>
        </div>
      </div>
    </article>
  );
};

export default EventCard;
