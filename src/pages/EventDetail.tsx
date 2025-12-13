import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import {
  Event,
  categoryColors,
  categoryLabels,
  events as staticEvents,
} from "@/data/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

const STORAGE_KEY = "manage-events:v1";
const DEFAULT_POSTER =
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=600&h=400&fit=crop&auto=format&dpr=1";

const mapStoredToEvent = (item: any): Event => ({
  id: `local-${item.id}`,
  title: item.title || "Untitled event",
  description: item.description || "Details coming soon.",
  date: item.date || new Date().toISOString().slice(0, 10),
  time: "All day",
  venue: item.venue || "TBD",
  society: item.society || "Your Society",
  category: "academic",
  posterUrl: item.coverUrl || item.posterUrl || DEFAULT_POSTER,
  interestedCount: 0,
});

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [localEvents, setLocalEvents] = useState<Event[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const published = parsed.filter(
          (item: any) => item.status === "Published"
        );
        setLocalEvents(published.map(mapStoredToEvent));
      }
    } catch (e) {
      console.error(e);
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
      const t = setTimeout(
        () => navigate("/", { replace: true }),
        1500
      );
      return () => clearTimeout(t);
    }
  }, [resolved, id, navigate]);

  if (!resolved) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50 font-playfair">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-semibold text-orange-800">
            Event not found
          </h1>
          <p className="text-orange-600">
            Redirecting to the homepage…
          </p>
          <Button asChild variant="link" className="mt-4 text-orange-600">
            <Link to="/">Go now</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = format(parseISO(resolved.date), "MMMM dd, yyyy");

  return (
    <div className="min-h-screen bg-orange-50 font-playfair">
      {/* HERO */}
      <div className="relative h-72 w-full overflow-hidden">
        <img
          src={resolved.posterUrl}
          alt={resolved.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 via-orange-700/40 to-transparent" />

        <div className="absolute left-1/2 top-1/2 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 px-6 text-white">
          <Badge
            className={cn(
              "mb-3 border-0 bg-orange-500 text-white"
            )}
          >
            {categoryLabels[resolved.category]}
          </Badge>

          <h1 className="text-3xl font-extrabold md:text-4xl">
            {resolved.title}
          </h1>
          <p className="mt-2 text-sm text-orange-100">
            {resolved.society}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-card">
            <div className="flex flex-wrap gap-4 text-sm text-orange-700">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-500" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                {resolved.time}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                {resolved.venue}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-500" />
                {resolved.interestedCount} interested
              </div>
            </div>

            <p className="mt-6 text-base leading-relaxed text-gray-700">
              {resolved.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              variant="outline"
              className="gap-2 border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to events
              </Link>
            </Button>

            <Button
              asChild
              className="gap-2 bg-orange-500 text-white hover:bg-orange-600"
            >
              <Link to="/manage-events">
                <ExternalLink className="h-4 w-4" />
                Post your own
              </Link>
            </Button>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-4 rounded-2xl border bg-white p-6 shadow-card">
          <h3 className="text-lg font-semibold text-orange-800">
            Event details
          </h3>

          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <span className="font-semibold text-orange-700">
                Organized by:
              </span>{" "}
              {resolved.society}
            </div>
            <div>
              <span className="font-semibold text-orange-700">
                Category:
              </span>{" "}
              {categoryLabels[resolved.category]}
            </div>
            <div>
              <span className="font-semibold text-orange-700">
                Date:
              </span>{" "}
              {formattedDate}
            </div>
            <div>
              <span className="font-semibold text-orange-700">
                Time:
              </span>{" "}
              {resolved.time}
            </div>
            <div>
              <span className="font-semibold text-orange-700">
                Venue:
              </span>{" "}
              {resolved.venue}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EventDetail;
