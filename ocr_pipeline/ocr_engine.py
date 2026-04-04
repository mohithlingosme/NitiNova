import os
import logging
from typing import List, Optional
from pathlib import Path
from PIL import Image
import pytesseract
import cv2
import numpy as np
from pdf2image import convert_from_path
from paddleocr import PaddleOCR
from PyPDF2 import PdfReader

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OCRPipeline:
    def __init__(self, tesseract_path: Optional[str] = None, paddle_ocr=None):
        self.tesseract_path = tesseract_path or pytesseract.get_tesseract_version()
        try:
            self.paddle_ocr = PaddleOCR(use_angle_cls=True, lang='en', use_gpu=False) if paddle_ocr is None else paddle_ocr
        except ImportError:
            self.paddle_ocr = None
            logger.warning("PaddleOCR not available, falling back to Tesseract only")

    def preprocess_image(self, image: Image.Image) -> Image.Image:
        "Preprocess image: grayscale, noise reduction, binarization."
        img_array = np.array(image)
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        denoised = cv2.fastNlMeansDenoising(gray)
        _, binary = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        return Image.fromarray(binary)

    def pdf_to_images(self, pdf_path: str, dpi: int = 300) -> List[Image.Image]:
        "Convert PDF to images."
        images = convert_from_path(pdf_path, dpi=dpi)
        logger.info("Converted %s to %d images" % (pdf_path, len(images)))
        return images

    def extract_with_tesseract(self, image: Image.Image) -> str:
        "Extract text using Tesseract."
        preprocessed = self.preprocess_image(image)
        text = pytesseract.image_to_string(preprocessed, lang='eng')
        return text.strip()

    def extract_with_paddle(self, image: np.ndarray) -> str:
        "Extract text using PaddleOCR."
        if not self.paddle_ocr:
            return ''
        result = self.paddle_ocr.ocr(image, cls=True)
        text = ' '.join([line[1][0] for line in result[0] if line])
        return text.strip()

    def extract_page(self, image: Image.Image) -> str:
        "Extract text from single page, prefer Tesseract."
        tesseract_text = self.extract_with_tesseract(image)
        if len(tesseract_text) > 50:
            return tesseract_text
        img_np = np.array(image)
        paddle_text = self.extract_with_paddle(img_np)
        return paddle_text or tesseract_text

    def process_pdf(self, pdf_path: str, output_dir: str = 'data/processed') -> dict:
        "Full PDF OCR pipeline."
        Path(output_dir).mkdir(parents=True, exist_ok=True)
        
        # Try PyPDF2 first for selectable text
        try:
            reader = PdfReader(pdf_path)
            selectable_text = ''
            for page in reader.pages:
                selectable_text += page.extract_text() + '\n'
            if len(selectable_text.strip()) > 100:
                output_file = Path(output_dir) / f'{Path(pdf_path).stem}_selectable.txt'
                output_file.write_text(selectable_text)
                logger.info("Saved selectable text: %s" % output_file)
                return {'method': 'PyPDF2', 'pages': len(reader.pages), 'output': str(output_file)}
        except Exception as e:
            logger.error(f"PyPDF2 failed: {e}")

        # OCR fallback
        images = self.pdf_to_images(pdf_path)
        full_text = []
        for i, image in enumerate(images):
            text = self.extract_page(image)
            full_text.append("--- Page %d ---" % (i+1))
            full_text.append(text)
            logger.info("OCR Page %d/%d" % (i+1, len(images)))

        full_text = '\n'.join(full_text)
        output_file = Path(output_dir) / f'{Path(pdf_path).stem}_ocr.txt'
        output_file.write_text(full_text)
        
        logger.info("Saved OCR text: %s" % output_file)
        return {'method': 'OCR', 'pages': len(images), 'output': str(output_file), 'char_count': len(full_text)}

if __name__ == '__main__':
    pipeline = OCRPipeline()
    pdf_path = 'data/raw/download_1.pdf'
    if os.path.exists(pdf_path):
        result = pipeline.process_pdf(pdf_path)
        print('OCR complete:', result)
    else:
        print('Test PDF not found')
