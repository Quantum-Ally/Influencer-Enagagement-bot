# Influencer Engagement Bot

A full-stack application for managing influencer engagement through automated email sending. Features a modern glassmorphism UI and AI-powered email generation.

## Project Structure

```
Project/
├── backend/          # Flask backend API
├── frontend/         # React frontend application
├── diagrams/         # Mermaid.js diagram files
├── prompt           # Backend requirements prompt
└── uiprompt         # Frontend UI specifications
```

## Prerequisites

Before running the project, ensure you have the following installed:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16+** - [Download Node.js](https://nodejs.org/)
- **MongoDB** - Local installation or MongoDB Atlas account
- **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com/api-keys)

## Quick Start

### Option 1: Using Batch Scripts (Windows)

1. **Install Backend Dependencies:**
   ```bash
   install_backend.bat
   ```

2. **Install Frontend Dependencies:**
   ```bash
   install_frontend.bat
   ```

3. **Start Backend:**
   ```bash
   start_backend.bat
   ```

4. **Start Frontend (in a new terminal):**
   ```bash
   start_frontend.bat
   ```

### Option 2: Manual Setup

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create a `.env` file in the backend directory:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/influencer_bot
   OPENAI_API_KEY=your_openai_api_key_here
   FLASK_PORT=5000
   FLASK_ENV=development
   ```

   **For MongoDB Atlas (Cloud):**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/influencer_bot
   OPENAI_API_KEY=sk-proj-your-key-here
   FLASK_PORT=5000
   FLASK_ENV=development
   ```

5. **Start the Flask server:**
   ```bash
   python app.py
   ```

   The backend will run on `http://localhost:5000`

   You should see:
   ```
   * Running on http://0.0.0.0:5000
   ```

## Frontend Setup

1. **Navigate to frontend directory (in a new terminal):**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the frontend directory (optional):**
   ```env
   VITE_API_URL=http://localhost:5000
   ```
   
   If not created, it defaults to `http://localhost:5000`

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

   You should see:
   ```
   VITE v5.x.x  ready in xxx ms
   ➜  Local:   http://localhost:3000/
   ```

## Running the Application

1. **Start MongoDB:**
   - If using local MongoDB, ensure it's running:
     ```bash
     # Windows
     net start MongoDB
     
     # Mac/Linux
     sudo systemctl start mongod
     ```
   - If using MongoDB Atlas, no local setup needed

2. **Start Backend:**
   - Open terminal 1
   - Navigate to `backend/`
   - Run `python app.py`
   - Wait for "Running on http://0.0.0.0:5000"

3. **Start Frontend:**
   - Open terminal 2
   - Navigate to `frontend/`
   - Run `npm run dev`
   - Wait for "Local: http://localhost:3000/"

4. **Open Browser:**
   - Navigate to `http://localhost:3000`
   - You should see the Influencer Engagement Hub

## Features

### Core Features
- ✨ **AI-Powered Email Generation** - Uses OpenAI GPT to generate professional email content
- 📧 **Email Management** - Send, view, search, and filter emails
- 💾 **MongoDB Storage** - All emails stored persistently
- 🎨 **Modern UI** - Glassmorphism design with smooth animations

### Advanced Features
- 📊 **Analytics Dashboard** - Charts and statistics
- 📅 **Timeline View** - Chronological email timeline
- 📆 **Calendar View** - Monthly calendar with email indicators
- 🔍 **Advanced Search** - Multi-field search with filters
- 📤 **Export** - Export emails to CSV/PDF
- 📝 **Email Templates** - Pre-built templates for common scenarios
- 👁️ **Email Preview** - Preview before sending
- 🏷️ **Email Grouping** - Group by date, influencer, category, priority

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
- `influencer_email` - Filter by influencer email
- `category` - Filter by category (meeting, negotiation, follow-up, collaboration)
- `date_from` - Start date (ISO format)
- `date_to` - End date (ISO format)

**Example:**
```
GET /api/emails?category=meeting&date_from=2025-12-01T00:00:00Z
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-30T10:00:00Z"
}
```

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running (local) or check Atlas connection string
- Verify `MONGODB_URI` in `.env` file
- Check firewall settings

**Port Already in Use:**
- Change `FLASK_PORT` in `.env` to a different port (e.g., 5001)
- Update frontend `VITE_API_URL` accordingly

**OpenAI API Error:**
- Verify API key is correct in `.env`
- Check API key has sufficient credits
- App will use fallback template if API fails

**Module Not Found:**
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

### Frontend Issues

**Cannot Connect to Backend:**
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS is enabled in backend
- Check browser console for errors

**Build Errors:**
- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules
  npm install
  ```

**Port Already in Use:**
- Vite will automatically use next available port
- Or specify port: `npm run dev -- --port 3001`

### Common Issues

**Email Not Generating:**
- Check OpenAI API key is valid
- Verify internet connection
- Check backend logs for errors

**Emails Not Saving:**
- Verify MongoDB connection
- Check database permissions
- Review backend error logs

## Development

### Backend Development

```bash
cd backend
python app.py
```

Backend runs in debug mode by default.

### Frontend Development

```bash
cd frontend
npm run dev
```

Hot reload is enabled for development.

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

Build output will be in `frontend/dist/`

**Backend:**
- Ensure all environment variables are set
- Use production WSGI server (e.g., Gunicorn)

## Project Pages

- **Send Email** (`/send-email`) - Compose and send emails
- **Sent Emails** (`/sent-emails`) - View and manage sent emails
- **Analytics** (`/analytics`) - View email statistics and charts
- **Timeline** (`/timeline`) - Chronological email timeline
- **Calendar** (`/calendar`) - Calendar view of emails

## Technologies Used

### Backend
- Flask 3.0.0 - Web framework
- PyMongo 4.6.0 - MongoDB driver
- OpenAI API 1.6.1 - AI email generation
- Flask-CORS 4.0.0 - Cross-origin resource sharing
- python-dotenv 1.0.0 - Environment variables

### Frontend
- React 18.2.0 - UI library
- Vite 5.0.8 - Build tool
- Framer Motion 10.16.16 - Animations
- Recharts 2.10.3 - Charts and graphs
- Lucide React 0.294.0 - Icons
- Axios 1.6.2 - HTTP client
- date-fns 2.30.0 - Date utilities

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/influencer_bot
OPENAI_API_KEY=your_openai_api_key_here
FLASK_PORT=5000
FLASK_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## Testing

### Backend Testing
```bash
cd backend
python -m pytest  # If tests are set up
```

### Frontend Testing
```bash
cd frontend
npm test  # If tests are set up
```

## Deployment

### Backend Deployment
- Deploy to Heroku, Vercel, or AWS
- Set environment variables in deployment platform
- Ensure MongoDB Atlas is accessible

### Frontend Deployment
- Build: `npm run build`
- Deploy `dist/` folder to Vercel, Netlify, or similar
- Set `VITE_API_URL` to production backend URL

## License

MIT

## Team Members

- Abdul Moiz (22i-2640)
- Abdul Quddos (22i-8774)
- Abdullah Ilyas (22i-2677)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend/frontend logs
3. Check browser console for errors
4. Verify all prerequisites are installed

---

**Last Updated:** December 30, 2025
