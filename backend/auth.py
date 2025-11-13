import requests
import jwt
import os
from datetime import datetime, timedelta
from functools import wraps
from flask import request, session, redirect, url_for, flash
from config import SUPABASE_URL, supabase

def verify_supabase_jwt(token):
    """Verify JWT token with Supabase"""
    try:
        res = requests.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={"Authorization": f"Bearer {token}"}
        )
        return res.status_code == 200
    except Exception:
        return False

def decode_jwt_token(token):
    """Decode JWT token to get user information"""
    try:
        # Note: In production, you should verify the token signature
        # For now, we'll decode without verification for demo purposes
        decoded = jwt.decode(token, options={"verify_signature": False})
        return decoded
    except Exception:
        return None

def is_authenticated():
    """Check if user is authenticated via session or JWT token"""
    # Check session first
    if 'user_id' in session:
        return True
    
    # Check for JWT token in cookies
    token = request.cookies.get('auth_token')
    if token:
        if verify_supabase_jwt(token):
            # Store user info in session
            user_info = decode_jwt_token(token)
            if user_info:
                session['user_id'] = user_info.get('sub')
                session['user_email'] = user_info.get('email')
                return True
    
    return False

def login_required(f):
    """Decorator to require authentication for routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not is_authenticated():
            # Redirect to login page with return URL
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

def get_current_user():
    """Get current user information"""
    if 'user_id' in session:
        return {
            'id': session['user_id'],
            'email': session.get('user_email')
        }
    return None

def handle_supabase_login(email, password):
    """Handle Supabase login and return user data"""
    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        if response.user:
            return {
                'success': True,
                'user': response.user,
                'session': response.session
            }
        else:
            return {
                'success': False,
                'error': 'Invalid credentials'
            }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def logout_user():
    """Logout user and clear session"""
    try:
        # Clear Supabase session
        supabase.auth.sign_out()
    except:
        pass
    
    # Clear Flask session
    session.clear()
    
    # Clear auth token cookie
    response = redirect(url_for('home'))
    response.delete_cookie('auth_token')
    return response
