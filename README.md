# Influencer Engagement Bot

A full-stack application for managing influencer engagement through automated email sending. Features a modern glassmorphism UI and AI-powered email generation.

## Project Structure

```
Project/
├── backend/          # Flask backend API
├── frontend/         # React frontend application
├── prompt           # Backend requirements prompt
└── uiprompt         # Frontend UI specifications
```

## Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB (local or cloud instance)
- OpenAI API key

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file:
```bash
MONGODB_URI=mongodb://localhost:27017/influencer_bot
OPENAI_API_KEY=your_openai_api_key_here
FLASK_PORT=5000
FLASK_ENV=development
```

4. Start the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file:
```bash
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### POST /api/send-email
Send an email to an influencer.

**Request Body:**
```json
{
  "request_type": "send_email",
  "supervisor_id": "SUP_001",
  "session_token": "SESSION_TOKEN_XYZ789",
  "influencer": {
    "name": "Emma Carter",
    "email": "emma.carter@influencerhub.com"
  },
  "email_details": {
    "subject": "Collaboration Meeting Schedule",
    "description": "Schedule a 30-minute call to discuss the new fashion campaign.",
    "category": "meeting"
  },
  "meta": {
    "priority": "high"
  }
}
```

### GET /api/emails
Get sent emails with optional filters.

**Query Parameters:**
- `influencer_email`: Filter by influencer email
- `category`: Filter by category (meeting, negotiation, follow-up, collaboration)
- `date_from`: Start date (ISO format)
- `date_to`: End date (ISO format)

## Features

- **AI-Powered Email Generation**: Uses OpenAI to generate professional email content
- **MongoDB Storage**: All emails are stored in MongoDB for persistence
- **Modern UI**: Glassmorphism design with smooth animations
- **Email Management**: View, search, and filter sent emails
- **Real-time Validation**: Form validation with visual feedback

## Technologies Used

### Backend
- Flask
- PyMongo
- OpenAI API
- Flask-CORS

### Frontend
- React
- Vite
- Framer Motion
- Lucide React
- Axios
- date-fns

## License

MIT

