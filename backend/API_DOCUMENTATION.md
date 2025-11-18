# Influencer Engagement Bot - API Documentation

## Base URL

```
http://localhost:5000/api
```

For production, replace `localhost:5000` with your server's domain/IP and port.

---

## Endpoints

### 1. Send Email

Send an email to an influencer with AI-generated content.

**Endpoint:** `POST /api/send-email`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "request_type": "send_email",
  "supervisor_id": "SUP_001",
  "session_token": "SESSION_TOKEN_XYZ789",
  "task_id": "TASK_20251015_001",  // Optional, auto-generated if not provided
  "influencer": {
    "name": "Emma Carter",
    "email": "emma.carter@influencerhub.com"
  },
  "email_details": {
    "subject": "Collaboration Meeting Schedule",
    "description": "Schedule a 30-minute call to discuss the new fashion campaign.",
    "category": "meeting"  // Options: "meeting", "negotiation", "follow-up", "collaboration"
  },
  "meta": {
    "priority": "high",  // Options: "high", "medium", "low"
    "requested_at": "2025-10-15T12:20:00Z"  // Optional, ISO 8601 format
  }
}
```

**Required Fields:**
- `request_type`: Must be `"send_email"`
- `influencer.name`: Influencer's full name
- `influencer.email`: Valid email address
- `email_details.subject`: Email subject line
- `email_details.description`: Description of what the email should contain
- `email_details.category`: One of: `"meeting"`, `"negotiation"`, `"follow-up"`, `"collaboration"`

**Optional Fields:**
- `supervisor_id`: Defaults to `"SUP_001"` if not provided
- `session_token`: Auto-generated if not provided
- `task_id`: Auto-generated if not provided (format: `TASK_YYYYMMDD_NNN`)
- `meta.priority`: Defaults to `"medium"` if not provided
- `meta.requested_at`: Current timestamp if not provided

**Success Response (200 OK):**
```json
{
  "response_type": "send_email_response",
  "task_id": "TASK_20251015_001",
  "status": "success",
  "email_content": {
    "to": "emma.carter@influencerhub.com",
    "subject": "Collaboration Meeting Schedule",
    "body": "Hi Emma, we'd love to schedule a 30-minute call to discuss the upcoming fashion campaign. Please let us know your availability this week.",
    "sent_at": "2025-10-15T12:21:05Z"
  },
  "tracking_info": {
    "email_id": "EMAIL_6532",
    "delivery_status": "queued",
    "db_status": "stored_in_mongo"
  },
  "langgraph_notes": "Email content generated and validated by LangGraph pipeline.",
  "timestamp": "2025-10-15T12:21:10Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "response_type": "send_email_response",
  "status": "error",
  "error": "Missing required fields"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "response_type": "send_email_response",
  "status": "error",
  "error": "Error message details"
}
```

**Example using cURL:**
```bash
curl -X POST http://localhost:5000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "request_type": "send_email",
    "supervisor_id": "SUP_001",
    "influencer": {
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "email_details": {
      "subject": "Partnership Opportunity",
      "description": "We would like to discuss a potential collaboration for our upcoming product launch.",
      "category": "collaboration"
    },
    "meta": {
      "priority": "high"
    }
  }'
```

**Example using Python:**
```python
import requests

url = "http://localhost:5000/api/send-email"
payload = {
    "request_type": "send_email",
    "supervisor_id": "SUP_001",
    "influencer": {
        "name": "John Doe",
        "email": "john.doe@example.com"
    },
    "email_details": {
        "subject": "Partnership Opportunity",
        "description": "We would like to discuss a potential collaboration.",
        "category": "collaboration"
    },
    "meta": {
        "priority": "high"
    }
}

