import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, ArrowLeft, ExternalLink } from "lucide-react";
import { Event, categoryColors, categoryLabels, events as staticEvents } from "@/data/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

const STORAGE_KEY = "manage-events:v1";
const DEFAULT_POSTER = "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=600&h=400&fit=crop&auto=format&dpr=1";

const mapStoredToEvent = (item: any): Event => {
  return {
    id: `local-${item.id}`,
    title: item.title || "Untitled event",
    description: item.description || "Details coming soon.",
    date: item.date || new Date().toISOString().slice(0, 10),
    time: "All day",
    venue: item.venue || "TBD",
    society: "Your Society",
    category: "academic",
    posterUrl: item.posterUrl || DEFAULT_POSTER,
    interestedCount: 0,
  };
};

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [localEvents, setLocalEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const published = parsed.filter((item: any) => item.status === "Published");
        setLocalEvents(published.map(mapStoredToEvent));
      }
    } catch (error) {
      console.error("Failed to read local events", error);
    }
  }, []);

  const event = useMemo(() => {
    if (!id) return null;
    if (id.startsWith("local-")) {
      return localEvents.find((ev) => ev.id === id) || null;
    }
    return localEvents.find((ev) => ev.id === `local-${id}`) || null;
  }, [id, localEvents]);

  const staticEvent = useMemo(() => {
    if (!id) return null;
    return staticEvents.find((ev) => ev.id === id) || null;
  }, [id]);

  const resolved = event || staticEvent;

  useEffect(() => {
    if (!resolved && id) {
      // if no match, redirect to not found after a short delay
      const t = setTimeout(() => navigate("/", { replace: true }), 1500);
      return () => clearTimeout(t);
    }
  }, [resolved, id, navigate]);

  if (!resolved) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-semibold">Event not found</h1>
          <p className="text-muted-foreground">We couldn't find that event. Redirecting to the homepage...</p>
          <Button asChild variant="link" className="mt-4">
            <Link to="/">Go now</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = format(parseISO(resolved.date), "MMMM dd, yyyy");

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-72 w-full overflow-hidden">
        <img src={resolved.posterUrl} alt={resolved.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute left-1/2 top-1/2 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 px-6 text-white drop-shadow-xl">
          <Badge
            className={cn(
              "mb-3 border-0 text-xs font-semibold text-primary-foreground",
              categoryColors[resolved.category],
            )}
          >
            {categoryLabels[resolved.category]}
          </Badge>
          <h1 className="text-3xl font-extrabold leading-tight drop-shadow-sm md:text-4xl">{resolved.title}</h1>
          <p className="mt-2 text-sm text-primary-foreground/90">{resolved.society}</p>
        </div>
      </div>

      <div className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[2fr_1fr] lg:items-start">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{resolved.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{resolved.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{resolved.interestedCount} interested</span>
              </div>
            </div>

            <p className="mt-6 text-base leading-relaxed text-card-foreground">
              {resolved.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" className="gap-2">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to events
              </Link>
            </Button>
            <Button asChild variant="interest" className="gap-2">
              <Link to="/manage-events">
                <ExternalLink className="h-4 w-4" />
                Post your own
              </Link>
            </Button>
          </div>
        </div>

        <aside className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="text-lg font-semibold text-card-foreground">Event details</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div><span className="font-semibold text-foreground">Organized by:</span> {resolved.society}</div>
            <div><span className="font-semibold text-foreground">Category:</span> {categoryLabels[resolved.category]}</div>
            <div><span className="font-semibold text-foreground">Date:</span> {formattedDate}</div>
            <div><span className="font-semibold text-foreground">Time:</span> {resolved.time}</div>
            <div><span className="font-semibold text-foreground">Venue:</span> {resolved.venue}</div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EventDetail;
