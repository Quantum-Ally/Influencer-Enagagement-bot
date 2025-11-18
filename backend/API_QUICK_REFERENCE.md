# API Quick Reference

## Base URL
```
http://localhost:5000/api
```

---

## 📧 Send Email

**POST** `/api/send-email`

**Request:**
```json
{
  "request_type": "send_email",
  "influencer": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "email_details": {
    "subject": "Collaboration Opportunity",
    "description": "We'd like to discuss a partnership.",
    "category": "collaboration"
  },
  "meta": {
    "priority": "high"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "email_content": {
    "to": "john@example.com",
    "subject": "Collaboration Opportunity",
    "body": "Generated email content...",
    "sent_at": "2025-10-15T12:21:05Z"
  },
  "tracking_info": {
    "email_id": "EMAIL_6532",
    "delivery_status": "queued"
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"request_type":"send_email","influencer":{"name":"John Doe","email":"john@example.com"},"email_details":{"subject":"Test","description":"Test","category":"meeting"}}'
```

---

## 📬 Get Sent Emails

**GET** `/api/emails`

**Query Parameters:**
- `influencer_email` - Filter by email
- `category` - Filter by category (meeting, negotiation, follow-up, collaboration)
- `date_from` - Start date (ISO format)
- `date_to` - End date (ISO format)

**Response:**
```json
{
  "status": "success",
  "total_emails": 2,
  "emails": [
    {
      "email_id": "EMAIL_6532",
      "subject": "Collaboration Opportunity",
      "body_preview": "Generated email content...",
      "sent_at": "2025-10-15T12:21:05Z",
      "category": "collaboration",
      "to": "john@example.com"
    }
  ]
}
```

**cURL Examples:**
```bash
# Get all emails
curl http://localhost:5000/api/emails

# Filter by influencer
curl "http://localhost:5000/api/emails?influencer_email=john@example.com"

# Filter by category
curl "http://localhost:5000/api/emails?category=meeting"

# Date range
curl "http://localhost:5000/api/emails?date_from=2025-10-01T00:00:00Z&date_to=2025-10-31T23:59:59Z"
```

---

## ❤️ Health Check

**GET** `/api/health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-15T12:31:00Z"
}
```

**cURL:**
```bash
curl http://localhost:5000/api/health
```

---

## Categories
- `meeting` - Meeting requests
- `negotiation` - Negotiation discussions
- `follow-up` - Follow-up emails
- `collaboration` - Collaboration proposals

## Priorities
- `high` - High priority
- `medium` - Medium priority (default)
- `low` - Low priority

---

## Python Example

```python
import requests

# Send email
response = requests.post('http://localhost:5000/api/send-email', json={
    'request_type': 'send_email',
    'influencer': {'name': 'John', 'email': 'john@example.com'},
    'email_details': {
        'subject': 'Test',
        'description': 'Test email',
        'category': 'meeting'
    }
})
print(response.json())

# Get emails
response = requests.get('http://localhost:5000/api/emails')
print(response.json())
```

---

## JavaScript Example

```javascript
// Send email
fetch('http://localhost:5000/api/send-email', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    request_type: 'send_email',
    influencer: {name: 'John', email: 'john@example.com'},
    email_details: {
      subject: 'Test',
      description: 'Test email',
      category: 'meeting'
    }
  })
})
.then(r => r.json())
.then(data => console.log(data));

// Get emails
fetch('http://localhost:5000/api/emails')
  .then(r => r.json())
  .then(data => console.log(data));
```

---

## Error Response Format

```json
{
  "status": "error",
  "error": "Error message here"
}
```

---

For detailed documentation, see `API_DOCUMENTATION.md`  
For more examples, see `API_EXAMPLES.md`

