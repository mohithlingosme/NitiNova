import re

def parse_citation(text: str):
    # Parse SCC (2020) 1 SCC 123
    pattern = r'\((\d{4})\)\s*(\d+)\s*(SCC|AIR|CriLJ)'
    matches = re.findall(pattern, text)
    return matches

