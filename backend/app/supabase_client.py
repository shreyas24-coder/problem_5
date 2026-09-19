import logging
from typing import Optional
from supabase import create_client, Client
from app.config import settings

logger = logging.getLogger("app.supabase")

_client: Optional[Client] = None

def get_supabase_client() -> Client:
    """Returns the singleton Supabase client initialized with credentials from settings."""
    global _client
    if _client is None:
        raw_url = settings.SUPABASE_URL
        key = settings.SUPABASE_SERVICE_KEY.strip() if settings.SUPABASE_SERVICE_KEY else ""
        if not raw_url or not key:
            raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be configured in .env")
        url = raw_url.replace("/rest/v1/", "").replace("/rest/v1", "").rstrip("/")
        _client = create_client(url, key)
        logger.info(f"Connected to Supabase at {url}")
    return _client

# Reusable client proxy
supabase: Client = get_supabase_client()
