# 🚀 JobPilot AI - Smart Career Pipeline & Application Tracker

**JobPilot AI** is a state-of-the-art, full-stack job application tracker and AI career assistant. Built with React, Node.js, MongoDB, and the Google Gemini API, JobPilot AI helps job seekers, students, and software engineers organize applications, prepare for interviews, track upcoming deadlines, and analyze application metrics in real time.

---

## ✨ Key Features

- **🤖 Integrated Gemini AI Assistant**: Context-aware AI bot embedded in your dashboard that reads your live application pipeline to provide interview prep tips, company insights, pipeline summaries, and site navigation.
- **📋 Dual View Modes**:
  - **Kanban Board**: Drag/click application status columns (`Wishlist`, `Applied`, `Interview`, `Offer`, `Rejected`, `Withdrawn`).
  - **List View**: Detailed, sortable, and filterable table view for quick scanning.
- **📊 Real-Time Analytics Dashboard**: Metrics cards displaying Total Applications, Active Discussions, Offers, Response Rate %, and Upcoming Deadlines (within 7 days).
- **⭐ Pin Favorites**: Star high-priority applications to keep them at the top of your dashboard.
- **💼 Rich Application Metadata**: Track company name, role, salary range, location, job URL, application date, deadline, recruiter contact details, and prep notes.
- **🌙 Glassmorphic Dark & Light Themes**: Sleek obsidian dark mode with instant light mode toggle and responsive layouts.
- **🔐 Secure Authentication**: JWT token-based authentication with bcrypt password hashing and user-isolated MongoDB data security.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 + Vite 8
- **Routing:** React Router DOM v7
- **Styling:** Custom CSS Design System (Glassmorphism, Dark/Light Themes)
- **Icons:** Lucide React (`lucide-react`)
- **HTTP Client:** Axios with request/response interceptors

### Backend
- **Runtime:** Node.js + Express.js v5
- **Database:** MongoDB with Mongoose Schema validation
- **AI Engine:** Google Gemini API (`@google/generative-ai`)
- **Authentication:** JSON Web Tokens (JWT) + `bcryptjs`
- **Security & Rate Limiting:** Helmet.js, Express Rate Limit, CORS

---

## 📁 Project Structure

```
JobPilot-AI/
├── client/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/     # AIChatAssistant.jsx (Floating AI Widget)
│   │   ├── pages/          # Login.jsx, Register.jsx, Dashboard.jsx
│   │   ├── api.js          # Axios API Interceptor instance
│   │   ├── App.css         # Component & Layout Styles
│   │   └── index.css       # Global CSS Variables & Reset
│   └── package.json
└── server/                 # Node.js + Express API Backend
    ├── middleware/         # authMiddleware.js (JWT Guard)
    ├── models/             # User.js, JobApplication.js
    ├── routes/             # authRoutes.js, jobRoutes.js, aiRoutes.js
    ├── server.js           # Express Server Initialization
    └── package.json
```

---

## ⚙️ Environment Configuration

Create or update `.env` in the `server/` directory:

```env
PORT = 5000
MONGO_URI = your_mongodb_connection_string
JWT_SECRET = your_secret_jwt_key
GEMINI_API_KEY = your_google_gemini_api_key
```

> [!TIP]
> **Getting a Google Gemini API Key:**
> 1. Visit [Google AI Studio](https://aistudio.google.com/).
> 2. Log in and click **"Get API key"** -> **"Create API key"**.
> 3. Paste your key into `GEMINI_API_KEY` in `server/.env`.

---

## 🚀 Running Locally

### 1. Start Backend Server
```bash
cd server
npm install
npm start
```
The server will start on `http://localhost:5000`.

### 2. Start Frontend App
```bash
cd client
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Reset Database (Optional)
To wipe all test data and reset the database:
```bash
cd server
npm run db:reset
```