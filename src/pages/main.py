from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import pytesseract
import io
import re

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def parse_event(text: str):
    lines = [l.strip() for l in text.split("\n") if l.strip()]

    title = lines[0] if lines else ""
    date = ""
    venue = ""

    date_patterns = [
        r"\d{1,2}[-/]\d{1,2}[-/]\d{4}",
        r"\d{4}[-/]\d{1,2}[-/]\d{1,2}",
        r"\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}",
    ]

    for line in lines:
        for p in date_patterns:
            m = re.search(p, line, re.I)
            if m:
                date = m.group()
                break
        if date:
            break

    for line in lines:
        m = re.search(r"(venue|location|at)\s*[:\-]?\s*(.+)", line, re.I)
        if m:
            venue = m.group(2)
            break

    description = " ".join(lines[1:4])[:300]

    return {
        "title": title,
        "date": date,
        "venue": venue,
        "description": description,
        "raw_text": text,
    }

@app.post("/ocr")
async def ocr(file: UploadFile = File(...)):
    img_bytes = await file.read()
    img = Image.open(io.BytesIO(img_bytes))

    text = pytesseract.image_to_string(img)
    parsed = parse_event(text)

    return parsed