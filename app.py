# app.py

from flask import Flask, request, jsonify, render_template
import os, logging
from dotenv import load_dotenv

# Make sure your tracker.py defines BOTH of these:
#   def handle_tracker_post(...):
#   def handle_progress_post(...):
from tracker import handle_tracker_post, handle_progress_post  

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, template_folder='templates', static_folder='static')
app.secret_key = os.environ.get("FLASK_SECRET_KEY", os.urandom(24))


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/pipeline-estimator', methods=['GET', 'POST'])
def pipeline_estimator():
    from pipeline import handle_pipeline_post
    if request.method == 'POST':
        return handle_pipeline_post()
    return render_template('pipeline_estimator.html')


# ← Only one decorator for /construction-tracker, handling BOTH GET and POST:
@app.route('/construction-tracker', methods=['GET', 'POST'])
def construction_tracker():
    if request.method == 'POST':
        return handle_tracker_post()
    return render_template('construction_tracker.html')


# This is the single POST-only endpoint for “Analyze Progress (S-Curves)”
@app.route('/construction-tracker-progress', methods=['POST'])
def construction_tracker_progress():
    return handle_progress_post()


@app.route('/struct-wise', methods=['GET', 'POST'])
def struct_wise():
    if request.method == 'POST':
        return jsonify({"message": "Analysis completed"})
    return render_template('struct_wise.html')


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


@app.route('/team')
def team():
    return render_template('team.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5006)
