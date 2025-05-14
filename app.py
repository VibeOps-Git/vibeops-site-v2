from flask import Flask, send_from_directory, render_template


app = Flask(__name__)

# Serve static videos
@app.route('/videos/<path:filename>')
def serve_video(filename):
    return send_from_directory('public/videos', filename)

# Catch-all route for other requests
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/<path:path>')
def catch_all(path):
    if path and not path.endswith('.mp4'):  # Avoid serving videos via catch-all
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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5006)