import os
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Constants
PROCESSED_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'processed')

def get_subject_area(text):
    """
    Determines the primary subject area of a case based on its text.
    This is a placeholder for a more sophisticated classification model.
    """
    # Placeholder logic
    if "constitution" in text.lower():
        return "Constitutional"
    elif "criminal" in text.lower():
        return "Criminal"
    elif "civil" in text.lower():
        return "Civil"
    else:
        return "Other"

def enrich_metadata():
    """
    Enriches the processed JSON files with additional metadata.
    """
    for filename in os.listdir(PROCESSED_DATA_DIR):
        if filename.endswith('.json'):
            filepath = os.path.join(PROCESSED_DATA_DIR, filename)
            
            with open(filepath, 'r+') as f:
                data = json.load(f)

                # Add subject area tag
                data['subject_tags'] = [get_subject_area(data['full_judgment_text'])]
                
                # Add year
                # This would be properly extracted from the judgment date
                data['year'] = "Unknown" 

                # Add bench strength
                data['bench_strength'] = "Unknown"

                # Add case status
                data['case_status'] = "good_law" # Default status

                # Add relationships (placeholder)
                data['cited_cases'] = []
                data['citing_cases'] = []

                # Go back to the beginning of the file to overwrite
                f.seek(0)
                json.dump(data, f, indent=4)
                f.truncate()

            logging.info(f"Enriched metadata for: {filename}")

if __name__ == "__main__":
    enrich_metadata()
