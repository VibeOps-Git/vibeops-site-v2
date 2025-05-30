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
import json
import plotly.graph_objects as go
from plotly.utils import PlotlyJSONEncoder

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

# ─── STATIC GANTT CHART ROUTE ───────────────────────────────
@app.route('/static-gantt-chart')
def static_gantt_chart():
    # Gantt chart data (copied from provided app.py)
    gantt_data = [
        # Mobilization and Site Preparation Phase
        {"Task": "Site Mobilization", "Phase": "Mobilization and Site Preparation", "Start": "2025-05-01", "End": "2025-05-07", "Details": "Mobilization of equipment, traffic management, and site modifications."},
        {"Task": "Clearing Old Infrastructure", "Phase": "Mobilization and Site Preparation", "Start": "2025-05-08", "End": "2025-05-14", "Details": "Removal of outdated structures and debris."},
        {"Task": "Tree Relocation", "Phase": "Mobilization and Site Preparation", "Start": "2025-05-15", "End": "2025-05-20", "Details": "Relocate trees to designated areas."},

        # Demolition and Excavation Phase
        {"Task": "Remove Concrete Curb and Gutter", "Phase": "Demolition and Excavation", "Start": "2025-05-21", "End": "2025-05-30", "Details": "Remove existing concrete curbs and gutters along designated lanes."},
        {"Task": "Excavation and Grading for Turn Lanes", "Phase": "Demolition and Excavation", "Start": "2025-06-01", "End": "2025-06-10", "Details": "Excavate and grade for left-turn lane additions and multi-use pathways."},
        {"Task": "Install New Sanitary Sewer Line", "Phase": "Demolition and Excavation", "Start": "2025-06-11", "End": "2025-06-20", "Details": "Install 300mm diameter sanitary sewer line with proper cover."},

        # Roadwork Phase
        {"Task": "Concrete Curb and Gutter Installation", "Phase": "Roadwork", "Start": "2025-06-21", "End": "2025-07-01", "Details": "Install new concrete curbs and gutters."},
        {"Task": "Pathway Excavation, Grading, and Paving", "Phase": "Roadwork", "Start": "2025-07-02", "End": "2025-07-20", "Details": "Excavate, grade, and pave multi-use pathways on both sides."},
        {"Task": "Bioswales Excavation and Preparation", "Phase": "Roadwork", "Start": "2025-07-21", "End": "2025-07-30", "Details": "Excavate and prepare areas for bioswales and rain gardens."},
        {"Task": "Bioswales Planting and Soil Amendment", "Phase": "Roadwork", "Start": "2025-07-31", "End": "2025-08-05", "Details": "Plant vegetation and apply soil amendments in bioswales."},
        {"Task": "Asphalt Mill and Overlay", "Phase": "Roadwork", "Start": "2025-08-06", "End": "2025-08-20", "Details": "Mill and Overlay existing road with asphalt for final surfacing."},

        # Intersection and Lane Work Phase
        {"Task": "Reworking Intersections", "Phase": "Roadwork", "Start": "2025-08-21", "End": "2025-09-05", "Details": "Add left-turn lanes, pedestrian scramble crossings, and reconfigure intersections."},
        {"Task": "Markings and Signage", "Phase": "Roadwork", "Start": "2025-09-06", "End": "2025-09-12", "Details": "Install lane markings, signage, and scramble crossing markings."},

        # Traffic Signal Installation Phase
        {"Task": "Traffic Light Installation", "Phase": "Traffic Signal Installation", "Start": "2025-09-13", "End": "2025-09-20", "Details": "Install and configure traffic lights at designated intersections."},
        {"Task": "Pedestrian Walk Signals Installation", "Phase": "Traffic Signal Installation", "Start": "2025-09-21", "End": "2025-09-30", "Details": "Install pedestrian walk signals to enhance crosswalk safety."},

        # Final Landscaping and Inspection Phase
        {"Task": "Final Tree and Shrub Planting", "Phase": "Finalizing Project", "Start": "2025-10-01", "End": "2025-10-07", "Details": "Plant additional trees and shrubs for greenery."},
        {"Task": "Final Testing and Adjustments", "Phase": "Finalizing Project", "Start": "2025-10-08", "End": "2025-10-15", "Details": "Conduct safety tests, review functionality, and make final adjustments."},
    ]

    # Colors by phase (copied from provided app.py)
    phase_colors = {
        "Mobilization and Site Preparation": "#3498db",
        "Demolition and Excavation": "#e67e22",
        "Roadwork": "#2ecc71",
        "Traffic Signal Installation": "#9b59b6",
        "Finalizing Project": "#e74c3c",
    }

    # Convert data to DataFrame
    df = pd.DataFrame(gantt_data)

    # Sort tasks by Phase and Start date
    phase_order = {
        "Mobilization and Site Preparation": 1,
        "Demolition and Excavation": 2,
        "Roadwork": 3,
        "Traffic Signal Installation": 4,
        "Finalizing Project": 5,
    }
    df['Phase_Order'] = df['Phase'].map(phase_order)
    df = df.sort_values(by=['Phase_Order', 'Start'])

    # Calculate start dates and durations in milliseconds
    df['Start_ms'] = df['Start'].apply(lambda x: int(pd.to_datetime(x).timestamp() * 1000))
    df['End_ms'] = df['End'].apply(lambda x: int(pd.to_datetime(x).timestamp() * 1000))
    df['Duration_ms'] = df['End_ms'] - df['Start_ms']

    # Prepare hover text
    df['HoverText'] = df.apply(lambda row: f"<b>{row['Task']}</b><br>Phase: {row['Phase']}<br>Start: {row['Start']}<br>End: {row['End']}<br>Details: {row['Details']}", axis=1)

    # Map colors
    df['Color'] = df['Phase'].map(phase_colors)

    # Reorder tasks for y-axis to go from top-left to bottom-right
    df['Task_Order'] = range(len(df))
    df = df.sort_values(by=['Task_Order'], ascending=False)

    # Create the Plotly figure
    fig = go.Figure()

    fig.add_trace(go.Bar(
        x=df['Duration_ms'],
        y=df['Task'],
        base=df['Start_ms'],
        orientation='h',
        marker=dict(
            color=df['Color'],
            line=dict(width=1, color='rgba(0,0,0,0.5)')
        ),
        hovertext=df['HoverText'],
        hoverinfo='text',
    ))

    # Update layout with enhanced interactivity
    fig.update_layout(
        title=dict(
            text="Interactive Gantt Chart",
            font=dict(size=24, color='#003366', family='Arial, sans-serif'),
            x=0.5,
        ),
        xaxis=dict(
            title="Timeline",
            type="date",
            tickformat="%Y-%m-%d",
            rangeslider=dict(visible=True),
            showgrid=True,
        ),
        yaxis=dict(
            title="Tasks",
            automargin=True,
            categoryorder="array",
            categoryarray=df['Task'],
        ),
        dragmode="pan",
        hovermode="closest",
        height=600,
        showlegend=False,
         # Ensure Plotly background is white as per provided CSS
        plot_bgcolor='white',
        paper_bgcolor='white',
    )

    # Serialize the figure for Plotly.js
    gantt_chart_json = json.dumps(fig, cls=PlotlyJSONEncoder)

    # Render the new template, passing the chart data
    return render_template('static_gantt_chart.html', gantt_chart=gantt_chart_json)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5006)