# Testing Guide

## Prerequisites

1. **MongoDB**: Make sure MongoDB is running
   - Local: `mongodb://localhost:27017`
   - Or use MongoDB Atlas (cloud)

2. **OpenAI API Key**: Get your API key from https://platform.openai.com/api-keys
   - Note: The app will work without it, but will use a simple template instead of AI-generated content

## Setup Steps

### 1. Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file in backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/influencer_bot
OPENAI_API_KEY=your_actual_openai_api_key_here
FLASK_PORT=5000
FLASK_ENV=development
```

4. Start the backend server:
```bash
python app.py
```

You should see:
```
 * Running on http://0.0.0.0:5000
```

### 2. Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend server:
```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

## Testing the Application

### Test 1: Send Email

1. Open http://localhost:3000 in your browser
2. You should see the "Send Email" page with a glassmorphism form
3. Fill in the form:
   - **Influencer Name**: Emma Carter
   - **Email**: emma.carter@influencerhub.com
   - **Subject**: Collaboration Meeting Schedule
   - **Description**: Schedule a 30-minute call to discuss the new fashion campaign.
   - **Category**: Meeting
   - **Priority**: High
4. Click "Send Email"
5. You should see a success toast notification
6. The form should reset

### Test 2: View Sent Emails

1. Click on "View Sent" in the navigation bar
2. You should see the Sent Emails Dashboard
3. Check the stats cards (Total, Delivered, Queued)
4. You should see the email you just sent in the grid

### Test 3: Filter Emails

1. In the Sent Emails page, try the filters:
   - **Search**: Type "Emma" or "collaboration"
   - **Category**: Select "Meeting"
   - **Date Range**: Select a date range
2. The email list should update based on filters

### Test 4: Expand Email Card

1. Click on any email card
2. The card should expand showing the full email body
3. Click "Copy to Clipboard" button
4. The email content should be copied

### Test 5: API Health Check

1. Open http://localhost:5000/api/health in your browser
2. You should see:
```json
{
  "status": "healthy",
  "timestamp": "2025-..."
}
```

### Test 6: Direct API Test (Optional)

Using curl or Postman:

**Send Email:**
```bash
curl -X POST http://localhost:5000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "request_type": "send_email",
    "supervisor_id": "SUP_001",
    "influencer": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "email_details": {
      "subject": "Test Email",
      "description": "This is a test email",
      "category": "meeting"
    },
    "meta": {
      "priority": "medium"
    }
  }'
```

**Get Emails:**
```bash
curl http://localhost:5000/api/emails
```

## Troubleshooting

### Backend Issues

1. **MongoDB Connection Error**:
   - Make sure MongoDB is running
   - Check the MONGODB_URI in .env file
   - Try: `mongodb://localhost:27017/influencer_bot`

2. **Port Already in Use**:
   - Change FLASK_PORT in .env to a different port (e.g., 5001)
   - Update frontend API URL accordingly

3. **OpenAI API Error**:
   - Check if API key is valid
   - The app will still work with a fallback template

### Frontend Issues

1. **Cannot Connect to Backend**:
   - Make sure backend is running on port 5000
   - Check browser console for CORS errors
   - Verify VITE_API_URL in frontend .env

2. **Build Errors**:
   - Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Clear cache: `npm cache clean --force`

3. **Styling Issues**:
   - Make sure all CSS files are imported
   - Check browser console for missing assets

## Expected Behavior

✅ **Send Email Page**:
- Beautiful glassmorphism UI
- Form validation with error messages
- Success/error toast notifications
- Smooth animations

✅ **Sent Emails Dashboard**:
- Stats cards showing totals
- Filter bar with search, category, and date filters
- Email cards in a responsive grid
- Expandable cards with full email content
- Copy to clipboard functionality

✅ **Navigation**:
- Smooth transitions between pages
- Active state indicators
- Responsive design

## Performance Checks

- Page load time should be < 2 seconds
- Form submission should show loading state
- Animations should be smooth (60fps)
- No console errors in browser DevTools

## Browser Compatibility

Tested on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Next Steps

After successful testing:
1. Deploy backend to a cloud service (Heroku, AWS, etc.)
2. Deploy frontend to Vercel, Netlify, or similar
3. Set up production MongoDB instance
4. Configure environment variables in production

