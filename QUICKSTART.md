# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Setup Backend

```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/influencer_bot
OPENAI_API_KEY=your_key_here
FLASK_PORT=5000
```

Start backend:
```bash
python app.py
```

### Step 2: Setup Frontend

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

### Step 3: Open Browser

Visit: **http://localhost:3000**

## ✅ What You Get

- ✨ Beautiful glassmorphism UI
- 📧 Send emails to influencers
- 📊 View sent emails dashboard
- 🔍 Search and filter emails
- 🤖 AI-powered email generation (with OpenAI)
- 💾 MongoDB storage

## 📝 Notes

- Make sure MongoDB is running
- OpenAI API key is optional (app works without it)
- Backend runs on port 5000
- Frontend runs on port 3000

For detailed testing instructions, see [TESTING.md](TESTING.md)

