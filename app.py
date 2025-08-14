# app.py

from flask import Flask, request, jsonify, render_template, session, redirect, url_for, flash, make_response, send_file, Response, current_app
import os, logging
from dotenv import load_dotenv
from datetime import datetime
import uuid
import subprocess
import shutil

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
    # BAD: return reportly.render_template("reportly.html", state=None)
    return render_template("reportly.html", state=None)


@app.route("/reportly/download-current/<doc_id>", methods=["GET"])
def reportly_download_current(doc_id):
    return reportly.handle_download_current(doc_id)


@app.get("/reportly/stream/<doc_id>")
def reportly_stream(doc_id):
    # stream Server-Sent Events from reportly.sse_stream
    return Response(reportly.sse_stream(doc_id), mimetype="text/event-stream")

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

# app.py (near the other /reportly routes)
@app.route("/reportly/pending/<doc_id>", methods=["GET"])
def reportly_pending(doc_id):
    return reportly.handle_pending_list(doc_id)

@app.route("/reportly/review/<doc_id>/accept", methods=["POST"])
def reportly_accept(doc_id):
    return reportly.handle_review_accept(doc_id)

@app.route("/reportly/review/<doc_id>/reject", methods=["POST"])
def reportly_reject(doc_id):
    return reportly.handle_review_reject(doc_id)

@app.get("/reportly/structure/<doc_id>")
def reportly_structure_get(doc_id):
    return reportly.handle_structure_get(doc_id)


@app.route('/download')
def download():
    return render_template('downloads.html')


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

@app.post('/api/print/upload')
def api_print_upload():
    data = request.get_json(force=True, silent=True) or {}
    tree = data.get('tree', '')
    contents = data.get('contents', '')
    if not tree and not contents:
        return jsonify({"ok": False, "message": "No data"}), 400

    uid = str(uuid.uuid4())
    out_dir = os.path.join('outputs')
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f'{uid}_print.txt')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write("=== TREE ===\n")
        f.write(tree)
        f.write("\n\n=== CONTENTS ===\n")
        f.write(contents)

    return jsonify({"ok": True, "id": uid, "path": out_path, "message": "Saved"}), 200

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
    

# app.py (add)
from flask import request, jsonify, url_for  # drop current_app here

PACKAGES_DIR = os.path.join(app.root_path, "static", "downloads", "live")
BASES_DIR = os.path.join(app.root_path, "pack-bases")  # store base binaries here

os.makedirs(PACKAGES_DIR, exist_ok=True)

