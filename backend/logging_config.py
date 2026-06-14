import logging 
import sys 

def setup_logging():
    
    log_format = "%(asctime)s | %(levelname)-8s | %(name)-20s | %(message)s"
    date_format = "%Y-%m-%d %H:%M:%S"
    
    logging.basicConfig(level = logging.INFO,format = log_format, datefmt=date_format, handlers=[logging.StreamHandler(sys.stdout)])
    
    
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("urllib3").setLevel(logging.WARNING)
    logging.getLogger("groq").setLevel(logging.WARNING)
    