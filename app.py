from flask import Flask, send_from_directory, render_template, request, jsonify, session, redirect, url_for
from authlib.integrations.flask_client import OAuth
from pipeline import handle_pipeline_post
from tracker import handle_tracker_post
from config import supabase
import os
import pandas as pd
from dotenv import load_dotenv
from functools import wraps
import logging
# Removed OpenAI client initialization from app.py
# import time
from datetime import timedelta

# Import the chatbot blueprint
from chatbot import chat_bp

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", os.urandom(24))
app.config['SESSION_TYPE'] = 'filesystem'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)  # Session lasts for 1 day
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Authlib OAuth setup
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=os.environ.get('GOOGLE_CLIENT_ID'),
    client_secret=os.environ.get('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email'},
)

# Initialize OpenAI client is now in chatbot.py
# client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

# Login required decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'google_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/login')
def login():
    session['init'] = True
    redirect_uri = url_for('authorized', _external=True)
    if '127.0.0.0.1' in redirect_uri:
        redirect_uri = redirect_uri.replace('127.0.0.1', 'localhost')
    logger.info(f"Redirect URI: {redirect_uri}")
    logger.info(f"Session before redirect: {session}")
    # Ensure session is committed before redirect
    session.modified = True
    response = google.authorize_redirect(redirect_uri)
    logger.info(f"Set-Cookie header in /login response: {response.headers.get('Set-Cookie', 'Not set')}")
    return response

@app.route('/login/authorized')
def authorized():
    try:
        logger.info(f"Session on callback: {session}")
        logger.info(f"Request args: {request.args}")
        logger.info(f"Request headers: {request.headers}")
        # Validate state
        stored_state = session.get('google_state')
        received_state = request.args.get('state')
        logger.info(f"Stored state: {stored_state}, Received state: {received_state}")
        if stored_state != received_state:
            logger.error(f"CSRF Warning! State mismatch: stored={stored_state}, received={received_state}")
            return "Authorization failed: mismatching_state: CSRF Warning! State not equal in request and response.", 400
        token = google.authorize_access_token()
        user_info = google.get('userinfo').json()
        logger.info(f"User info: {user_info}")
        session['google_id'] = user_info['sub']
        session['email'] = user_info['email']
        try:
            supabase.table('users').upsert({
                'id': session['google_id'],
                'email': session['email'],
                'last_login': pd.to_datetime('now').isoformat()
            }).execute()
        except Exception as e:
            logger.error(f"Error storing user in Supabase: {e}")
        return redirect(url_for('home'))
    except Exception as e:
        logger.error(f"Authorization error: {e}")
        return f"Authorization failed: {str(e)}", 400

@app.route('/logout')
def logout():
    session.pop('google_id', None)
    session.pop('email', None)
    return redirect(url_for('home'))

@app.route('/videos/<path:filename>')
def serve_video(filename):
    return send_from_directory('public/videos', filename)

@app.route('/')
def home():
    return render_template('index.html')

# Removed catch_all route that interfered with blueprints
# @app.route('/<path:path>')
# def catch_all(path):
#     if path and not path.endswith('.mp4'):
#         return app.send_static_file(path) or "Page not found", 404
#     return "Not a static file", 404

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/case-studies')
def case_studies():
    return render_template('case_studies.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/booking')
def booking():
    return render_template('booking.html')

@app.route('/pipeline-estimator', methods=['GET', 'POST'])
# @login_required  # Commented out for development
def pipeline_estimator():
    if request.method == 'POST':
        return handle_pipeline_post()
    return render_template('pipeline_estimator.html')

@app.route('/construction-tracker', methods=['GET', 'POST'])
def construction_tracker():
    if request.method == 'POST':
        return handle_tracker_post()
    else:  # GET request
        return render_template('construction_tracker.html')

@app.route('/struct-wise', methods=['GET', 'POST'])
# @login_required  # Commented out for development
def struct_wise():
    if request.method == 'POST':
        # Handle file upload and analysis here
        return jsonify({"message": "Analysis completed"})
    return render_template('struct_wise.html')

# Removed chatbot routes from app.py
# @app.route('/chatbot', methods=['POST'])
# def chatbot():
#     ...

# @app.route('/get-chat-history')
# def get_chat_history():
#     ...

@app.route('/team')
def team():
    return render_template('team.html')

# Register the chatbot blueprint
app.register_blueprint(chat_bp)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5006)