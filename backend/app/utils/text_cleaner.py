import re

def clean_legal_text(text: str) -> str:
    # Remove headers, footers, page numbers from judgments
    text = re.sub(r'Page \d+', '', text)
    text = re.sub(r'\n\s*\n', '\n\n', text)
    return text.strip()

