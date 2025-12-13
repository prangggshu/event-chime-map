import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Save, Sparkles, Edit3 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

/* ================= TYPES ================= */

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

/* ================= CONSTANTS ================= */

const STORAGE_KEY = "manage-events:v1";
const AUTH_ROLE_KEY = "auth:role";
const DEFAULT_POSTER =
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=600&h=400&fit=crop&auto=format";

/* ================= IMAGE PREPROCESSING ================= */

const preprocessImage = async (file: File): Promise<File> => {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");

  const scale = 2;
  canvas.width = bitmap.width * scale;
  canvas.height = bitmap.height * scale;

  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  ctx.drawImage(bitmap, 0, 0);

  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = img.data;

  for (let i = 0; i < d.length; i += 4) {
    const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    const c = Math.min(255, Math.max(0, (gray - 128) * 1.5 + 128));
    d[i] = d[i + 1] = d[i + 2] = c;
  }

  ctx.putImageData(img, 0, 0);

  return new Promise((resolve) =>
    canvas.toBlob(
      (b) => resolve(new File([b!], file.name, { type: "image/png" })),
      "image/png"
    )
  );
};

/* ================= OCR ================= */

const runOCR = async (file: File) => {
  const processed = await preprocessImage(file);

  const res = await Tesseract.recognize(processed, "eng", {
    psm: 4,
    preserve_interword_spaces: "1",
    tessedit_char_blacklist: "|_~`^",
  } as any);

  return res.data.text;
};

/* ================= CLEAN OCR TEXT ================= */

const cleanOCRText = (text: string) =>
  text
    .replace(/[^\x20-\x7E\n]/g, "")
    .replace(/[•●◆■]/g, "")
    .replace(/[_|~`^]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

/* ================= PARSER ================= */

const fallbackParser = (text: string) => {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 3);

  let title =
    lines
      .filter((l) => l.length < 60)
      .sort((a, b) => b.length - a.length)[0] || "";

  let date = "";
  let venue = "";

  const dateRegex =
    /(\d{1,2}\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\d{4})/i;

  for (const l of lines) {
    if (!date && dateRegex.test(l)) date = l.match(dateRegex)![0];
    if (
      !venue &&
      /(venue|campus|hall|auditorium|block|room)/i.test(l)
    )
      venue = l;
  }

  const description = lines.join(" ").slice(0, 200);

  return { title, date, venue, description };
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
    venue: "",
    description: "",
    posterUrl: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingOCR, setLoadingOCR] = useState(false);

  /* ---------- AUTH ---------- */

  useEffect(() => {
    if (localStorage.getItem(AUTH_ROLE_KEY) !== "society") {
      navigate("/login?role=society", { replace: true });
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
    setForm((p) => ({ ...p, posterUrl: URL.createObjectURL(file) }));

    try {
      const raw = await runOCR(file);
      const cleaned = cleanOCRText(raw);

      console.log("RAW OCR:", raw);
      console.log("CLEANED OCR:", cleaned);

      const extracted = fallbackParser(cleaned);

      setForm((p) => ({
        ...p,
        title: extracted.title.length > 5 ? extracted.title : p.title,
        venue: extracted.venue || p.venue,
        description: extracted.description || p.description,
      }));

      toast({
        title: "Poster scanned",
        description: "Fields auto-filled (review before publishing)",
      });
    } catch {
      toast({
        title: "OCR failed",
        description: "Fill details manually",
        variant: "destructive",
      });
    } finally {
      setLoadingOCR(false);
    }
  };

  /* ---------- SAVE ---------- */

  const saveEvent = (status: EventItem["status"]) => {
    if (
      status === "Published" &&
      (!form.title || !form.date || !form.venue)
    ) {
      toast({
        title: "Missing fields",
        description: "Complete all details before publishing",
        variant: "destructive",
      });
      return;
    }

    const id = editingId ?? Date.now().toString();

    const next: EventItem = {
      id,
      ...form,
      posterUrl: form.posterUrl || DEFAULT_POSTER,
      status,
    };

    setEvents((prev) =>
      prev.some((e) => e.id === id)
        ? prev.map((e) => (e.id === id ? next : e))
        : [next, ...prev]
    );

    setEditingId(id);
    toast({ title: status === "Published" ? "Event published" : "Draft saved" });
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-orange-50 p-8 font-playfair">
      <h1 className="mb-6 text-4xl font-bold text-orange-900">
        Manage Events
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* FORM */}
        <Card>
          <CardHeader>
            <CardTitle>Create / Edit Event</CardTitle>
            <Badge className="w-fit bg-orange-100 text-orange-700">
              AI-assisted
            </Badge>
          </CardHeader>

          <CardContent className="space-y-4">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-orange-300 p-3 hover:bg-orange-100">
              <Upload className="h-4 w-4" />
              Upload poster (OCR)
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && handlePosterUpload(e.target.files[0])
                }
              />
            </label>

            {loadingOCR && (
              <p className="text-sm text-orange-600">
                Scanning poster…
              </p>
            )}

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
              placeholder="Venue"
              value={form.venue}
              onChange={(e) =>
                setForm({ ...form, venue: e.target.value })
              }
            />
            <Textarea
              rows={4}
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </CardContent>

          <CardFooter className="gap-2">
            <Button
              variant="secondary"
              disabled={!hasFormData}
              onClick={() => saveEvent("Draft")}
            >
              <Save className="mr-1 h-4 w-4" />
              Save Draft
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => saveEvent("Published")}
            >
              <Sparkles className="mr-1 h-4 w-4" />
              Publish
            </Button>
          </CardFooter>
        </Card>

        {/* LIST */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Existing</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            {events.map((e) => (
              <button
                key={e.id}
                onClick={() => {
                  setEditingId(e.id);
                  setForm(e);
                }}
                className="w-full rounded-lg border px-4 py-3 text-left hover:border-orange-400"
              >
                <div className="font-semibold">{e.title}</div>
                <div className="text-xs text-muted-foreground">
                  {e.date} • {e.venue}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageEvents;
