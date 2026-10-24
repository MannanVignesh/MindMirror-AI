"""
MindMirror AI - Multimodal Document and Image Ingestion Pipeline
Supports:
1. Typed/pasted text.
2. PDF documents (embedded text extraction + scanned PDF OCR fallback).
3. Image and screenshot inputs (PNG, JPEG, WebP) with EXIF orientation correction and OCR.
"""

import io
import re
from typing import Dict, Any, List, Optional
from PIL import Image, ImageOps
import pypdf
from rapidocr_onnxruntime import RapidOCR

# Initialize singleton RapidOCR instance
_ocr_engine: Optional[RapidOCR] = None


def get_ocr_engine() -> RapidOCR:
    global _ocr_engine
    if _ocr_engine is None:
        _ocr_engine = RapidOCR()
    return _ocr_engine


def clean_text_whitespace(text: str) -> str:
    """Normalizes whitespace and excessive blank lines."""
    text = re.sub(r'\r\n|\r', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def extract_from_text(raw_text: str) -> Dict[str, Any]:
    """Processes typed or pasted text."""
    cleaned = clean_text_whitespace(raw_text)
    word_count = len(cleaned.split()) if cleaned else 0
    char_count = len(cleaned)

    warnings = []
    if char_count == 0:
        warnings.append("Supplied text is empty.")
    elif word_count < 5:
        warnings.append("Text is very brief (< 5 words). Classification confidence may be limited.")

    return {
        "source_type": "typed_text",
        "extracted_text": cleaned,
        "page_count": 1,
        "word_count": word_count,
        "char_count": char_count,
        "ocr_applied": False,
        "ocr_confidence": None,
        "warnings": warnings,
        "status": "success" if char_count > 0 else "warning"
    }


def extract_from_image(image_bytes: bytes, filename: str = "upload.png") -> Dict[str, Any]:
    """Processes an image or screenshot using EXIF orientation correction and OCR."""
    warnings = []
    try:
        image = Image.open(io.BytesIO(image_bytes))
        # Correct orientation based on EXIF tag if available
        try:
            image = ImageOps.exif_transpose(image)
        except Exception:
            pass

        # Convert to RGB if needed (handles RGBA, Palette, Grayscale)
        if image.mode != "RGB":
            image = image.convert("RGB")

        # Run RapidOCR on the image
        engine = get_ocr_engine()
        ocr_result, _ = engine(image)

        if not ocr_result or len(ocr_result) == 0:
            return {
                "source_type": "screenshot" if "screenshot" in filename.lower() else "photograph",
                "extracted_text": "",
                "page_count": 1,
                "word_count": 0,
                "char_count": 0,
                "ocr_applied": True,
                "ocr_confidence": 0.0,
                "warnings": ["No readable text could be recognized in the supplied image."],
                "status": "warning"
            }

        # RapidOCR returns items: [box, text, score]
        lines = []
        confidences = []
        for item in ocr_result:
            if len(item) >= 3:
                line_text = str(item[1]).strip()
                score = float(item[2])
                if line_text:
                    lines.append(line_text)
                    confidences.append(score)

        extracted_text = clean_text_whitespace("\n".join(lines))
        mean_conf = float(sum(confidences) / len(confidences)) if confidences else 0.0

        if mean_conf < 0.65:
            warnings.append(f"Mean OCR confidence is low ({mean_conf:.1%}). Please review and correct the text before analysis.")

        word_count = len(extracted_text.split()) if extracted_text else 0
        char_count = len(extracted_text)

        source_type = "screenshot" if any(k in filename.lower() for k in ["screen", "shot", "capture", "snip"]) else "photograph"

        return {
            "source_type": source_type,
            "extracted_text": extracted_text,
            "page_count": 1,
            "word_count": word_count,
            "char_count": char_count,
            "ocr_applied": True,
            "ocr_confidence": round(mean_conf, 3),
            "warnings": warnings,
            "status": "success" if char_count > 0 else "warning"
        }
    except Exception as e:
        return {
            "source_type": "image",
            "extracted_text": "",
            "page_count": 1,
            "word_count": 0,
            "char_count": 0,
            "ocr_applied": True,
            "ocr_confidence": None,
            "warnings": [f"Image parsing failed: {str(e)}"],
            "status": "error"
        }


def extract_from_pdf(pdf_bytes: bytes, filename: str = "document.pdf") -> Dict[str, Any]:
    """Processes PDF documents, extracting digital text or falling back to OCR for scanned pages."""
    warnings = []
    try:
        reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
        num_pages = len(reader.pages)
        if num_pages == 0:
            return {
                "source_type": "pdf",
                "extracted_text": "",
                "page_count": 0,
                "word_count": 0,
                "char_count": 0,
                "ocr_applied": False,
                "ocr_confidence": None,
                "warnings": ["The PDF file contains 0 pages."],
                "status": "warning"
            }

        extracted_pages: List[str] = []
        ocr_used = False
        page_confidences: List[float] = []

        engine = get_ocr_engine()

        for page_idx, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""
            page_text = clean_text_whitespace(page_text)

            # If digital text extraction yields very little text, check for embedded images to run OCR
            if len(page_text) < 25 and len(page.images) > 0:
                ocr_used = True
                scanned_lines = []
                for img_obj in page.images:
                    try:
                        pil_img = Image.open(io.BytesIO(img_obj.data))
                        if pil_img.mode != "RGB":
                            pil_img = pil_img.convert("RGB")
                        ocr_res, _ = engine(pil_img)
                        if ocr_res:
                            for item in ocr_res:
                                if len(item) >= 3 and item[1]:
                                    scanned_lines.append(str(item[1]).strip())
                                    page_confidences.append(float(item[2]))
                    except Exception:
                        pass
                if scanned_lines:
                    page_text = "\n".join(scanned_lines)
                else:
                    warnings.append(f"Page {page_idx + 1} has minimal digital text and no readable OCR text.")

            extracted_pages.append(page_text)

        full_text = clean_text_whitespace("\n\n--- Page Break ---\n\n".join(
            [f"[Page {i+1}]\n{p}" for i, p in enumerate(extracted_pages) if p]
        ))

        word_count = len(full_text.split()) if full_text else 0
        char_count = len(full_text)

        mean_conf = round(sum(page_confidences) / len(page_confidences), 3) if page_confidences else None
        if mean_conf is not None and mean_conf < 0.65:
            warnings.append(f"Scanned page OCR confidence is moderate to low ({mean_conf:.1%}). Please verify the extracted text.")

        if char_count == 0:
            warnings.append("Could not extract readable text from this PDF. It may be encrypted or contain unreadable raster scans.")

        return {
            "source_type": "pdf",
            "extracted_text": full_text,
            "page_count": num_pages,
            "word_count": word_count,
            "char_count": char_count,
            "ocr_applied": ocr_used,
            "ocr_confidence": mean_conf,
            "warnings": warnings,
            "status": "success" if char_count > 0 else "warning"
        }
    except Exception as e:
        return {
            "source_type": "pdf",
            "extracted_text": "",
            "page_count": 0,
            "word_count": 0,
            "char_count": 0,
            "ocr_applied": False,
            "ocr_confidence": None,
            "warnings": [f"Failed to parse PDF document: {str(e)}"],
            "status": "error"
        }