response = requests.post(url, json=payload)
print(response.json())
```

**Example using JavaScript (fetch):**
```javascript
fetch('http://localhost:5000/api/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    request_type: 'send_email',
    supervisor_id: 'SUP_001',
    influencer: {
      name: 'John Doe',
      email: 'john.doe@example.com'
    },
    email_details: {
      subject: 'Partnership Opportunity',
      description: 'We would like to discuss a potential collaboration.',
      category: 'collaboration'
    },
    meta: {
      priority: 'high'
    }
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

---

### 2. Get Sent Emails

Retrieve sent emails with optional filtering.

**Endpoint:** `GET /api/emails`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `influencer_email` | string | No | Filter by influencer email address |
| `category` | string | No | Filter by category: `"meeting"`, `"negotiation"`, `"follow-up"`, `"collaboration"` |
| `date_from` | string | No | Start date in ISO 8601 format (e.g., `"2025-10-01T00:00:00Z"`) |
| `date_to` | string | No | End date in ISO 8601 format (e.g., `"2025-10-15T23:59:59Z"`) |

**Success Response (200 OK):**
```json
{
  "response_type": "get_sent_emails_response",
  "status": "success",
  "influencer_email": "emma.carter@influencerhub.com",
  "total_emails": 2,
  "emails": [
    {
      "email_id": "EMAIL_6532",
      "subject": "Collaboration Meeting Schedule",
      "body_preview": "Hi Emma, we'd love to schedule a 30-minute call...",
      "sent_at": "2025-10-15T12:21:05Z",
      "category": "meeting",
      "to": "emma.carter@influencerhub.com",
      "influencer_name": "Emma Carter",
      "body": "Hi Emma, we'd love to schedule a 30-minute call to discuss the upcoming fashion campaign. Please let us know your availability this week.",
      "priority": "high",
      "delivery_status": "queued"
    },
    {
      "email_id": "EMAIL_6498",
      "subject": "Follow-up on Negotiation Terms",
      "body_preview": "Just checking in on the campaign budget proposal...",
      "sent_at": "2025-10-10T14:10:42Z",
      "category": "negotiation",
      "to": "emma.carter@influencerhub.com",
      "influencer_name": "Emma Carter",
      "body": "Just checking in on the campaign budget proposal we discussed last week.",
      "priority": "medium",
      "delivery_status": "queued"
    }
  ],
  "database_status": "retrieved_from_mongo",
  "langgraph_status": "Active",
  "timestamp": "2025-10-15T12:31:00Z"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "response_type": "get_sent_emails_response",
  "status": "error",
  "error": "Error message details"
}
```

**Example using cURL:**

Get all emails:
```bash
curl http://localhost:5000/api/emails
```

Filter by influencer email:
```bash
curl "http://localhost:5000/api/emails?influencer_email=emma.carter@influencerhub.com"
```

Filter by category:
```bash
curl "http://localhost:5000/api/emails?category=meeting"
```

Filter by date range:
```bash
curl "http://localhost:5000/api/emails?date_from=2025-10-01T00:00:00Z&date_to=2025-10-15T23:59:59Z"
```

Combined filters:
```bash
curl "http://localhost:5000/api/emails?influencer_email=emma.carter@influencerhub.com&category=meeting&date_from=2025-10-01T00:00:00Z&date_to=2025-10-15T23:59:59Z"
```

**Example using Python:**
```python
import requests
from datetime import datetime

# Get all emails
response = requests.get("http://localhost:5000/api/emails")
print(response.json())

# Filter by influencer email
params = {
    "influencer_email": "emma.carter@influencerhub.com"
}
response = requests.get("http://localhost:5000/api/emails", params=params)
print(response.json())

# Filter by category and date range
params = {
    "category": "meeting",
    "date_from": "2025-10-01T00:00:00Z",
    "date_to": "2025-10-15T23:59:59Z"
}
response = requests.get("http://localhost:5000/api/emails", params=params)
print(response.json())
```

**Example using JavaScript (fetch):**
```javascript
// Get all emails
fetch('http://localhost:5000/api/emails')
  .then(response => response.json())
  .then(data => console.log(data));

// Filter by influencer email
const params = new URLSearchParams({
  influencer_email: 'emma.carter@influencerhub.com',
  category: 'meeting'
});

fetch(`http://localhost:5000/api/emails?${params}`)
  .then(response => response.json())
  .then(data => console.log(data));
```

---

### 3. Health Check

Check if the API is running and healthy.

**Endpoint:** `GET /api/health`

**Success Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-15T12:31:00Z"
}
```

**Example using cURL:**
```bash
curl http://localhost:5000/api/health
```

---

## Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input or missing required fields |
| 500 | Internal Server Error - Server-side error |

---

## Data Types

### Category
- `"meeting"` - Meeting requests
- `"negotiation"` - Negotiation discussions
- `"follow-up"` - Follow-up emails
- `"collaboration"` - Collaboration proposals

### Priority
- `"high"` - High priority
- `"medium"` - Medium priority (default)
- `"low"` - Low priority

### Delivery Status
- `"queued"` - Email is queued for sending
- `"delivered"` - Email has been delivered

---

## Error Handling

All error responses follow this format:

```json
{
  "response_type": "<endpoint>_response",
  "status": "error",
  "error": "Error message description"
}
```

Common errors:
- **Missing required fields**: One or more required fields are missing
- **Invalid request type**: The `request_type` field doesn't match the endpoint
- **Database connection error**: MongoDB connection failed
- **OpenAI API error**: OpenAI API key is invalid or request failed (falls back to template)

---

## Rate Limiting

Currently, there are no rate limits implemented. For production use, consider implementing rate limiting based on your needs.

---

## Authentication

Currently, the API does not require authentication. For production use, consider implementing:
- API keys
- JWT tokens
- OAuth 2.0

---

## CORS

The API has CORS enabled for all origins. For production, restrict CORS to specific domains:

```python
CORS(app, resources={r"/api/*": {"origins": ["https://yourdomain.com"]}})
```

---

## Environment Variables

Required environment variables (set in `.env` file):

```
MONGODB_URI=mongodb://localhost:27017/influencer_bot
OPENAI_API_KEY=your_openai_api_key_here
FLASK_PORT=5000
FLASK_ENV=development
```

---

## Notes

1. **Email Generation**: If OpenAI API key is not configured or fails, the system falls back to a simple template-based email generation.

2. **Task ID Format**: Auto-generated task IDs follow the format: `TASK_YYYYMMDD_NNN` (e.g., `TASK_20251015_001`)

3. **Email ID Format**: Auto-generated email IDs follow the format: `EMAIL_NNNN` (e.g., `EMAIL_6532`)

4. **Date Formats**: All dates use ISO 8601 format with UTC timezone (e.g., `2025-10-15T12:21:05Z`)

5. **MongoDB**: All emails are stored in MongoDB. Make sure MongoDB is running and accessible.

---

## Support

For issues or questions, please refer to the main project README or contact the development team.