def make_payload_zip(out_zip_path, tree_text, contents_text, include_files=None, meta=None):
    with zipfile.ZipFile(out_zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("tree.txt", tree_text or "")
        z.writestr("contents.txt", contents_text or "")
        z.writestr("manifest.json", json.dumps(meta or {}, indent=2))
        for rel in include_files or []:
            # security: keep inside allowed dirs
            p = os.path.join(app.root_path, rel)
            if os.path.isfile(p):
                z.write(p, arcname=f"files/{os.path.basename(p)}")

@app.post("/api/print/package")
def build_user_package():
    data = request.get_json(force=True)
    tree = data.get("tree","")
    contents = data.get("contents","")
    include_files = data.get("include_files") or []
    want_exe = bool(data.get("want_exe", True))
    app_name = data.get("app_name", "Project Explorer")

    uid = str(uuid.uuid4())
    out_dir = os.path.join(PACKAGES_DIR, uid)
    os.makedirs(out_dir, exist_ok=True)

    payload = os.path.join(out_dir, "payload.zip")
    make_payload_zip(payload, tree, contents, include_files, {"id": uid, "built_at": datetime.datetime.utcnow().isoformat()})

    # make Windows SFX, mac .zip (or .dmg), linux .run/.zip
    urls = {}

    # WINDOWS SFX EXE
    try:
        exe = os.path.join(BASES_DIR, "windows", "Project Explorer.exe")    # prebuilt
        sfx = os.path.join(BASES_DIR, "windows", "7zS.sfx")                 # SFX stub (from 7-Zip)
        cfg = os.path.join(out_dir, "config.txt")
        archive = os.path.join(out_dir, "package.7z")
        out_exe = os.path.join(out_dir, f"{app_name.replace(' ','-')}-{uid}.exe")

        # create 7z archive with base exe + payload
        shutil.copy(exe, os.path.join(out_dir, "Project Explorer.exe"))
        shutil.copy(payload, os.path.join(out_dir, "payload.zip"))
        subprocess.check_call(["7z", "a", "-bd", "-mx=9", archive, "Project Explorer.exe", "payload.zip"], cwd=out_dir)

        # SFX config: pass --payload to exe on run
        with open(cfg, "w", encoding="utf-8") as f:
            f.write(r''';!@Install@!UTF-8!
Title=Project Explorer
GUIMode="2"
RunProgram="\"Project Explorer.exe\" --payload payload.zip"
;!@InstallEnd@!
''')
        # cat sfx + config + archive -> exe
        with open(out_exe, "wb") as out_f, \
             open(sfx, "rb") as sfx_f, \
             open(cfg, "rb") as cfg_f, \
             open(archive, "rb") as arc_f:
            out_f.write(sfx_f.read()); out_f.write(cfg_f.read()); out_f.write(arc_f.read())

        urls["windows_exe"] = url_for('static', filename=f"downloads/live/{uid}/{os.path.basename(out_exe)}", _external=False)
    except Exception as e:
        current_app.logger.warning(f"Windows EXE build failed: {e}")

    # MACOS: copy .app, drop payload in Resources, zip it
    try:
        app_src = os.path.join(BASES_DIR, "mac", "Project Explorer.app")
        app_dst = os.path.join(out_dir, "Project Explorer.app")
        if os.path.exists(app_dst):
            shutil.rmtree(app_dst)
        shutil.copytree(app_src, app_dst)
        res_dir = os.path.join(app_dst, "Contents", "Resources")
        os.makedirs(res_dir, exist_ok=True)
        shutil.copy(payload, os.path.join(res_dir, "payload.zip"))
        mac_zip = os.path.join(out_dir, f"{app_name.replace(' ','-')}-{uid}-mac.zip")
        subprocess.check_call(["/usr/bin/zip","-r","-y", mac_zip, "Project Explorer.app"], cwd=out_dir)
        urls["mac_zip"] = url_for('static', filename=f"downloads/live/{uid}/{os.path.basename(mac_zip)}", _external=False)
    except Exception as e:
        current_app.logger.warning(f"macOS ZIP build failed: {e}")

    # LINUX: makeself .run (or zip)
    try:
        base_bin = os.path.join(BASES_DIR, "linux", "Project Explorer")  # prebuilt onefile
        run_dir = os.path.join(out_dir, "linux_pkg")
        os.makedirs(run_dir, exist_ok=True)
        shutil.copy(base_bin, os.path.join(run_dir, "Project-Explorer"))
        shutil.copy(payload, os.path.join(run_dir, "payload.zip"))
        os.chmod(os.path.join(run_dir, "Project-Explorer"), 0o755)
        # create run script that launches with payload
        with open(os.path.join(run_dir, "run.sh"), "w") as f:
            f.write("#!/usr/bin/env bash\nDIR=$(cd \"$(dirname \"$0\")\" && pwd)\n\"$DIR/Project-Explorer\" --payload \"$DIR/payload.zip\"\n")
        os.chmod(os.path.join(run_dir, "run.sh"), 0o755)

        # If makeself is installed:
        out_run = os.path.join(out_dir, f"{app_name.replace(' ','-')}-{uid}.run")
        try:
            subprocess.check_call(["makeself", "--nox11", run_dir, out_run, "Project Explorer", "./run.sh"])
            urls["linux_run"] = url_for('static', filename=f"downloads/live/{uid}/{os.path.basename(out_run)}", _external=False)
        except Exception:
            # fallback: zip
            linux_zip = os.path.join(out_dir, f"{app_name.replace(' ','-')}-{uid}-linux.zip")
            subprocess.check_call(["zip","-r", linux_zip, "."], cwd=run_dir)
            urls["linux_zip"] = url_for('static', filename=f"downloads/live/{uid}/{os.path.basename(linux_zip)}", _external=False)
    except Exception as e:
        current_app.logger.warning(f"Linux build failed: {e}")

    # also return plain payload zip (some users may just want the bundle)
    urls["payload_zip"] = url_for('static', filename=f"downloads/live/{uid}/payload.zip", _external=False)
    return jsonify({"ok": True, "id": uid, **urls}), 200

    
import argparse, zipfile, tempfile, os, json

def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--payload", help="Path to payload zip")
    return p.parse_args()

def load_payload_if_any(args, app_obj):
    if not args.payload or not os.path.exists(args.payload):
        return
    tmp = tempfile.mkdtemp(prefix="printpayload_")
    with zipfile.ZipFile(args.payload, "r") as z:
        z.extractall(tmp)
    # Optional: if you saved special fields in manifest.json
    man = os.path.join(tmp, "manifest.json")
    tree = os.path.join(tmp, "tree.txt")
    contents = os.path.join(tmp, "contents.txt")
    try:
        if os.path.exists(tree):
            with open(tree, "r", encoding="utf-8", errors="replace") as f:
                app_obj.tree_display.setPlainText(f.read())
        if os.path.exists(contents):
            with open(contents, "r", encoding="utf-8", errors="replace") as f:
                app_obj.content_display.setPlainText(f.read())
    except Exception:
        pass

if __name__ == '__main__':
    # Use PORT env variable for Railway, default to 5006 locally
    port = int(os.environ.get('PORT', 5013))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
