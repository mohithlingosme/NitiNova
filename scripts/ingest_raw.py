import os
import hashlib
import json
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Constants
RAW_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'raw')
LOG_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'ingestion_log.json')
SOURCE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'archive (1)', 'supreme_court_judgments')

def get_file_hash(filepath):
    """Computes the SHA256 hash of a file."""
    hasher = hashlib.sha256()
    with open(filepath, 'rb') as f:
        buf = f.read()
        hasher.update(buf)
    return hasher.hexdigest()

def log_ingestion(log_data):
    """Logs ingestion metadata to a JSON file."""
    if not os.path.exists(os.path.dirname(LOG_FILE)):
        os.makedirs(os.path.dirname(LOG_FILE))

    logs = []
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, 'r') as f:
            logs = json.load(f)
    
    logs.append(log_data)

    with open(LOG_FILE, 'w') as f:
        json.dump(logs, f, indent=4)

def validate_file(filepath):
    """Validates a file to ensure it's not empty."""
    if os.path.getsize(filepath) == 0:
        logging.warning(f"File is empty: {filepath}")
        return False
    return True

def ingest_raw_data():
    """
    Ingests raw data from the source directory into the raw data directory.
    """
    if not os.path.exists(RAW_DATA_DIR):
        os.makedirs(RAW_DATA_DIR)

    existing_hashes = set()
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, 'r') as f:
            logs = json.load(f)
            for log in logs:
                existing_hashes.add(log.get('file_hash'))

    for year in os.listdir(SOURCE_DIR):
        year_path = os.path.join(SOURCE_DIR, year)
        if os.path.isdir(year_path):
            for filename in os.listdir(year_path):
                if filename.endswith('.pdf'):
                    source_filepath = os.path.join(year_path, filename)
                    
                    if not validate_file(source_filepath):
                        continue

                    file_hash = get_file_hash(source_filepath)
                    if file_hash in existing_hashes:
                        logging.info(f"Skipping duplicate file: {filename}")
                        continue

                    destination_filepath = os.path.join(RAW_DATA_DIR, filename)
                    
                    # For simplicity, we'll just copy the file.
                    # In a real scenario, you might move it or handle it differently.
                    import shutil
                    shutil.copy2(source_filepath, destination_filepath)

                    # Extract metadata from filename (assuming a consistent format)
                    # This is a placeholder for actual citation extraction.
                    case_name = os.path.splitext(filename)[0]
                    citation = "Unknown" # Placeholder

                    log_data = {
                        'source_file': source_filepath,
                        'destination_file': destination_filepath,
                        'ingested_at': datetime.now().isoformat(),
                        'case_name': case_name,
                        'citation': citation,
                        'file_hash': file_hash
                    }

                    log_ingestion(log_data)
                    existing_hashes.add(file_hash)
                    logging.info(f"Ingested file: {filename}")

if __name__ == "__main__":
    ingest_raw_data()
