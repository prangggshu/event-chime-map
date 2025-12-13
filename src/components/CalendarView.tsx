import {
  format,
  parseISO,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";
import { useState } from "react";
import { Event, categoryLabels } from "@/data/events";
import { Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  events: Event[];
}

const CalendarView = ({ events }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const eventsForDate = (date: Date) =>
    events.filter((e) => isSameDay(parseISO(e.date), date));

  return (
    <div className="container mx-auto px-4 py-8 font-playfair">
      <h1 className="mb-1 text-2xl font-extrabold">Event Calendar</h1>
      <p className="mb-6 text-muted-foreground">
        Hover over dates to preview events
      </p>

      <div className="rounded-2xl border bg-card p-6 shadow-card">
        {/* MONTH HEADER */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="rounded-lg border p-2 hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <h2 className="text-lg font-bold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>

          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="rounded-lg border p-2 hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* WEEK HEADER */}
        <div className="mb-2 grid grid-cols-7 text-xs text-muted-foreground">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center">
              {d}
            </div>
          ))}
        </div>

        {/* CALENDAR GRID */}
        <div className="grid grid-cols-7 gap-4">
          {monthDays.map((day) => {
            const dayEvents = eventsForDate(day);
            const hasEvent = dayEvents.length > 0;
            const key = day.toISOString();

            return (
              <div
                key={key}
                className="relative h-[100px]"
                style={{ perspective: "1000px" }}
                onMouseEnter={() => hasEvent && setHoveredDate(key)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                {/* FLIP CARD */}
                <div
                  className="relative h-full w-full transition-transform duration-500"
                  style={{
                    transformStyle: "preserve-3d",
                    transform:
                      hoveredDate === key
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                  }}
                >
                  {/* FRONT */}
                  <div
                    className={cn(
                      "absolute inset-0 flex flex-col items-center justify-center rounded-xl border",
                      hasEvent
                        ? "bg-orange-500 text-white font-semibold"
                        : "bg-white text-foreground"
                    )}
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <span className="text-lg">{format(day, "d")}</span>
                    {hasEvent && (
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </div>

                  {/* BACK — ONLY AFTER FLIP */}
                  {hasEvent && (
                    <div
                      className="absolute inset-0 rounded-xl bg-orange-600 text-white p-3 text-xs flex items-center justify-center"
                      style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      {dayEvents.slice(0, 1).map((event) => (
                        <div key={event.id} className="space-y-1 text-center">
                          <div className="text-[10px] uppercase opacity-80">
                            {categoryLabels[event.category]}
                          </div>
                          <div className="font-bold leading-tight">
                            {event.title}
                          </div>
                          <div className="flex items-center justify-center gap-1 opacity-90">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </div>
                          <div className="flex items-center justify-center gap-1 opacity-90">
                            <MapPin className="h-3 w-3" />
                            {event.venue}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
