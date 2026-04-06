import logging
from loguru import logger

# Configure loguru
logger.add("logs/app_{time}.log", rotation="10 MB")

logging.basicConfig(level=logging.INFO)
logger.info("Logger configured")

