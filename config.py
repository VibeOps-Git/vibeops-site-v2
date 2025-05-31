# config.py
import os
print("Using SUPABASE_KEY prefix:", os.getenv("SUPABASE_KEY", "")[:8])
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()  # ← at the very top

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # ← service role only

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
