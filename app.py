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

# Helper function to check if user is admin
def is_admin(user_email):
    return user_email and user_email.endswith('@vibeops.ca')

# Add context processor to make auth status available in templates
@app.context_processor
def inject_auth_status():
    current_user = get_current_user()
    return {
        'is_authenticated': is_authenticated(),
        'current_user': current_user,
        'is_admin': is_admin(current_user.get('email') if current_user else None)
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
        
        rating = request.form.get('rating')
        review_text = request.form.get('review_text')
        
        if not rating or not review_text:
            flash('Please fill in all required fields', 'error')
            return render_template('reviews.html')
        
        try:
            # Store review submission in moderation queue
            from config import supabase
            result = supabase.table('review_submissions').insert({
                'user_id': session.get('user_id'),
                'user_email': session.get('user_email'),
                'rating': int(rating),
                'review_text': review_text,
                'status': 'pending'
            }).execute()
            
            flash('Thank you! Your review has been submitted and is pending approval.', 'success')
            return redirect(url_for('reviews'))
            
        except Exception as e:
            flash('Error submitting review. Please try again.', 'error')
            logger.error(f"Error submitting review: {e}")
            return render_template('reviews.html')
    
    # GET request - display approved reviews
    try:
        from config import supabase
        result = supabase.table('reviews').select('*').order('created_at', desc=True).execute()
        reviews_list = result.data if result.data else []
    except Exception as e:
        logger.error(f"Error fetching reviews: {e}")
        reviews_list = []
    
    return render_template('reviews.html', reviews=reviews_list)

@app.route('/reviews/pending')
@login_required
def pending_reviews():
    # Check if user is admin (any @vibeops.ca email)
    current_user = get_current_user()
    if not current_user or not is_admin(current_user.get('email')):
        flash('Access denied. Admin privileges required.', 'error')
        return redirect(url_for('reviews'))
    
    try:
        from config import supabase
        result = supabase.table('review_submissions').select('*').eq('status', 'pending').order('created_at', desc=True).execute()
        pending_reviews = result.data if result.data else []
    except Exception as e:
        logger.error(f"Error fetching pending reviews: {e}")
        pending_reviews = []
    
    return render_template('pending_reviews.html', pending_reviews=pending_reviews)

@app.route('/reviews/approve/<review_id>', methods=['POST'])
@login_required
def approve_review(review_id):
    current_user = get_current_user()
    if not current_user or not is_admin(current_user.get('email')):
        flash('Access denied. Admin privileges required.', 'error')
        return redirect(url_for('reviews'))
    
    try:
        from config import supabase
        
        # Get the submission
        submission_result = supabase.table('review_submissions').select('*').eq('id', review_id).execute()
        if not submission_result.data:
            flash('Review not found.', 'error')
            return redirect(url_for('pending_reviews'))
        
        submission = submission_result.data[0]
        
        # Move to approved reviews
        supabase.table('reviews').insert({
            'user_id': submission['user_id'],
            'user_email': submission['user_email'],
            'rating': submission['rating'],
            'review_text': submission['review_text']
        }).execute()
        
        # Update submission status
        supabase.table('review_submissions').update({'status': 'approved'}).eq('id', review_id).execute()
        
        flash('Review approved successfully!', 'success')
        
    except Exception as e:
        flash('Error approving review. Please try again.', 'error')
        logger.error(f"Error approving review: {e}")
    
    return redirect(url_for('pending_reviews'))

@app.route('/reviews/reject/<review_id>', methods=['POST'])
@login_required
def reject_review(review_id):
    current_user = get_current_user()
    if not current_user or not is_admin(current_user.get('email')):
        flash('Access denied. Admin privileges required.', 'error')
        return redirect(url_for('reviews'))
    
    rejection_reason = request.form.get('rejection_reason', 'No reason provided')
    
    try:
        from config import supabase
        
        # Update submission status with rejection reason
        supabase.table('review_submissions').update({
            'status': 'rejected',
            'rejection_reason': rejection_reason
        }).eq('id', review_id).execute()
        
        flash('Review rejected successfully!', 'success')
        
    except Exception as e:
        flash('Error rejecting review. Please try again.', 'error')
        logger.error(f"Error rejecting review: {e}")
    
    return redirect(url_for('pending_reviews'))

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

if __name__ == '__main__':
    # Use PORT env variable for Railway, default to 5006 locally
    port = int(os.environ.get('PORT', 5006))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
