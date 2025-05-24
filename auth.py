import requests
from config import SUPABASE_URL

def verify_supabase_jwt(token):
    try:
        res = requests.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={"Authorization": f"Bearer {token}"}
        )
        return res.status_code == 200
    except Exception:
        return False
