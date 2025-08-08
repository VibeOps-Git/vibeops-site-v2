# app.py

from flask import Flask, request, jsonify, render_template, session, redirect, url_for, flash, make_response, send_file
import os, logging
from dotenv import load_dotenv
from datetime import datetime

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

@app.route('/robots.txt')
def serve_robots():
    return send_file('robots.txt', mimetype='text/plain')

@app.route('/llms.txt')
def serve_llms():
    return send_file('llms.txt', mimetype='text/plain')

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
        
        logger.info(f"Raw result from Supabase: {result}")
        logger.info(f"Reviews data: {reviews_list}")
        logger.info(f"Number of reviews: {len(reviews_list)}")
        
        # Convert created_at strings to datetime objects
        for review in reviews_list:
            if review.get('created_at') and isinstance(review['created_at'], str):
                try:
                    review['created_at'] = datetime.fromisoformat(review['created_at'].replace('Z', '+00:00'))
                except ValueError:
                    # If parsing fails, keep as string
                    pass
        
        logger.info(f"Successfully fetched {len(reviews_list)} reviews")
    except Exception as e:
        logger.error(f"Error fetching reviews: {e}")
        logger.error(f"Error type: {type(e)}")
        reviews_list = []
    
    return render_template('reviews.html', reviews=reviews_list)

@app.route('/reviews/<int:review_id>/edit', methods=['GET', 'POST'])
def edit_review(review_id):
    if not is_authenticated():
        flash('You must be logged in to edit reviews', 'error')
        return redirect(url_for('login', next=url_for('reviews')))
    
    try:
        from config import supabase
        
        if request.method == 'POST':
            reviewer_name = request.form.get('reviewer_name')
            review_text = request.form.get('review_text')
            
            if not reviewer_name or not review_text:
                flash('Please fill in all required fields', 'error')
                return redirect(url_for('edit_review', review_id=review_id))
            
            # Update the review
            result = supabase.table('reviews').update({
                'reviewer_name': reviewer_name,
                'review_text': review_text
            }).eq('id', review_id).execute()
            
            flash('Review updated successfully!', 'success')
            return redirect(url_for('reviews'))
        
        # GET request - show edit form
        result = supabase.table('reviews').select('*').eq('id', review_id).execute()
        if not result.data:
            flash('Review not found', 'error')
            return redirect(url_for('reviews'))
        
        review = result.data[0]
        return render_template('edit_review.html', review=review)
        
    except Exception as e:
        flash(f'Error editing review: {str(e)}', 'error')
        logger.error(f"Error editing review: {e}")
        return redirect(url_for('reviews'))

@app.route('/reviews/<int:review_id>/delete', methods=['POST'])
def delete_review(review_id):
    logger.info(f"Delete review called for review_id: {review_id}")
    logger.info(f"User authenticated: {is_authenticated()}")
    logger.info(f"Request method: {request.method}")
    logger.info(f"Request form data: {request.form}")
    
    if not is_authenticated():
        flash('You must be logged in to delete reviews', 'error')
        return redirect(url_for('login', next=url_for('reviews')))
    
    try:
        from config import supabase
        
        # First check if the review exists
        check_result = supabase.table('reviews').select('id').eq('id', review_id).execute()
        logger.info(f"Check result: {check_result}")
        
        if not check_result.data:
            flash('Review not found', 'error')
            logger.error(f"Review with id {review_id} not found")
            return redirect(url_for('reviews'))
        
        # Delete the review
        result = supabase.table('reviews').delete().eq('id', review_id).execute()
        logger.info(f"Delete result: {result}")
        
        flash('Review deleted successfully!', 'success')
        return redirect(url_for('reviews'))
        
    except Exception as e:
        flash(f'Error deleting review: {str(e)}', 'error')
        logger.error(f"Error deleting review: {e}")
        logger.error(f"Error type: {type(e)}")
        return redirect(url_for('reviews'))

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

