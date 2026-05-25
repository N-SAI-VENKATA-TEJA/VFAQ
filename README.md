# Vicharanashala FAQ Platform

A beautifully designed, full-stack web application built to serve as the crowd-sourced guide to the Vicharanashala online internship at IIT Ropar. It provides an intuitive interface for students to browse and search FAQs, submit new questions, and features a secure Admin Dashboard for platform management.

---

## 🌟 Key Features

### For Users (Students/Applicants)
- **Interactive FAQ Browsing**: Explore FAQs logically grouped by section.
- **Real-time Search**: Instantly filter questions and answers using keywords.
- **Beautiful UI**: Modern glassmorphism design with custom Tailwind animations and curated color palettes.
- **Question Submission**: A built-in form to ask new questions if the answer cannot be found.

### For Administrators
- **Secure Authentication**: JWT-based protected routes and HTTP-only cookies.
- **Admin Dashboard**: View live metrics (Total FAQs, Pending Questions, Helpful/Unhelpful Votes).
- **FAQ Management**: Full CRUD operations (Create, Read, Update, Delete) to manage published FAQs.
- **Pending Question Queue**: Review questions submitted by users, instantly pre-fill them into the FAQ editor to approve them, or reject them.

---

## 🛠️ Tech Stack

**Frontend:**
- **React 19** (via Vite)
- **TypeScript** for strict type checking
- **React Router v7** for client-side routing
- **Tailwind CSS v3.4** for rapid, custom utility-class styling (Glassmorphism aesthetics)
- **Zustand** for lightweight global state management (Authentication state)
- **Axios** for API requests
- **Lucide React** for modern iconography

**Backend:**
- **Node.js & Express.js**
- **TypeScript** compiled via `tsx`
- **MongoDB** (Atlas) & **Mongoose** for NoSQL database modeling
- **JWT (JSON Web Tokens)** & **Bcrypt.js** for authentication and password hashing
- **CORS & Cookie-Parser** for secure cross-origin requests

---

## 🏗️ System Architecture & Data Flow

The application follows a standard **MERN** (MongoDB, Express, React, Node) architecture decoupled into two distinct services:

1. **Client (Frontend - Port 5174)**:
   - The user interacts with the React UI.
   - Global state (like the Admin's login session) is tracked in memory via Zustand.
   - Data fetching and API calls are handled via an Axios instance pre-configured to include credentials (cookies) with every request.

2. **Server (Backend - Port 5000)**:
   - Express handles the incoming HTTP requests.
   - **Auth Middleware**: Protects admin routes by verifying the HTTP-only JWT cookie.
   - **Controllers**: Contain the business logic (e.g., retrieving FAQs, approving questions).
   - **Models (Mongoose)**: Define the schemas and interact directly with the MongoDB Atlas cluster.

### Data Flow Example (User asks a question)
1. **User Action**: Student types "Will I get a certificate?" in the submission form and clicks Submit.
2. **Frontend**: React intercepts the form submission, prevents default page reload, and sends an Axios `POST /api/questions/submit` request.
3. **Backend Route**: The Express router maps this to the `questionController.submitQuestion` function.
4. **Database Insertion**: The controller creates a new `SubmittedQuestion` document with status `"pending"`.
5. **Admin Review**: An Admin logs in, the `AdminDashboard` fetches `GET /api/admin/questions?status=pending`, and the question appears in the queue.
6. **Approval**: The Admin clicks "Approve", pre-fills an answer, and saves. This triggers a `POST /api/admin/faqs` to create the actual FAQ, and a `PATCH /api/admin/questions/:id` to mark the original submission as `"approved"`.

---

## 📁 Directory Structure

```text
V_FAQ/
├── frontend/                   # React Application
│   ├── src/
│   │   ├── api/                # Axios instance configuration
│   │   ├── components/         # Reusable UI elements (Accordion, Navbar, FAQModal)
│   │   ├── pages/              # Route views (Home, FAQPage, AdminDashboard)
│   │   ├── store/              # Zustand state management (authStore.ts)
│   │   ├── App.tsx             # Main routing component
│   │   └── index.css           # Tailwind directives and custom animations
│   ├── tailwind.config.js      # Custom theme, colors (sky/lavender/mint)
│   └── vite.config.ts          # Vite bundler configuration
│
└── backend/                    # Node.js/Express Application
    ├── src/
    │   ├── config/             # Database connection logic
    │   ├── controllers/        # Route logic (auth, faqs, admin, questions)
    │   ├── middleware/         # JWT verification & role validation
    │   ├── models/             # Mongoose schemas (FAQ, User, SubmittedQuestion)
    │   ├── routes/             # Express API routers
    │   ├── scripts/            # DB Seeding scripts (seedFAQs.ts)
    │   ├── data/               # Hardcoded seed data
    │   └── server.ts           # Express application entry point
    └── .env                    # Environment variables (Mongo URI, Secrets)
```

---

## 🗄️ Database Schemas

### 1. User Model
Tracks administrators who can manage the platform.
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (Enum: `admin`)

### 2. FAQ Model
The core content model.
- `section` (String) — E.g., "About the Internship"
- `sectionNumber` (Number) — Used for sorting groups
- `question` (String)
- `answer` (String)
- `slug` (String, Unique) — URL friendly identifier
- `isPublished` (Boolean) — Draft vs Public state
- `helpfulVotes` / `unhelpfulVotes` (Number)

### 3. SubmittedQuestion Model
Tracks community suggestions.
- `question` (String)
- `status` (Enum: `pending`, `approved`, `rejected`)

---

## 🔌 API Endpoints

### Public Routes
- `POST /api/auth/login` — Authenticate admin and return JWT cookie.
- `POST /api/auth/logout` — Clear JWT cookie.
- `GET /api/faqs` — Retrieve all published FAQs.
- `POST /api/questions/submit` — Submit a new question to the queue.

### Protected Admin Routes (Requires JWT)
- `GET /api/admin/stats` — Fetch dashboard metrics.
- `GET /api/admin/faqs` — Retrieve all FAQs (including drafts).
- `POST /api/admin/faqs` — Create a new FAQ.
- `PUT /api/admin/faqs/:id` — Update an existing FAQ.
- `DELETE /api/admin/faqs/:id` — Delete an FAQ.
- `GET /api/admin/questions` — Fetch pending user questions.
- `PATCH /api/admin/questions/:id` — Approve/Reject a queued question.

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (v18+)
- A MongoDB cluster (or local instance)

### 1. Setup Backend
```bash
cd backend
npm install

# Create a .env file based on the environment variables needed:
# PORT=5000
# MONGODB_URI=your_mongo_connection_string
# JWT_SECRET=your_jwt_secret
# FRONTEND_URL=http://localhost:5174

# Seed the database with the initial custom FAQs and Admin account
npx tsx src/scripts/seedFAQs.ts

# Start the dev server
npm run dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install

# Start the Vite development server
npm run dev
```

### 3. Access the Application
- **Public Site**: Navigate to `http://localhost:5174`
- **Admin Dashboard**: Navigate to `http://localhost:5174/login`
  - *Default Credentials (from seed)*:
  - **Email**: `admin@vicharanashala.ai`
  - **Password**: `Admin@1234`
