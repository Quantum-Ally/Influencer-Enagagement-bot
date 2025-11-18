# Influencer Engagement Bot - Backend

Flask backend for the Influencer Engagement Bot.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI and OpenAI API key:
```
MONGODB_URI=mongodb://localhost:27017/influencer_bot
OPENAI_API_KEY=your_openai_api_key_here
FLASK_PORT=5000
```

4. Run the server:
```bash
python app.py
```

The server will run on port 5000 by default.

## API Endpoints

### POST /api/send-email
Send an email to an influencer.

### GET /api/emails
Get sent emails with optional filters:
- `influencer_email`: Filter by influencer email
- `category`: Filter by category (meeting, negotiation, follow-up, collaboration)
- `date_from`: Start date (ISO format)
- `date_to`: End date (ISO format)

### GET /api/health
Health check endpoint.