@app.route('/ai-report-generator', methods=['GET', 'POST'])
def ai_report_generator():
    """VibeOps-branded AI-powered report generator"""
    if request.method == 'POST':
        try:
            from werkzeug.utils import secure_filename
            logo = request.files.get('logo_file')
            logo_path = None
            if logo and logo.filename:
                filename = secure_filename(logo.filename)
                upload_dir = os.path.join(app.root_path, 'tmp')
                os.makedirs(upload_dir, exist_ok=True)
                logo_path = os.path.join(upload_dir, filename)
                logo.save(logo_path)
                
            report_type = request.form.get('report_type')
            company_name = request.form.get('company_name')
            project_context = request.form.get('project_context', '')
            if not report_type or not company_name:
                flash('Please fill in all required fields', 'error')
                return render_template('ai_report_generator.html')
            from ai_report_generator import create_vibeops_report
            filename = create_vibeops_report(
                report_type=report_type,
                company_name=company_name,
                project_context=project_context,
                logo_path=logo_path
            )
            return send_file(
                filename,
                as_attachment=True,
                download_name=filename,
                mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            )
        except Exception as e:
            flash(f'Error generating report: {str(e)}', 'error')
            logger.error(f"Error generating VibeOps report: {e}")
            return render_template('ai_report_generator.html')
    return render_template('ai_report_generator.html')

@app.route('/generate-sample-reports')
def generate_sample_reports():
    """Generate sample reports for demonstration"""
    try:
        from ai_report_generator import generate_sample_reports
        generated_files = generate_sample_reports()
        
        # Create a zip file with all generated reports
        import zipfile
        import tempfile
        
        zip_filename = f'sample_reports_{datetime.now().strftime("%Y%m%d_%H%M%S")}.zip'
        
        with zipfile.ZipFile(zip_filename, 'w') as zipf:
            for file_info in generated_files:
                zipf.write(file_info['filename'], file_info['filename'])
        
        return send_file(
            zip_filename,
            as_attachment=True,
            download_name=zip_filename,
            mimetype='application/zip'
        )
        
    except Exception as e:
        flash(f'Error generating sample reports: {str(e)}', 'error')
        logger.error(f"Error generating sample reports: {e}")
        return redirect(url_for('ai_report_generator'))

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/roof-demo')
def roofdemo():
    return render_template('roof-demo.html')

# ─── ROOF ESTIMATOR LOGIC (import from roof.py) ──────────
from roof import price_roof, validate_address, calculate_roof_cost
app.add_url_rule('/price', view_func=price_roof, methods=['POST'])

@app.route('/case-studies')
def case_studies():
    return render_template('case_studies.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/booking')
def booking():
    return render_template('booking.html')

@app.route('/lead-algo')
def algodemo():
    return render_template('lead_demo.html')

@app.route('/seo-algo')
def seodemo():
    return render_template('seo_demo.html')

@app.route('/team')
def team():
    return render_template('team.html')

import reportly
@app.route("/reportly", methods=["GET", "POST"])
def reportly_home():
    if request.method == "POST":
        return reportly.handle_upload()
    return reportly.render_template("reportly.html", state=None)

@app.route("/reportly/edit/<doc_id>", methods=["GET"])
def reportly_edit(doc_id):
    # read-only (no longer POST form here) — chat drives updates
    return reportly.handle_edit(doc_id)

@app.route("/reportly/compose/<doc_id>", methods=["POST"])
def reportly_compose(doc_id):
    return reportly.handle_compose(doc_id)

@app.route("/reportly/download/<doc_id>", methods=["GET"])
def reportly_download(doc_id):
    return reportly.handle_download(doc_id)

@app.route("/reportly/preview/<doc_id>", methods=["GET"])
def reportly_preview(doc_id):
    return reportly.handle_preview(doc_id)

@app.route("/reportly/state/<doc_id>", methods=["POST"])
def reportly_state_update(doc_id):
    return reportly.handle_state_update(doc_id)

@app.route("/reportly/chat/<doc_id>", methods=["POST"])
def reportly_chat(doc_id):
    return reportly.handle_chat(doc_id)


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

@app.route('/debug/test-delete/<int:review_id>')
def debug_test_delete(review_id):
    """Debug route to test delete operation"""
    if not is_authenticated():
        return jsonify({'error': 'Not authenticated'}), 401
    
    try:
        from config import supabase
        
        # Check if review exists
        check_result = supabase.table('reviews').select('id, reviewer_name').eq('id', review_id).execute()
        
        if not check_result.data:
            return jsonify({'error': 'Review not found'}), 404
        
        # Try to delete
        delete_result = supabase.table('reviews').delete().eq('id', review_id).execute()
        
        return jsonify({
            'success': True,
            'message': 'Review deleted successfully',
            'review_id': review_id,
            'delete_result': str(delete_result)
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'error_type': str(type(e))
        }), 500

if __name__ == '__main__':
    # Use PORT env variable for Railway, default to 5006 locally
    port = int(os.environ.get('PORT', 5008))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
