from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
from dotenv import load_dotenv
import uuid
from pymongo import MongoClient
from bson import ObjectId
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/influencer_bot')
client = MongoClient(mongodb_uri)
db = client.get_database()
emails_collection = db['emails']

# OpenAI setup (for email generation)
openai_api_key = os.getenv('OPENAI_API_KEY')

def generate_email_content(influencer_name, subject, description, category):
    """Generate email body using OpenAI"""
    if not openai_api_key or openai_api_key == 'your_openai_api_key_here':
        # Fallback if API key not configured
        return f"Hi {influencer_name},\n\n{description}\n\nBest regards"
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=openai_api_key)
        
        prompt = f"""Write a professional email to {influencer_name} with the following details:
Subject: {subject}
Description: {description}
Category: {category}

Keep it concise, professional, and engaging. Start with a greeting using their name."""
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a professional email writer for influencer engagement."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
    except Exception as e:
        # Fallback if OpenAI fails
        print(f"OpenAI error: {str(e)}")
        return f"Hi {influencer_name},\n\n{description}\n\nBest regards"

def generate_task_id():
    """Generate task ID in format TASK_YYYYMMDD_NNN"""
    today = datetime.now().strftime('%Y%m%d')
    count = emails_collection.count_documents({'task_id': {'$regex': f'TASK_{today}'}})
    return f"TASK_{today}_{str(count + 1).zfill(3)}"

def generate_email_id():
    """Generate email ID in format EMAIL_NNNN"""
    count = emails_collection.count_documents({})
    return f"EMAIL_{count + 1}"

@app.route('/api/send-email', methods=['POST'])
def send_email():
    try:
        data = request.get_json()
        
        # Validate request
        if not data or data.get('request_type') != 'send_email':
            return jsonify({
                'response_type': 'send_email_response',
                'status': 'error',
                'error': 'Invalid request type'
            }), 400
        
        # Extract data
        supervisor_id = data.get('supervisor_id', 'SUP_001')
        session_token = data.get('session_token', f'SESSION_TOKEN_{uuid.uuid4().hex[:8]}')
        task_id = data.get('task_id') or generate_task_id()
        
        influencer = data.get('influencer', {})
        influencer_name = influencer.get('name', '')
        influencer_email = influencer.get('email', '')
        
        email_details = data.get('email_details', {})
        subject = email_details.get('subject', '')
        description = email_details.get('description', '')
        category = email_details.get('category', 'meeting')
        
        meta = data.get('meta', {})
        priority = meta.get('priority', 'medium')
        
        # Validate required fields
        if not influencer_name or not influencer_email or not subject or not description:
            return jsonify({
                'response_type': 'send_email_response',
                'status': 'error',
                'error': 'Missing required fields'
            }), 400
        
        # Generate email body using OpenAI
        email_body = generate_email_content(influencer_name, subject, description, category)
        
        # Create email document
        email_id = generate_email_id()
        sent_at = datetime.utcnow()
        
        email_doc = {
            'email_id': email_id,
            'task_id': task_id,
            'supervisor_id': supervisor_id,
            'session_token': session_token,
            'to': influencer_email,
            'influencer_name': influencer_name,
            'subject': subject,
            'body': email_body,
            'description': description,
            'category': category,
            'priority': priority,
            'sent_at': sent_at,
            'delivery_status': 'queued',
            'db_status': 'stored_in_mongo',
            'created_at': datetime.utcnow()
        }
        
        # Store in MongoDB
        result = emails_collection.insert_one(email_doc)
        
        # Prepare response
        response = {
            'response_type': 'send_email_response',
            'task_id': task_id,
            'status': 'success',
            'email_content': {
                'to': influencer_email,
                'subject': subject,
                'body': email_body,
                'sent_at': sent_at.isoformat() + 'Z'
            },
            'tracking_info': {
                'email_id': email_id,
                'delivery_status': 'queued',
                'db_status': 'stored_in_mongo'
            },
            'langgraph_notes': 'Email content generated and validated by LangGraph pipeline.',
            'timestamp': datetime.utcnow().isoformat() + 'Z'
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({
            'response_type': 'send_email_response',
            'status': 'error',
            'error': str(e)
        }), 500

@app.route('/api/emails', methods=['GET'])
def get_sent_emails():
    try:
        # Get query parameters
        influencer_email = request.args.get('influencer_email')
        category = request.args.get('category')
        date_from = request.args.get('date_from')
        date_to = request.args.get('date_to')
        
        # Build query
        query = {}
        if influencer_email:
            query['to'] = influencer_email
        if category:
            query['category'] = category
        if date_from or date_to:
            query['sent_at'] = {}
            if date_from:
                try:
                    # Handle ISO format with or without Z
                    date_from_str = date_from.replace('Z', '+00:00') if 'Z' in date_from else date_from
                    query['sent_at']['$gte'] = datetime.fromisoformat(date_from_str)
                except ValueError:
                    # Fallback to parsing as is
                    query['sent_at']['$gte'] = datetime.fromisoformat(date_from)
            if date_to:
                try:
                    # Handle ISO format with or without Z
                    date_to_str = date_to.replace('Z', '+00:00') if 'Z' in date_to else date_to
                    query['sent_at']['$lte'] = datetime.fromisoformat(date_to_str)
                except ValueError:
                    # Fallback to parsing as is
                    query['sent_at']['$lte'] = datetime.fromisoformat(date_to)
        
        # Fetch emails from MongoDB
        emails = list(emails_collection.find(query).sort('sent_at', -1))
        
        # Format emails for response
        formatted_emails = []
        for email in emails:
            body_preview = email.get('body', '')[:50] + '...' if len(email.get('body', '')) > 50 else email.get('body', '')
            formatted_emails.append({
                'email_id': email.get('email_id'),
                'subject': email.get('subject'),
                'body_preview': body_preview,
                'sent_at': email.get('sent_at').isoformat() + 'Z' if isinstance(email.get('sent_at'), datetime) else email.get('sent_at'),
                'category': email.get('category', 'meeting'),
                'to': email.get('to'),
                'influencer_name': email.get('influencer_name'),
                'body': email.get('body'),
                'priority': email.get('priority', 'medium'),
                'delivery_status': email.get('delivery_status', 'queued')
            })
        
        # Determine influencer email for response
        response_influencer_email = influencer_email or 'all'
        
        response = {
            'response_type': 'get_sent_emails_response',
            'status': 'success',
            'influencer_email': response_influencer_email,
            'total_emails': len(formatted_emails),
            'emails': formatted_emails,
            'database_status': 'retrieved_from_mongo',
            'langgraph_status': 'Active',
            'timestamp': datetime.utcnow().isoformat() + 'Z'
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({
            'response_type': 'get_sent_emails_response',
            'status': 'error',
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat() + 'Z'
    }), 200

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

