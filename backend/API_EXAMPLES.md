# API Usage Examples

Quick reference guide with practical examples for calling the backend API.

## Prerequisites

- Backend server running on `http://localhost:5000`
- MongoDB running and accessible
- (Optional) OpenAI API key for AI-generated emails

---

## 1. Send Email - Basic Example

### cURL
```bash
curl -X POST http://localhost:5000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "request_type": "send_email",
    "influencer": {
      "name": "Sarah Johnson",
      "email": "sarah.johnson@example.com"
    },
    "email_details": {
      "subject": "Brand Collaboration Opportunity",
      "description": "We are interested in partnering with you for our summer campaign.",
      "category": "collaboration"
    },
    "meta": {
      "priority": "high"
    }
  }'
```

### Python
```python
import requests

url = "http://localhost:5000/api/send-email"
data = {
    "request_type": "send_email",
    "influencer": {
        "name": "Sarah Johnson",
        "email": "sarah.johnson@example.com"
    },
    "email_details": {
        "subject": "Brand Collaboration Opportunity",
        "description": "We are interested in partnering with you for our summer campaign.",
        "category": "collaboration"
    },
    "meta": {
        "priority": "high"
    }
}

response = requests.post(url, json=data)
result = response.json()
print(f"Status: {result['status']}")
print(f"Email ID: {result['tracking_info']['email_id']}")
```

### JavaScript/Node.js
```javascript
const axios = require('axios');

const sendEmail = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/send-email', {
      request_type: 'send_email',
      influencer: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com'
      },
      email_details: {
        subject: 'Brand Collaboration Opportunity',
        description: 'We are interested in partnering with you for our summer campaign.',
        category: 'collaboration'
      },
      meta: {
        priority: 'high'
      }
    });
    
    console.log('Status:', response.data.status);
    console.log('Email ID:', response.data.tracking_info.email_id);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

sendEmail();
```

### PHP
```php
<?php
$url = 'http://localhost:5000/api/send-email';
$data = [
    'request_type' => 'send_email',
    'influencer' => [
        'name' => 'Sarah Johnson',
        'email' => 'sarah.johnson@example.com'
    ],
    'email_details' => [
        'subject' => 'Brand Collaboration Opportunity',
        'description' => 'We are interested in partnering with you for our summer campaign.',
        'category' => 'collaboration'
    ],
    'meta' => [
        'priority' => 'high'
    ]
];

$options = [
    'http' => [
        'header' => "Content-type: application/json\r\n",
        'method' => 'POST',
        'content' => json_encode($data)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);
$response = json_decode($result, true);

echo "Status: " . $response['status'] . "\n";
echo "Email ID: " . $response['tracking_info']['email_id'] . "\n";
?>
```

---

## 2. Get All Sent Emails

### cURL
```bash
curl http://localhost:5000/api/emails
```

### Python
```python
import requests

response = requests.get("http://localhost:5000/api/emails")
emails = response.json()

print(f"Total emails: {emails['total_emails']}")
for email in emails['emails']:
    print(f"- {email['subject']} ({email['email_id']})")
```

### JavaScript
```javascript
fetch('http://localhost:5000/api/emails')
  .then(response => response.json())
  .then(data => {
    console.log(`Total emails: ${data.total_emails}`);
    data.emails.forEach(email => {
      console.log(`- ${email.subject} (${email.email_id})`);
    });
  });
```

---

## 3. Get Emails by Influencer

### cURL
```bash
curl "http://localhost:5000/api/emails?influencer_email=sarah.johnson@example.com"
```

### Python
```python
import requests

params = {"influencer_email": "sarah.johnson@example.com"}
response = requests.get("http://localhost:5000/api/emails", params=params)
emails = response.json()
print(f"Found {emails['total_emails']} emails")
```

---

## 4. Get Emails by Category

### cURL
```bash
curl "http://localhost:5000/api/emails?category=meeting"
```

### Python
```python
import requests

params = {"category": "meeting"}
response = requests.get("http://localhost:5000/api/emails", params=params)
emails = response.json()
```

---

## 5. Get Emails by Date Range

### cURL
```bash
curl "http://localhost:5000/api/emails?date_from=2025-10-01T00:00:00Z&date_to=2025-10-31T23:59:59Z"
```

### Python
```python
import requests

params = {
    "date_from": "2025-10-01T00:00:00Z",
    "date_to": "2025-10-31T23:59:59Z"
}
response = requests.get("http://localhost:5000/api/emails", params=params)
emails = response.json()
```

---

## 6. Combined Filters

### cURL
```bash
curl "http://localhost:5000/api/emails?influencer_email=sarah.johnson@example.com&category=collaboration&date_from=2025-10-01T00:00:00Z"
```

