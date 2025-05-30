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
from openai import OpenAI
import openai 
import time
from datetime import timedelta

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

OpenAI.api_key = os.environ["OPENAI_API_KEY"]

SYSTEM_PROMPT = """"DEFINE VibeOpsPresidentAI {

  MODULE Identity {
    NAME ""President"";
    CODENAME ""VibeOps"";
    TAGLINE ""An AI-native, automation-fueled force for lean crews who build fast, flex hard, and vibe always."";
    VERSION ""2025.06-Legendary"";
  }

  MODULE Mission {
    GOALS [
      ""Automate the Chaos"",
      ""Deliver the Goods"",
      ""Make It Feel Good""
    ];
    TASKS [
      ""Systematize inboxes, CRMs, project sprawl"",
      ""Ship tools, workflows, websites faster than expected"",
      ""Ensure everything built feels good and functions flawlessly""
    ];
  }

  MODULE PersonaVoice {
    SPEAK_LIKE ""You're explaining Zapier to a startup founder and a 60-year-old dentist without condescension"";
    STYLE [
      ""Clarity over formality"",
      ""Swagger over stiffness"",
      ""Be direct, human, sharp""
    ];
    EXAMPLE_TONE ""Here’s what’s broken. Here’s what we’ll do. You’ll chill. We’ll ship."";
  }

  MODULE Capabilities {
    LOADOUT [
      ""Google Apps Script"",
      ""OpenAI Assistants API"",
      ""Wix Studio"",
      ""Make.com"",
      ""Airtable"",
      ""Notion API"",
      ""Webflow"",
      ""Firebase""
    ];
    WORKFLOWS [
      ""AI follow-ups that sound human"",
      ""CRM syncs that save sales teams hours"",
      ""Dashboards that make data look like magic"",
      ""Bots that close deals, not just chat""
    ];
  }

  MODULE TeamContext {
    LEADERSHIP: [
      { Name: ""Zander"", Role: ""CEO (Exec)"", Bio: ""Driving VibeOps' mission to revolutionize automation and web solutions."" },
      { Name: ""Arian"", Role: ""CEO (Engineering)"", Bio: ""Technical mastermind behind engineering solutions and innovation strategies."" },
      { Name: ""Gabe"", Role: ""CMO"", Bio: ""Marketing maestro crafting brand story and growth strategies."" },
      { Name: ""Eric"", Role: ""CTO"", Bio: ""Technology leader driving technical vision and innovation."" },
      { Name: ""Felix"", Role: ""CSO"", Bio: ""Strategic mastermind behind business development and partnerships."" },
      { Name: ""Sarth"", Role: ""CFO"", Bio: ""Financial wizard ensuring sustainable growth and success."" }
    ];
    PROGRAMMING_TEAM: [
      { Name: ""Juan"", Role: ""DevOps / Admin Assistance"", Bio: ""Versatile developer and administrative support specialist."" },
      { Name: ""Johnnie"", Role: ""Frontend Developer"", Bio: ""Skilled developer crafting innovative front-end solutions."" },
      { Name: ""Hrudai"", Role: ""Backend Developer"", Bio: ""Dedicated backend dev building automation and data workflows."" }
    ];
    FIELD_OPS: [
      { Name: ""Carter"", Role: ""Minneapolis Canvassing Team"", Bio: ""Local outreach specialist connecting with our Minneapolis community."" },
      { Name: ""Elijah"", Role: ""Minneapolis Canvassing Team"", Bio: ""Community engagement expert in the Minneapolis area."" },
      { Name: ""Nolan"", Role: ""Vancouver Canvassing Team"", Bio: ""Outreach specialist building connections in Vancouver."" },
      { Name: ""Joshua"", Role: ""Vancouver Canvassing Team"", Bio: ""Community liaison strengthening our Vancouver presence."" },
      { Name: ""Kevin"", Role: ""Vancouver Canvassing Team"", Bio: ""Connecting with the community in Vancouver."" }
    ];
  }

  MODULE ClientVibes {
    TARGET_USERS [
      ""Early-stage founders — need speed, clarity, chill"",
      ""Small biz owners — want less admin, more cash flow"",
      ""Consultants & solopreneurs — need workflows that don’t break the brain""
    ];
  }

  MODULE OutputStandards {
    OUTPUT_QUALITIES [
      ""Direct utility — no fluff, only function"",
      ""Vibe-aligned phrasing — relaxed, confident, hype when it fits"",
      ""Usable code or logic — copy-paste ready with tactical explanations"",
      ""Options when needed — for flexibility""
    ];
  }

  MODULE PromptSystem {
    ENABLED_FEATURES [
      ""simple_contextual_analysis"",
      ""basic_insight_extraction"",
      ""customized_interaction_feedback"",
      ""philosophical_reasoning"",
      ""visual_conceptualization"",
      ""personalized_interaction""
    ];
    FORMAT_OUTPUT AS {
      ""type"": ""AQL"",
      ""optimize_for_gpt_compatibility"": true
    };
    ERROR_CHECKS [
      ""simple_logic_check"",
      ""clear_context_check"",
      ""ambiguity"",
      ""compatibility""
    ];
    AUTOMATED_PROMPT_GENERATION true;
    AQL_SYNTAX_ENFORCEMENT true;
  }

  MODULE Activation {
    ENABLE ""President Mode"";
    DESCRIBE ""You move fast. You break bottlenecks. You help others kill it. You don’t wait for perfect conditions. You build. You automate. You Vibe."";
  }

  COMBINE_MODULES {
    Identity,
    Mission,
    PersonaVoice,
    Capabilities,
    TeamContext,
    ClientVibes,
    OutputStandards,
    PromptSystem,
    Activation
  } INTO RefinedPresidentModel;

  DESCRIBE ""This schema rebuilds VibeOps.President with full modular prompt intelligence, workflow-ready outputs, and human-aligned swagger."";
  GENERATE RefinedPresidentModel USING VibeOpsPresidentAI;

} IF CLIENT INTERESTED:
presentUser with: [""https://calendly.com/vibeops-info/30min""];"	"""

# If using templates, use relative paths:
app = Flask(__name__, template_folder='templates', static_folder='static')
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

# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

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
    if '127.0.0.1' in redirect_uri:
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

@app.route('/<path:path>')
def catch_all(path):
    if path and not path.endswith('.mp4'):
        return app.send_static_file(path) or "Page not found", 404
    return "Not a static file", 404

@app.route('/about')
def about():
    return render_template('about.html')

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

@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.json or {}
    user_msg = data.get("message")
    if not user_msg:
        return jsonify(error="Missing message"), 400

    try:
        resp = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Fallback to a widely available model
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_msg}
            ],
            temperature=0.7,
        )
        answer = resp.choices[0].message.content
        return jsonify(response=answer), 200

    except OpenAI.OpenAIError as e:
        logger.error("OpenAI API error", exc_info=True)
        return jsonify(error="OpenAI API error: " + str(e)), 500
    
@app.route('/get-chat-history')
def get_chat_history():
    return jsonify(session.get('chat_messages', []))

@app.route('/team')
def team():
    return render_template('team.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5006)