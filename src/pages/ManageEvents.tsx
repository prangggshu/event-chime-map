import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarRange, CheckCircle2, Edit3, MapPin, Plus, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const demoEvents = [
  {
    id: "1",
    title: "Tech Society Meetup",
    date: "2024-09-20",
    venue: "Auditorium 1",
    status: "Draft",
  },
  {
    id: "2",
    title: "Cultural Night",
    date: "2024-09-25",
    venue: "Main Quad",
    status: "Published",
  },
];

type EventForm = {
  title: string;
  date: string;
  venue: string;
  description: string;
  posterUrl: string;
};

type EventItem = EventForm & {
  id: string;
  status: "Draft" | "Published";
};

const STORAGE_KEY = "manage-events:v1";
const AUTH_ROLE_KEY = "auth:role";
const DEFAULT_POSTER = "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=600&h=400&fit=crop&auto=format&dpr=1";

const ManageEvents = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: EventItem[] = JSON.parse(stored).map((item: any) => ({
          ...item,
          posterUrl: item.posterUrl || DEFAULT_POSTER,
        }));
        return parsed;
      }
    } catch (error) {
      console.error("Failed to read events from storage", error);
    }
    return demoEvents.map((event) => ({ ...event, description: "", posterUrl: DEFAULT_POSTER }));
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EventForm>({
    title: "",
    date: "",
    venue: "",
    description: "",
    posterUrl: "",
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (error) {
      console.error("Failed to write events to storage", error);
    }
  }, [events]);

  const hasFormData = useMemo(() => {
    return form.title.trim() !== "" || form.date.trim() !== "" || form.venue.trim() !== "" || form.description.trim() !== "";
  }, [form]);

  const editingEvent = useMemo(() => events.find((event) => event.id === editingId) || null, [editingId, events]);

  useEffect(() => {
    const role = localStorage.getItem(AUTH_ROLE_KEY);
    if (role !== "society") {
      toast({
        title: "Society login required",
        description: "Log in as a society to post or edit events.",
        variant: "destructive",
      });
      navigate("/login?role=society", { replace: true });
    }
  }, [navigate, toast]);

  const resetForm = useCallback(() => {
    setForm({ title: "", date: "", venue: "", description: "", posterUrl: "" });
    setEditingId(null);
  }, []);

  const handleSelectEvent = useCallback((event: EventItem) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      date: event.date,
      venue: event.venue,
      description: event.description || "",
      posterUrl: event.posterUrl || "",
    });
  }, []);

  const handleNewEvent = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const upsertEvent = useCallback(
    (status: EventItem["status"]) => {
      if (status === "Published") {
        if (!form.title || !form.date || !form.venue || !form.description) {
          toast({
            title: "Missing details",
            description: "Fill title, date, venue, and description before publishing.",
            variant: "destructive",
          });
          return;
        }
      }

      const trimmedTitle = form.title.trim();
      if (!trimmedTitle) {
        toast({
          title: "Add a title",
          description: "A title is required to save an event.",
          variant: "destructive",
        });
        return;
      }

      const nextId = editingId ?? `${Date.now()}`;
      const nextEvent: EventItem = {
        id: nextId,
        title: trimmedTitle,
        date: form.date,
        venue: form.venue,
        description: form.description,
        posterUrl: form.posterUrl.trim() || DEFAULT_POSTER,
        status,
      };

      setEvents((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === nextId);
        if (existingIndex >= 0) {
          const copy = [...prev];
          copy[existingIndex] = nextEvent;
          return copy;
        }
        return [nextEvent, ...prev];
      });

      setEditingId(nextId);

      toast({
        title: status === "Published" ? "Event published" : "Draft saved",
        description: status === "Published" ? "Your event is now live in this workspace." : "Draft stored locally.",
      });
    },
    [editingId, form, toast],
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/80 bg-gradient-to-r from-background via-background to-muted/40">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Societies workspace
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Post & edit events</h1>
              <p className="mt-2 text-base text-muted-foreground">
                Create new listings, update details, and keep your society events in sync.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Drafts auto-save locally.
              </div>
              <div className="flex items-center gap-1">
                <CalendarRange className="h-4 w-4 text-primary" />
                Publish to campus calendar.
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/">Back to events</Link>
            </Button>
            <Button variant="gradient" className="gap-2" onClick={handleNewEvent}>
              <Plus className="h-4 w-4" />
              New event
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto grid gap-6 px-4 py-8 lg:grid-cols-[1.2fr_1fr]">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="space-y-1">
              <CardTitle>Create or update an event</CardTitle>
              <CardDescription>Save to draft; publish once details are ready.</CardDescription>
            </div>
            <Badge variant={editingEvent?.status === "Published" ? "secondary" : "outline"}>
              {editingEvent ? editingEvent.status : "New"}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground" htmlFor="event-title">Event title</label>
              <Input
                id="event-title"
                placeholder="Hackathon kickoff"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground" htmlFor="event-date">Date</label>
                <Input
                  id="event-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground" htmlFor="event-venue">Venue</label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="event-venue"
                    placeholder="Main auditorium"
                    className="pl-9"
                    value={form.venue}
                    onChange={(e) => setForm((prev) => ({ ...prev, venue: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground" htmlFor="event-poster">Event cover image (URL)</label>
              <Input
                id="event-poster"
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={form.posterUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, posterUrl: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">Paste an image URL; we fallback to a default cover if left empty.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground" htmlFor="event-description">Description</label>
              <Textarea
                id="event-description"
                placeholder="Tell attendees what to expect."
                rows={4}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-3">
            <Button variant="secondary" className="gap-2" disabled={!hasFormData} onClick={() => upsertEvent("Draft")}>
              <Save className="h-4 w-4" />
              Save draft
            </Button>
            <Button
              className="gap-2"
              disabled={!form.title || !form.date || !form.venue || !form.description}
              onClick={() => upsertEvent("Published")}
            >
              <Sparkles className="h-4 w-4" />
              Publish event
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Edit existing</CardTitle>
              <CardDescription>Tap an event to open it in the form.</CardDescription>
            </div>
            <Badge variant="outline">{events.length} events</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {events.length === 0 && <p className="text-sm text-muted-foreground">No events yet. Create your first event.</p>}
            {events.map((event) => (
              <button
                type="button"
                key={event.id}
                onClick={() => handleSelectEvent(event)}
                className={
                  "flex w-full items-center justify-between rounded-xl border border-border/70 bg-card/60 px-4 py-3 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md" +
                  (editingId === event.id ? " border-primary/50 shadow-md" : "")
                }
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Edit3 className="h-4 w-4 text-primary" />
                    {event.title || "Untitled event"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {event.date || "No date"} • {event.venue || "No venue"}
                  </div>
                </div>
                <Badge variant={event.status === "Published" ? "secondary" : "outline"}>{event.status}</Badge>
              </button>
            ))}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button asChild variant="link">
              <Link to="/">Preview site</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/login?role=society">Switch account</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ManageEvents;
