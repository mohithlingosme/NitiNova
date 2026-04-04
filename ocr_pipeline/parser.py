import json
import re
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
import spacy
from spacy.matcher import Matcher

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LegalParser:
    def __init__(self):
        """Initialize spaCy model and legal patterns."""
        self._setup_patterns()
        try:
            self.nlp = spacy.load("en_core_web_sm")
            self.matcher = Matcher(self.nlp.vocab)
        except OSError:
            logger.warning("spaCy model 'en_core_web_sm' not found. Install with: python -m spacy download en_core_web_sm")
            self.nlp = None
        
    def _setup_patterns(self):
        \"\"\"Setup regex and spaCy patterns for legal documents.\"\"
        # Case citation patterns (e.g., \"(2021) 5 SCC 123\", \"AIR 2021 SC 456\")
        self.case_citation_pattern = re.compile(r'\([0-9]{4}\).*?(SCC|SC|SCB|Mad|Cal|Bom|All|Ker|Guj|MP|Pat|Ori|P&H|AP|Kant|J&K|Del)\s*[0-9]+', re.IGNORECASE)
        
        # Act citation patterns (e.g., \"Section 482 CrPC\", \"Article 21 Constitution\")
        self.act_pattern = re.compile(r'(Section|Sec|S\.|Article|Art\.|A\.)\s*[0-9]+.*?((CrPC|IPC|Code of Criminal Procedure|Indian Penal Code|Constitution|Evidence Act|Contract Act|Civil Procedure Code))', re.IGNORECASE)
        
        # Date patterns
        self.date_pattern = re.compile(r'\b([0-9]{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+[0-9]{4})\b')

    def _setup_legal_patterns(self):
        \"\"\"Setup regex patterns for legal field extraction from raw OCR text.\"\"
        # Case Name: e.g. 'STATE OF XYZ & ANR. VERSUS ABC PVT. LTD.'
        self.case_name_pattern = re.compile(r'([A-Z\s&.\-]+?\b(?:VERSUS|VS|V\.|v\.|Appellant|Petitioner)\b.*?\b(?:Respondent|Petition|Appeal))', re.IGNORECASE | re.DOTALL)
        
        # Court: e.g. 'SUPREME COURT OF INDIA', 'HIGH COURT OF DELHI'
        self.court_pattern = re.compile(r'(SUPREME COURT|HIGH COURT).*?(?:OF|AT)\\s+([A-Z\\s]+?)(?=\\n|$)', re.IGNORECASE)
        
        # Judges: e.g. 'HONBLE MR. JUSTICE PANKALA GHOSH, HONBLE MR. JUSTICE VIKRAM SARAF'
        self.judges_pattern = re.compile(r'HON\\'?BLE.*?JUSTICE ( [A-Z][a-z]+ [A-Z][a-z](?:, J\\.)?)', re.IGNORECASE)
        
        # Citations: AIR 2002 526, (2002) 5 SCC 123
        self.citations_pattern = re.compile(r'\b(AIR|SCC|SCR|CriLJ|All|Bom|Mad|Cal|Ker)\s+\d{4}\s*\d+(?:\s*\([^)]*\))?\b')
        """Setup regex and spaCy patterns for legal documents."""
        # Case citation patterns (e.g., "(2021) 5 SCC 123", "AIR 2021 SC 456")
        self.case_citation_pattern = re.compile(r'\([0-9]{4}\).*?(SCC|SC|SCB|Mad|Cal|Bom|All|Ker|Guj|MP|Pat|Ori|P&H|AP|Kant|J&K|Del)\s*[0-9]+', re.IGNORECASE)
        
        # Act citation patterns (e.g., "Section 482 CrPC", "Article 21 Constitution")
        self.act_pattern = re.compile(r'(Section|Sec|S\.|Article|Art\.A\.)\s*[0-9]+.*?((CrPC|IPC|Code of Criminal Procedure|Indian Penal Code|Constitution|Evidence Act|Contract Act|Civil Procedure Code)', re.IGNORECASE)
        
        # Date patterns
        self.date_pattern = re.compile(r'\b([0-9]{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+[0-9]{4})\b')
        
    def parse_txt(self, input_path: str, output_dir: str = "data/structured") -> Dict[str, Any]:
        \"\"\"Parse raw OCR .txt file to structured legal JSON per STEP 3 spec.\"\"
        input_path = Path(input_path)
        case_name = self._infer_case_name(input_path.name)
        output_file = Path(output_dir) / f'{case_name}.json'
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Read raw text
        with open(input_path, 'r', encoding='utf-8', errors='ignore') as f:
            text = f.read()
        
        clean_text = self._clean_text(text)
        
        # Extract
        fields = self._extract_fields(clean_text)
        sections = self._identify_sections(clean_text)
        
        structured = {
            **fields,
            **sections
        }
        
        # Save exact schema
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(structured, f, indent=2, ensure_ascii=False)
        
        logger.info(f'✅ Parsed TXT to: {output_file}')
        return {'output': str(output_file), 'case_name': case_name}

    def _infer_case_name(self, filename: str) -> str:
        \"\"\"Infer clean case_name from filename or text.\"\"
        # Remove extension, clean
        name = Path(filename).stem.replace('_', ' ').replace('-', ' ').title()
        if len(name) > 3:
            return name
        return 'parsed_case'

    def _extract_fields(self, text: str) -> Dict[str, Any]:
        \"\"\"Extract metadata fields.\"\"
        fields = {
            'case_name': '',
            'court': '',
            'judges': [],
            'date': '',
            'citations': []
        }
        
        # Case name
        match = self.case_name_pattern.search(text)
        fields['case_name'] = match.group(1).strip()[:200] if match else ''
        
        # Court
        match = self.court_pattern.search(text)
        fields['court'] = f'{match.group(1)} {match.group(2)}'.strip() if match else ''
        
        # Judges
        matches = self.judges_pattern.findall(text)
        fields['judges'] = [j.strip() for j in matches if len(j) > 5][:5]
        
        # Date
        match = self.date_pattern.search(text)
        fields['date'] = match.group(1) if match else ''
        
        # Citations
        matches = self.citations_pattern.findall(text)
        fields['citations'] = list(set(matches))[:20]
        
        return fields

    def _identify_sections(self, text: str) -> Dict[str, Any]:
        \"\"\"Identify and chunk sections by keywords/heuristic.\"\"
        sections = {
            'facts': self._chunk_text(''),
            'issues': [],
            'arguments': [],
            'judgement': self._chunk_text('')
        }
        
        text_lower = text.lower()
        paragraphs = re.split(r'\\n{2,}', text)
        
        fact_start = max(text_lower.find(s) for s in ['facts', 'background', 'case arose', 'incident'] if s in text_lower) if any(s in text_lower for s in ['facts', 'background']) else -1
        issue_start = max(text_lower.find(s) for s in ['issues', 'issue', 'questions'] if s in text_lower) or len(text) 
        arg_start = max(text_lower.find(s) for s in ['arguments', 'learned counsel', 'submissions', 'contended'] if s in text_lower) or len(text)
        judge_start = max(text_lower.find(s) for s in ['held', 'we direct', 'dispose', 'order'] if s in text_lower) or len(text)
        
        # Simple split by positions
        fact_text = text[:issue_start] if fact_start >=0 else ''
        sections['facts'] = self._chunk_text(fact_text)
        
        issue_text = text[issue_start:arg_start]
        sections['issues'] = [iss.strip() for iss in re.split(r'\\(i\\)|\\(ii\\)|\\(1\\)', issue_text) if iss.strip()][:5]
        
        arg_text = text[arg_start:judge_start]
        sections['arguments'] = self._chunk_text(arg_text).split('\\n\\n')[:10]
        
        sections['judgement'] = self._chunk_text(text[judge_start:])
        
        return sections

    def _chunk_text(self, text: str, max_words: int = 800) -> str:
        \"\"\"Chunk text to LLM-friendly size (single str per field).\"\"
        if len(text.split()) <= max_words:
            return text.strip()
        
        # Split by double newlines, merge
        paras = [p.strip() for p in text.split('\\n\\n') if p.strip()]
        chunks = []
        current = []
        current_words = 0
        
        for para in paras:
            words = len(para.split())
            if current_words + words > max_words and current:
                chunks.append(' '.join(current))
                current = [para]
                current_words = words
            else:
                current.append(para)
                current_words += words
        
        if current:
            chunks.append(' '.join(current))
        
        return '\\n\\n'.join(chunks[:3])  # Max 3 chunks concatenated

    def parse_json(self, input_path: str, output_dir: str = \"data/structured\") -> Dict[str, Any]:
        """Main parsing method: OCR JSON → structured legal JSON."""
        input_path = Path(input_path)
        output_file = Path(output_dir) / f"{input_path.stem}_parsed.json"
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Load OCR JSON
        with open(input_path, 'r', encoding='utf-8') as f:
            ocr_data = json.load(f)
        
        full_text = ocr_data.get("full_judgment_text", "")
        
        # Clean text
        clean_text = self._clean_text(full_text)
        
        # Parse components
        parsed = {
            "case_id": input_path.stem,
            "source": str(input_path),
            "metadata": ocr_data.get("metadata", {}),
            "parsed_metadata": self._extract_metadata(clean_text),
            "headnotes": self._extract_headnotes(clean_text),
            "sections": self._split_sections(clean_text),
            "entities": self._extract_entities(clean_text),
            "confidence": 0.85  # Placeholder
        }
        
        # Merge OCR + parsed metadata
        parsed["metadata"].update(parsed["parsed_metadata"])
        del parsed["parsed_metadata"]
        
        # Save
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(parsed, f, indent=2, ensure_ascii=False)
        
        logger.info(f"✅ Parsed: {output_file}")
        return {"output": str(output_file), "sections_count": len(parsed["sections"]), "entities_count": len(parsed["entities"].get("acts_cited", []))}
    
    def _clean_text(self, text: str) -> str:
        """Clean OCR text: remove page breaks, normalize whitespace."""
        # Remove page markers
        text = re.sub(r'---\s*Page\s*[0-9]+?\s*---', '', text, flags=re.IGNORECASE)
        # Normalize whitespace
        text = re.sub(r'\n\s*\n', '\n\n', text)
        text = re.sub(r'[ \t]+', ' ', text)
        return text.strip()
    
    def _extract_metadata(self, text: str) -> Dict[str, Any]:
        """Extract case metadata using regex."""
        metadata = {}
        
        # Court
        court_match = re.search(r'(SUPREME COURT|HIGH COURT).*?(?:OF|AT)\s+([A-Z\s]+?)(?=\n[A-Z]{2,})', text, re.IGNORECASE)
        metadata["court"] = court_match.group(1).strip() if court_match else "Unknown"
        
        # Case number
        case_no_match = re.search(r'(Writ|Petition|Appeal|Suit)\s+(?:Petition\s*)?\(?(CIVIL|CRIMINAL)?\)?\s*(NO\.?|No\.?)\s*[0-9]+', text, re.IGNORECASE)
        metadata["case_number"] = case_no_match.group(0) if case_no_match else "Unknown"
        
        # Bench/Judges
        judge_match = re.search(r'([A-Z][a-z]+\s+[A-Z][a-z]+(?:,\s*[A-Z][a-z]+\s+[A-Z][a-z]+)*)\s*,\s*J\.', text)
        metadata["judges"] = judge_match.group(1).split(', ') if judge_match else []
        
        # Date
        date_match = self.date_pattern.search(text)
        metadata["judgment_date"] = date_match.group(1) if date_match else "Unknown"
        
        return metadata
    
    def _extract_headnotes(self, text: str) -> str:
        """Extract headnotes/summary (first few paras or explicit section)."""
        # Simple heuristic: text before "1." or "The" judgment start
        headnote_match = re.search(r'(?s).*?(?=^(?:1\.|\d+\.|The|This Court))', text)
        return headnote_match.group(0).strip()[:1000] if headnote_match else ""
    
    def _split_sections(self, text: str) -> List[Dict[str, str]]:
        """Split into logical sections using keywords."""
        sections = []
        paragraphs = re.split(r'\n\n+', text)
        
        current_section = {"title": "Introduction", "paragraphs": []}
        
        section_keywords = {
            "facts": ["facts", "background", "case arose", "incident"],
            "issues": ["issues", "questions", "following issues"],
            "arguments": ["submissions", "learned counsel", "contended"],
            "decision": ["held", "we direct", "dispose", "allow", "dismiss"],
            "ratio": ["ratio", "principle", "law laid down"]
        }
        
        for para in paragraphs:
            para_lower = para.lower()
            para_title = current_section["title"]
            
            for sec_name, keywords in section_keywords.items():
                if any(kw in para_lower for kw in keywords):
                    if current_section["paragraphs"]:
                        sections.append(current_section)
                    current_section = {"title": sec_name.capitalize(), "paragraphs": [para]}
                    break
            else:
                current_section["paragraphs"].append(para)
        
        if current_section["paragraphs"]:
            sections.append(current_section)
        
        # Fallback numbered sections
        if len(sections) < 3:
            sections = self._numbered_sections(text)
        
        return sections[:10]  # Limit
    
    def _numbered_sections(self, text: str) -> List[Dict[str, str]]:
        """Fallback: split by numbered paragraphs."""
        paras = re.split(r'\n(?=\d+\.\s)', text)
        return [{"title": f"Para {i+1}", "paragraphs": [p.strip()]} for i, p in enumerate(paras[:8])]
    
    def _extract_entities(self, text: str) -> Dict[str, List[str]]:
        """Extract legal entities."""
        entities = {"judges": [], "acts_cited": [], "cases_cited": [], "dates": []}
        
        if not self.nlp:
            return entities
        
        doc = self.nlp(text[:10000])  # Limit text length
        
        # NER entities
        for ent in doc.ents:
            if ent.label_ == "PERSON" and "J." in ent.sent.text:
                entities["judges"].append(ent.text)
            elif ent.label_ == "DATE":
                entities["dates"].append(ent.text)
        
        # Regex entities
        entities["acts_cited"] = list(set(self.act_pattern.findall(text)))
        entities["cases_cited"] = self.case_citation_pattern.findall(text)
        
        # Deduplicate
        for key in entities:
            entities[key] = list(set(entities[key]))[:20]
        
        return entities

if __name__ == "__main__":
    parser = LegalParser()
    result = parser.parse_json("data/processed/download_1.json")
    print("Parser ready:", result)

