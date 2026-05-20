> **Note:** To run this project, third-party cookies are required. Please enable them if prompted, or adjust your browser's settings to allow them.

<div align="center">

# 💻 LeetLab

**A Modern Competitive Programming Platform**

[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.9-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Live Demo](https://leetlab-rho.vercel.app/) • [Documentation](#) • [Report Bug](#) • [Features](#-features)

</div>

---

## About

LeetLab is a full-stack competitive programming platform designed to help developers practice coding problems, master algorithms, and track their progress. With an intuitive interface, real-time code execution, and AI-powered assistance, it provides a complete learning experience.

### Built with Modern Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS + DaisyUI
- **Backend**: Node.js + Express 5 + MongoDB
- **Code Execution**: Judge0 API Integration
- **AI Features**: Google Generative AI Integration

---

## Screenshots

![LeetLab Screenshot](/frontend/public/image-5.png)

![LeetLab Screenshot](/frontend/public/image.png)

![LeetLab Screenshot](/frontend/public/image-1.png)

![LeetLab Screenshot](/frontend/public/image-2.png)

![LeetLab Screenshot](/frontend/public/image-3.png)

![LeetLab Screenshot](/frontend/public/image-4.png)

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Frontend Setup](#-frontend-setup)
- [Backend Setup](#-backend-setup)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [License](#-license)

---

## Features

### Core Features

- **Interactive Code Editor** - Monaco Editor with syntax highlighting (JavaScript, Python, Java)
- **Real-time Code Execution** - Judge0 API integration for instant feedback
- **AI-Powered Hints** - Google Generative AI for problem hints and solutions
- **Comprehensive Problem Library** - Wide range of coding problems with detailed descriptions
- **Multi-Language Support** - Write solutions in JavaScript, Python, or Java
- **Test Case Validation** - Predefined test cases for automatic solution verification

### Authentication & Security

- **JWT-based Authentication** - Secure token-based user sessions
- **OTP Verification** - Email-based OTP for account creation and password reset
- **Password Hashing** - Bcryptjs for secure password storage
- **Cookie Management** - Secure HTTP-only cookies for authentication

### User Experience

- **Submission Tracking** - View history with runtime, memory usage, and status
- **Dark/Light Mode** - Theme support for user preference
- **Responsive Design** - Seamless experience on desktop, tablet, and mobile
- **User Profiles** - Track progress, statistics, and activity history
- **Custom Playlists** - Organize and group problems by difficulty or topic

### Admin Features

- **Admin Panel** - Manage problems and submissions
- **Problem Management** - Create, edit, and delete coding problems
- **Submission Management** - Review and manage user submissions

---

## Tech Stack

### Frontend

| Technology          | Version  | Purpose           |
| ------------------- | -------- | ----------------- |
| **React**           | 19.1.0   | UI Framework      |
| **Vite**            | 6.3.5    | Build Tool        |
| **Tailwind CSS**    | 4.1.6    | Styling           |
| **DaisyUI**         | 5.0.35   | UI Components     |
| **Monaco Editor**   | 0.52.2   | Code Editor       |
| **React Router**    | 7.6.0    | Routing           |
| **Zustand**         | 5.0.4    | State Management  |
| **Axios**           | 1.9.0    | HTTP Client       |
| **React Hook Form** | 7.56.3   | Form Management   |
| **Zod**             | 3.24.4   | Schema Validation |
| **Framer Motion**   | 12.23.24 | Animations        |
| **Lucide React**    | 0.509.0  | Icons             |

### Backend

| Technology               | Version | Purpose          |
| ------------------------ | ------- | ---------------- |
| **Node.js**              | LTS     | Runtime          |
| **Express**              | 5.1.0   | Web Framework    |
| **MongoDB**              | 8.9.0   | Database         |
| **Mongoose**             | 8.9.0   | ODM              |
| **Google Generative AI** | 0.24.1  | AI Integration   |
| **Judge0 API**           | -       | Code Execution   |
| **JWT**                  | 9.0.2   | Authentication   |
| **Bcryptjs**             | 3.0.2   | Password Hashing |
| **Nodemailer**           | 7.0.5   | Email Service    |
| **OTP Generator**        | 4.0.1   | OTP Generation   |

---

## Project Structure

```
LeetLab/
├── frontend/                 # React Vite Application
│   ├── src/
│   │   ├── components/      # Reusable UI Components
│   │   ├── pages/           # Page Components
│   │   ├── store/           # Zustand State Management
│   │   ├── lib/             # Utilities & API Clients
│   │   ├── assets/          # Images & Static Files
│   │   └── App.jsx          # Root Component
│   ├── package.json         # Frontend Dependencies
│   └── vite.config.js       # Vite Configuration
│
└── backend/                  # Node.js Express Application
    ├── src/
    │   ├── controllers/     # Route Controllers
    │   ├── models/          # MongoDB Schemas
    │   ├── routes/          # API Routes
    │   ├── middlewares/     # Custom Middlewares
    │   ├── libs/            # Utility Functions
    │   └── index.js         # Express App Entry
    ├── package.json         # Backend Dependencies
    └── .env                 # Environment Variables
```

---

## Frontend Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation & Running

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env` file**

   ```bash
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

   > Frontend will run on `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

### Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

## Backend Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (Local or Atlas)
- npm or yarn

### Installation & Running

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env` file**

   ```bash
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/leetlab
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_API_KEY=your_google_api_key
   JUDGE0_API_KEY=your_judge0_api_key
   SMTP_EMAIL=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

   > Backend will run on `http://localhost:5000`

5. **Start production server**
   ```bash
   npm start
   ```

### Available Scripts

- `npm run dev` - Start with Nodemon (auto-reload)
- `npm run start` - Run production server
- `npm run build` - Install dependencies

### API Endpoints

| Method          | Endpoint               | Description               |
| --------------- | ---------------------- | ------------------------- |
| **Auth**        |                        |                           |
| POST            | `/api/auth/register`   | User Registration         |
| POST            | `/api/auth/login`      | User Login                |
| POST            | `/api/auth/send-otp`   | Send OTP for verification |
| POST            | `/api/auth/verify-otp` | Verify OTP                |
| **Problems**    |                        |                           |
| GET             | `/api/problems`        | Get all problems          |
| GET             | `/api/problems/:id`    | Get problem details       |
| POST            | `/api/problems`        | Create problem (Admin)    |
| PUT             | `/api/problems/:id`    | Update problem (Admin)    |
| DELETE          | `/api/problems/:id`    | Delete problem (Admin)    |
| **Execution**   |                        |                           |
| POST            | `/api/execute`         | Execute code              |
| **Submissions** |                        |                           |
| POST            | `/api/submissions`     | Submit solution           |
| GET             | `/api/submissions`     | Get user submissions      |
| **Playlists**   |                        |                           |
| GET             | `/api/playlists`       | Get user playlists        |
| POST            | `/api/playlists`       | Create playlist           |
| PUT             | `/api/playlists/:id`   | Update playlist           |
| **AI**          |                        |                           |
| POST            | `/api/ai/hint`         | Get AI hint for problem   |
| POST            | `/api/ai/solution`     | Get AI solution           |

---

## Environment Variables

### Frontend (`.env`)

```env
VITE_API_BASE_URL=http://localhost:5000
```

### Backend (`.env`)

```env
# Server
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/leetlab

# Authentication
JWT_SECRET=your_very_secure_jwt_secret_key_change_in_production
JWT_EXPIRE=7d

# Google AI
GOOGLE_API_KEY=your_google_generative_ai_api_key

# Judge0 Code Execution
JUDGE0_API_KEY=your_judge0_api_key
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com

# Email Service (Gmail)
SMTP_EMAIL=your_gmail@gmail.com
SMTP_PASSWORD=your_app_specific_password

# CORS
FRONTEND_URL=http://localhost:5173
PRODUCTION_URL=https://leetlab-rho.vercel.app
```

---

## License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## Author

Made with ❤️ by **Amarnath Kumar**

- **Email**: amarnath.kumar152003@gmail.com
- **LinkedIn**: [Amarnath Kumar](https://linkedin.com/in/Amarnath15)
- **GitHub**: [Amarsah15](https://github.com/Amarsah15)
- **Portfolio**: [https://amar-portfolio-psi.vercel.app/](https://amar-portfolio-psi.vercel.app/)

---

<div align="center">

### If this project helped you, please star the repository!

[Report Bug](https://github.com/Amarsah15/LeetLab/issues) • [Request Feature](https://github.com/Amarsah15/LeetLab/issues)

**Made with ❤️ by Amarnath Kumar**

</div>
