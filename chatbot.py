from flask import Blueprint, request, jsonify, session
from openai import OpenAI
import time
import os
import logging
from datetime import datetime
# Import the specific error for handling
from openai import APIStatusError

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

        thread_id = session.get('thread_id')

        # Function to process the message and run the assistant (can be called recursively or in a loop)
        def process_message_with_thread(current_thread_id, msg_content):
            try:
                # Attempt to create message in the thread
                client.beta.threads.messages.create(
                    thread_id=current_thread_id,
                    role="user",
                    content=msg_content
                )
                logger.info(f"Message created in thread: {current_thread_id}")

                # Run the assistant
                run = client.beta.threads.runs.create(
                    thread_id=current_thread_id,
                    assistant_id=os.environ.get('OPENAI_ASSISTANT_ID')
                )
                logger.info(f"Assistant run created: {run.id} on thread {current_thread_id}")

                # Wait for the run to complete
                while True:
                    run_status = client.beta.threads.runs.retrieve(
                        thread_id=current_thread_id,
                        run_id=run.id
                    )
                    if run_status.status == 'completed':
                        logger.info("Run completed.")
                        break
                    elif run_status.status in ['failed', 'cancelled', 'expired']:
                        logger.error(f"Run failed with status: {run_status.status}")
                        # Depending on desired behavior, might raise an exception or handle failure differently
                        raise Exception(f"Assistant run failed with status: {run_status.status}")
                    time.sleep(1)

                # Retrieve messages after the run
                messages = client.beta.threads.messages.list(thread_id=current_thread_id)
                assistant_messages = [msg for msg in messages.data if msg.role == "assistant"]
                if not assistant_messages:
                    logger.warning("No response from assistant.")
                    return "No response from assistant."
                
                # Get the latest assistant response
                response = assistant_messages[0].content[0].text.value
                logger.info("Assistant response retrieved.")
                return response

            except APIStatusError as e:
                logger.error(f"API Status Error processing message in thread {current_thread_id}: {e}")
                if e.status_code == 404:
                    # Handle the case where the thread is not found
                    logger.warning(f"Thread {current_thread_id} not found (404). Will attempt to create a new thread.")
                    return None # Indicate that the thread was not found and a retry is needed
                else:
                    # Re-raise other API errors
                    raise e
            except Exception as e:
                logger.error(f"An unexpected error occurred while processing message in thread {current_thread_id}: {e}")
                raise e # Re-raise other unexpected errors

        # --- Main logic flow --- #
        assistant_response = None
        # Attempt to process with the existing thread_id or create a new one if it doesn't exist
        if not thread_id:
            logger.info("No thread_id in session, creating a new thread.")
            thread = client.beta.threads.create()
            thread_id = thread.id
            session['thread_id'] = thread_id
            session.modified = True # Ensure session save
            logger.info(f"New thread created: {thread_id}")

        # Attempt to process the message
        assistant_response = process_message_with_thread(thread_id, message)

        # If process_message_with_thread returned None, it means the thread was not found (404)
        if assistant_response is None:
            logger.info(f"Existing thread {thread_id} not found. Creating a new thread and retrying.")
            # Create a new thread
            new_thread = client.beta.threads.create()
            new_thread_id = new_thread.id
            session['thread_id'] = new_thread_id # Update session with the new thread ID
            session.modified = True # Ensure session save
            logger.info(f"New thread created and session updated: {new_thread_id}")
            
            # Retry processing the message with the new thread ID
            assistant_response = process_message_with_thread(new_thread_id, message)
            # If it still returns None or raises another error, it will be caught by the outer try block

        # --- Handle response and save to session/Supabase --- #
        if assistant_response is None:
             # This case should ideally not be reached if the second attempt in a new thread also fails 
             # but included as a safeguard. The error would likely be caught by outer try/except.
             logger.error("Assistant response is still None after retry.")
             return jsonify({"error": "Failed to get response after retry."}), 500

        # Save chat messages to session
        if 'chat_messages' not in session:
            session['chat_messages'] = []
        session['chat_messages'].append({'role': 'user', 'content': message})
        session['chat_messages'].append({'role': 'assistant', 'content': assistant_response})
        session.modified = True

        # Store in Supabase (only if user is logged in)
        if 'google_id' in session:
            try:
                # Assuming 'supabase' is available globally or imported via config
                from config import supabase
                # Store both user message and assistant response
                supabase.table('chatbot_logs').insert({
                    'user_id': session['google_id'],
                    'email': session['email'],
                    'message': message,
                    'response': assistant_response, 
                    'thread_id': session['thread_id'], # Store thread_id
                    'timestamp': datetime.utcnow().isoformat()
                }).execute()
            except Exception as e:
                logger.error(f"Error storing chatbot message in Supabase: {e}")

        return jsonify({"response": assistant_response}), 200

    except Exception as e:
        logger.error(f"Chatbot endpoint error: {e}")
        # Return a generic 500 error message, possibly including a simplified error detail
        return jsonify({"error": "An internal server error occurred."}), 500

@chat_bp.route('/get-chat-history')
def get_chat_history_route():
    # Retrieve messages from session and convert potential structured responses back if necessary
    chat_history = []
    for msg in session.get('chat_messages', []) or []:
        # In case structured responses were stored as strings, try to parse them back if appropriate
        try:
            content = jsonify(msg['content']).get_json() # Attempt to parse JSON strings
            chat_history.append({'role': msg['role'], 'content': content})
        except Exception:
            chat_history.append(msg) # If parsing fails, keep as plain text

    return jsonify(chat_history)