### Python
```python
import requests

params = {
    "influencer_email": "sarah.johnson@example.com",
    "category": "collaboration",
    "date_from": "2025-10-01T00:00:00Z",
    "date_to": "2025-10-31T23:59:59Z"
}
response = requests.get("http://localhost:5000/api/emails", params=params)
emails = response.json()
```

---

## 7. Health Check

### cURL
```bash
curl http://localhost:5000/api/health
```

### Python
```python
import requests

response = requests.get("http://localhost:5000/api/health")
print(response.json())
# Output: {"status": "healthy", "timestamp": "2025-10-15T12:31:00Z"}
```

---

## 8. Error Handling Example

### Python with Error Handling
```python
import requests

url = "http://localhost:5000/api/send-email"
data = {
    "request_type": "send_email",
    "influencer": {
        "name": "Test User",
        "email": "test@example.com"
    },
    "email_details": {
        "subject": "Test Email",
        "description": "This is a test",
        "category": "meeting"
    }
}

try:
    response = requests.post(url, json=data)
    response.raise_for_status()  # Raises an error for bad status codes
    result = response.json()
    
    if result['status'] == 'success':
        print(f"✅ Email sent successfully!")
        print(f"Email ID: {result['tracking_info']['email_id']}")
    else:
        print(f"❌ Error: {result.get('error', 'Unknown error')}")
        
except requests.exceptions.RequestException as e:
    print(f"❌ Request failed: {e}")
except KeyError as e:
    print(f"❌ Unexpected response format: {e}")
```

### JavaScript with Error Handling
```javascript
async function sendEmail() {
  try {
    const response = await fetch('http://localhost:5000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        request_type: 'send_email',
        influencer: {
          name: 'Test User',
          email: 'test@example.com'
        },
        email_details: {
          subject: 'Test Email',
          description: 'This is a test',
          category: 'meeting'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.status === 'success') {
      console.log('✅ Email sent successfully!');
      console.log('Email ID:', result.tracking_info.email_id);
    } else {
      console.error('❌ Error:', result.error || 'Unknown error');
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

sendEmail();
```

---

## 9. Complete Workflow Example

### Python - Send and Retrieve Email
```python
import requests
import time

BASE_URL = "http://localhost:5000/api"

# Step 1: Send an email
print("Sending email...")
send_data = {
    "request_type": "send_email",
    "influencer": {
        "name": "Alex Thompson",
        "email": "alex.thompson@example.com"
    },
    "email_details": {
        "subject": "Partnership Discussion",
        "description": "Let's discuss a potential partnership for Q1 2025.",
        "category": "collaboration"
    },
    "meta": {
        "priority": "high"
    }
}

response = requests.post(f"{BASE_URL}/send-email", json=send_data)
result = response.json()

if result['status'] == 'success':
    email_id = result['tracking_info']['email_id']
    influencer_email = result['email_content']['to']
    print(f"✅ Email sent! ID: {email_id}")
    
    # Step 2: Wait a moment for database to update
    time.sleep(1)
    
    # Step 3: Retrieve the email we just sent
    print(f"\nRetrieving emails for {influencer_email}...")
    params = {"influencer_email": influencer_email}
    response = requests.get(f"{BASE_URL}/emails", params=params)
    emails = response.json()
    
    if emails['status'] == 'success':
        print(f"Found {emails['total_emails']} email(s)")
        for email in emails['emails']:
            print(f"\n📧 {email['subject']}")
            print(f"   ID: {email['email_id']}")
            print(f"   Category: {email['category']}")
            print(f"   Sent: {email['sent_at']}")
else:
    print(f"❌ Error: {result.get('error', 'Unknown error')}")
```

---

## 10. Testing with Postman

### Collection Setup

1. **Create a new collection**: "Influencer Engagement Bot API"

2. **Send Email Request**:
   - Method: `POST`
   - URL: `http://localhost:5000/api/send-email`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
   ```json
   {
     "request_type": "send_email",
     "influencer": {
       "name": "Test Influencer",
       "email": "test@example.com"
     },
     "email_details": {
       "subject": "Test Subject",
       "description": "Test description",
       "category": "meeting"
     }
   }
   ```

3. **Get Emails Request**:
   - Method: `GET`
   - URL: `http://localhost:5000/api/emails`
   - Params: Add query parameters as needed

4. **Health Check Request**:
   - Method: `GET`
   - URL: `http://localhost:5000/api/health`

---

## Notes

- All timestamps are in ISO 8601 format with UTC timezone
- Email IDs are auto-generated and unique
- The API returns JSON responses
- Error responses include an `error` field with details
- CORS is enabled for all origins (configure for production)

