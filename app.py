# app.py

from flask import Flask, request, jsonify, render_template, session, redirect, url_for, flash, make_response
import os, logging
from dotenv import load_dotenv

# Make sure your tracker.py defines BOTH of these:
#   def handle_tracker_post(...):
#   def handle_progress_post(...):
from tracker import handle_tracker_post, handle_progress_post  
from auth import (
    is_authenticated, login_required, get_current_user, 
    handle_supabase_login, logout_user
)

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, template_folder='templates', static_folder='static')
app.secret_key = os.environ.get("FLASK_SECRET_KEY", os.urandom(24))

# Add context processor to make auth status available in templates
@app.context_processor
def inject_auth_status():
    return {
        'is_authenticated': is_authenticated(),
        'current_user': get_current_user()
    }

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        if not email or not password:
            flash('Please provide both email and password', 'error')
            return render_template('login.html')
        
        result = handle_supabase_login(email, password)
        
        if result['success']:
            # Store user info in session
            session['user_id'] = result['user'].id
            session['user_email'] = result['user'].email
            
            # Set JWT token as cookie
            response = make_response(redirect(request.args.get('next', url_for('home'))))
            response.set_cookie('auth_token', result['session'].access_token, 
                              max_age=3600*24*7, httponly=True, secure=False)  # 7 days
            flash('Login successful!', 'success')
            return response
        else:
            flash(result['error'], 'error')
            return render_template('login.html')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    return logout_user()

@app.route('/reviews', methods=['GET', 'POST'])
def reviews():
    if request.method == 'POST':
        if not is_authenticated():
            flash('You must be logged in to submit a review', 'error')
            return redirect(url_for('login', next=url_for('reviews')))
        
        reviewer_name = request.form.get('reviewer_name')
        review_text = request.form.get('review_text')
        
        if not reviewer_name or not review_text:
            flash('Please fill in all required fields', 'error')
            return render_template('reviews.html')
        
        try:
            # Store review directly in public reviews table
            from config import supabase
            
            # First check if the table exists by trying to select from it
            try:
                test_result = supabase.table('reviews').select('id').limit(1).execute()
                logger.info("Reviews table exists and is accessible")
            except Exception as table_error:
                logger.error(f"Reviews table error: {table_error}")
                flash('Database table not accessible. Please contact support.', 'error')
                return render_template('reviews.html')
            
            result = supabase.table('reviews').insert({
                'reviewer_name': reviewer_name,
                'review_text': review_text
            }).execute()
            
            flash('Review added successfully!', 'success')
            return redirect(url_for('reviews'))
            
        except Exception as e:
            flash(f'Error adding review: {str(e)}', 'error')
            logger.error(f"Error adding review: {e}")
            logger.error(f"Error type: {type(e)}")
            logger.error(f"Review data: reviewer_name={reviewer_name}, review_text={review_text[:50]}...")
            return render_template('reviews.html')
    
    # GET request - display all reviews
    try:
        from config import supabase
        result = supabase.table('reviews').select('*').order('created_at', desc=True).execute()
        reviews_list = result.data if result.data else []
        logger.info(f"Successfully fetched {len(reviews_list)} reviews")
    except Exception as e:
        logger.error(f"Error fetching reviews: {e}")
        logger.error(f"Error type: {type(e)}")
        reviews_list = []
    
    return render_template('reviews.html', reviews=reviews_list)

# Public routes - no authentication required
@app.route('/pipeline-estimator', methods=['GET', 'POST'])
def pipeline_estimator():
    from pipeline import handle_pipeline_post
    if request.method == 'POST':
        return handle_pipeline_post()
    return render_template('pipeline_estimator.html')

@app.route('/construction-tracker', methods=['GET', 'POST'])
def construction_tracker():
    if request.method == 'POST':
        return handle_tracker_post()
    return render_template('construction_tracker.html')

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

@app.route('/debug/db-test')
def debug_db_test():
    """Debug route to test database connectivity"""
    try:
        from config import supabase
        # Test basic connection
        result = supabase.table('reviews').select('count').execute()
        return jsonify({
            'status': 'success',
            'message': 'Database connection successful',
            'table_exists': True
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e),
            'error_type': str(type(e)),
            'table_exists': False
        }), 500

if __name__ == '__main__':
    # Use PORT env variable for Railway, default to 5006 locally
    port = int(os.environ.get('PORT', 5006))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
