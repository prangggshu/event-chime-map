import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Save, Sparkles, Trash2 } from "lucide-react";
import Tesseract from "tesseract.js";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

/* ================= TYPES ================= */

type Category = "Technical" | "Cultural" | "Sports" | "Academic" | "";

type EventForm = {
  title: string;
  date: string;
  time: string;
  venue: string;
  category: Category;
  society: string;
  description: string;
  posterUrl: string; // OCR
  coverUrl: string;  // display image
};

type EventItem = EventForm & {
  id: string;
  status: "Draft" | "Published";
};

/* ================= CONSTANTS ================= */

const STORAGE_KEY = "manage-events:v1";
const AUTH_ROLE_KEY = "auth:role";
const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=600&h=400&fit=crop&auto=format";

/* ================= OCR HELPERS ================= */

const preprocessImage = async (file: File): Promise<File> => {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const scale = 2;

  canvas.width = bitmap.width * scale;
  canvas.height = bitmap.height * scale;

  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  ctx.drawImage(bitmap, 0, 0);

  return new Promise((resolve) =>
    canvas.toBlob(
      (b) => resolve(new File([b!], file.name, { type: "image/png" })),
      "image/png"
    )
  );
};

const runOCR = async (file: File) => {
  const processed = await preprocessImage(file);
  const res = await Tesseract.recognize(processed, "eng");
  return res.data.text;
};

const cleanOCRText = (text: string) =>
  text.replace(/[^\x20-\x7E\n]/g, "").replace(/\s{2,}/g, " ").trim();

const extractByLabels = (text: string) => {
  const get = (label: string) =>
    text.match(new RegExp(`${label}\\s*[:\\-]?\\s*(.+)`, "i"))?.[1] || "";

  return {
    title: get("Event Title"),
    date: get("Date"),
    time: get("Time"),
    venue: get("Venue"),
    society: get("Society|Organised by|Organized by"),
    description: get("Description"),
  };
};

const normalizeDate = (raw: string) => {
  const m = raw.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
  if (!m) return "";
  return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
};

/* ================= COMPONENT ================= */

const ManageEvents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [events, setEvents] = useState<EventItem[]>(() => {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : [];
  });

  const [form, setForm] = useState<EventForm>({
    title: "",
    date: "",
    time: "",
    venue: "",
    category: "",
    society: "",
    description: "",
    posterUrl: "",
    coverUrl: "",
  });

  const [loadingOCR, setLoadingOCR] = useState(false);

  /* ---------- AUTH ---------- */

  useEffect(() => {
    if (localStorage.getItem(AUTH_ROLE_KEY) !== "society") {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const hasFormData = useMemo(
    () => Object.values(form).some(Boolean),
    [form]
  );

  /* ---------- POSTER OCR ---------- */

  const handlePosterUpload = async (file: File) => {
    setLoadingOCR(true);

    try {
      const cleaned = cleanOCRText(await runOCR(file));
      const extracted = extractByLabels(cleaned);

      setForm((p) => ({
        ...p,
        posterUrl: URL.createObjectURL(file),
        title: extracted.title || p.title,
        date: normalizeDate(extracted.date) || p.date,
        time: extracted.time || p.time,
        venue: extracted.venue || p.venue,
        society: extracted.society || p.society,
        description: extracted.description || p.description,
      }));

      toast({ title: "Poster scanned successfully" });
    } finally {
      setLoadingOCR(false);
    }
  };

  /* ---------- SAVE ---------- */

  const saveEvent = (status: EventItem["status"]) => {
    if (!form.title || !form.date || !form.venue) {
      toast({
        title: "Missing fields",
        description: "Title, Date and Venue are required",
        variant: "destructive",
      });
      return;
    }

    const next: EventItem = {
      id: Date.now().toString(),
      ...form,
      coverUrl: form.coverUrl || DEFAULT_COVER,
      status,
    };

    setEvents((p) => [next, ...p]);
    setForm({
      title: "",
      date: "",
      time: "",
      venue: "",
      category: "",
      society: "",
      description: "",
      posterUrl: "",
      coverUrl: "",
    });

    toast({
      title: status === "Published" ? "Event published" : "Draft saved",
    });
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-orange-50 p-8 font-playfair">
      {/* HEADER */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="text-lg font-semibold text-orange-700 hover:underline"
        >
          ← All Events
        </button>
        <h1 className="text-base font-medium text-orange-900">
          Manage Events
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* FORM */}
        <Card>
          <CardHeader>
            <CardTitle>Create / Edit Event</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* PREVIEW */}
            {form.coverUrl && (
              <div className="relative overflow-hidden rounded-xl border">
                <img
                  src={form.coverUrl}
                  className="h-52 w-full object-cover"
                />

                {form.category && (
                  <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs text-white">
                    {form.category}
                  </span>
                )}

                {form.society && (
                  <span className="absolute bottom-3 left-3 text-sm font-medium text-white">
                    {form.society}
                  </span>
                )}
              </div>
            )}

            {/* COVER IMAGE */}
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed p-3">
              <Upload className="h-4 w-4" />
              Upload display image
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files &&
                  setForm((p) => ({
                    ...p,
                    coverUrl: URL.createObjectURL(e.target.files![0]),
                  }))
                }
              />
            </label>

            {/* POSTER OCR */}
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed p-3">
              <Upload className="h-4 w-4" />
              Upload poster (OCR)
              <input
                hidden
                type="file"
                onChange={(e) =>
                  e.target.files && handlePosterUpload(e.target.files[0])
                }
              />
            </label>

            {/* CATEGORY */}
            <div className="flex gap-2">
              {["Technical", "Cultural", "Sports", "Academic"].map((c) => (
                <button
                  key={c}
                  onClick={() =>
                    setForm({ ...form, category: c as Category })
                  }
                  className={`rounded-full px-4 py-1.5 text-sm ${
                    form.category === c
                      ? "bg-orange-500 text-white"
                      : "border text-orange-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* EDITABLE FIELDS */}
            <Input
              placeholder="Event title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
            <Input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />
            <Input
              placeholder="Time"
              value={form.time}
              onChange={(e) =>
                setForm({ ...form, time: e.target.value })
              }
            />
            <Input
              placeholder="Venue"
              value={form.venue}
              onChange={(e) =>
                setForm({ ...form, venue: e.target.value })
              }
            />
            <Input
              placeholder="Society name"
              value={form.society}
              onChange={(e) =>
                setForm({ ...form, society: e.target.value })
              }
            />
            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </CardContent>

          <CardFooter className="gap-2">
            <Button variant="secondary" onClick={() => saveEvent("Draft")}>
              <Save className="mr-1 h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={() => saveEvent("Published")}>
              <Sparkles className="mr-1 h-4 w-4" />
              Publish
            </Button>
          </CardFooter>
        </Card>

        {/* EXISTING EVENTS */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Existing</CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No events created yet
              </p>
            )}
            {events.map((e) => (
              <div key={e.id} className="mb-2 rounded border p-3">
                <div className="font-semibold">{e.title}</div>
                <div className="text-xs text-muted-foreground">
                  {e.date} • {e.category} • {e.status}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageEvents;
