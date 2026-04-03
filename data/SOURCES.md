# Supreme Court of India Judgments Dataset Sources

## Source Decision
**Primary Free Source:** Supreme Court of India official website ([sci.gov.in](https://sci.gov.in)) 
- Coverage: All judgments from 1950 to present (2025), including Constitutional Bench, Division Benches (Civil, Criminal, all divisions).
- Format: PDF downloads via search/browse by year/party name.
- Licensing: Public domain (government judgments, no restrictions for research/non-commercial use).

**Secondary Free Sources:**
- [indiankanoon.org](https://indiankanoon.org): Free search/API (limited rate), full texts/HTML.
- [judgments.ecourts.gov.in](https://judgments.ecourts.gov.in): Supplementary.

**Licensed/Paid (Not Used for MVP):**
- SCC Online, Manupatra, AIR Online: Comprehensive but subscription required (~₹50k+/year).

## Acquisition Method
- **Scripted Bulk Download:** `scripts/download_sci.py` (planned) uses requests/BeautifulSoup to:
  1. Browse sci.gov.in by year (1950-2025).
  2. Search/download PDFs for all cases.
  3. Rate-limited (1 req/sec), respects robots.txt.
- Existing: Local archive `data/archive (1)/supreme_court_judgments/` (year-wise PDFs).
- Ingestion: `scripts/ingest_raw.py` copies to `data/raw/`, dedupes by hash.
- Processing: `judgementcopy_management_system/` pipeline → `data/processed/` JSON.

## Legal/Licensing Constraints
- Public domain: Free for analysis (cite source).
- Ethical scraping: Rate-limits, no overload servers.
- No resale/commercial bulk distribution.
- Coverage Confirmation: Parse benches (Constitutional: 5+ judges; Civil/Criminal via tags/subjects).

## Estimated Size
- ~1.5L+ judgments (1950-2025).
- Storage: ~50-100 GB raw PDFs.

Updated: $(date)
