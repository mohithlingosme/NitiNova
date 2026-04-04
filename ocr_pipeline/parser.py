"""
Clean parser - syntax fixed.
"""
import re

def parse_judgment(text: str):
    """
    Parse judgment text.
    """
    stripped = text.strip()  # Fixed undefined stripped
    sections = {
        'facts': re.search(r'Facts[:\\s]*(.*?)(?=Issue|Ratio|$)', stripped, re.DOTALL | re.IGNORECASE),
        'issues': re.search(r'Issue[:\\s]*(.*?)(?=Ratio|Held|$)', stripped, re.DOTALL | re.IGNORECASE),
        'ratio': re.search(r'(Ratio|Held)[:\\s]*(.*?)(?=Costs|$)', stripped, re.DOTALL | re.IGNORECASE),
    }
    return sections

print("Parser loaded successfully")
