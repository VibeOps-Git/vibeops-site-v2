from flask import Blueprint, request, jsonify, session
from openai import OpenAI
import time
import os
import logging
from datetime import datetime

# Configure logging (optional, can inherit from app if configured there)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

chat_bp = Blueprint('chat', __name__)

# Initialize OpenAI client (can also be passed from app initialization)
client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

@chat_bp.route('/chatbot', methods=['POST'])
def chatbot_route():
    try:
        data = request.json
        message = data.get('message')
        if not message:
            return jsonify({"error": "Missing message"}), 400

        if 'thread_id' not in session:
            thread = client.beta.threads.create()
            session['thread_id'] = thread.id

        client.beta.threads.messages.create(
            thread_id=session['thread_id'],
            role="user",
            content=message
        )

        run = client.beta.threads.runs.create(
            thread_id=session['thread_id'],
            assistant_id=os.environ.get('OPENAI_ASSISTANT_ID')
        )

        while True:
            run_status = client.beta.threads.runs.retrieve(
                thread_id=session['thread_id'],
                run_id=run.id
            )
            if run_status.status == 'completed':
                break
            elif run_status.status in ['failed', 'cancelled', 'expired']:
                raise Exception(f"Run failed with status: {run_status.status}")
            time.sleep(1)

        messages = client.beta.threads.messages.list(thread_id=session['thread_id'])
        assistant_messages = [msg for msg in messages.data if msg.role == "assistant"]
        if not assistant_messages:
            raise Exception("No response from assistant")
        
        response = assistant_messages[0].content[0].text.value

        if 'chat_messages' not in session:
            session['chat_messages'] = []
        session['chat_messages'].append({'role': 'user', 'content': message})
        # Check if response is a structured object (like the prompt with buttons)
        try:
            # Attempt to parse response as JSON to check for structure
            json_response = jsonify(response).get_json() # Using jsonify to handle potential non-JSON strings gracefully
            if isinstance(json_response, dict) and 'type' in json_response and json_response['type'] == 'prompt':
                 # Save structured response as stringified JSON if it is the prompt type
                 session['chat_messages'].append({'role': 'assistant', 'content': jsonify(response).get_data(as_text=True)})
            else:
                 # Save as plain text otherwise
                 session['chat_messages'].append({'role': 'assistant', 'content': response})
        except Exception as e:
             # If parsing fails, save as plain text
             logger.warning(f"Could not parse bot response as JSON, saving as plain text: {e}")
             session['chat_messages'].append({'role': 'assistant', 'content': response})

        session.modified = True

        # Store in Supabase (only if user is logged in)
        if 'google_id' in session:
            try:
                # Assuming 'supabase' is available globally or imported via config
                # You might need to adjust how supabase is accessed depending on your app structure
                # If config.py is accessible, import from there:
                from config import supabase
                supabase.table('chatbot_logs').insert({
                    'user_id': session['google_id'],
                    'email': session['email'],
                    'message': message,
                    'response': jsonify(response).get_data(as_text=True), # Store the response, maybe as JSON string if it was structured
                    'timestamp': datetime.utcnow().isoformat()
                }).execute()
            except Exception as e:
                logger.error(f"Error storing chatbot message in Supabase: {e}")

        return jsonify({"response": response}), 200
    except Exception as e:
        logger.error(f"Chatbot error: {e}")
        return jsonify({"error": str(e)}), 500

@chat_bp.route('/get-chat-history')
def get_chat_history_route():
    return jsonify(session.get('chat_messages', []))
