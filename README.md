<div align="center">

# LeetLab

**A modern competitive programming platform**

[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.9-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Live Demo](https://leetlab-rho.vercel.app/) | [Report Bug](https://github.com/Amarsah15/LeetLab/issues) | [Request Feature](https://github.com/Amarsah15/LeetLab/issues)

</div>

---

## About

LeetLab is a full-stack competitive programming platform for practicing coding problems, running code against test cases, tracking submissions, organizing playlists, and getting AI-powered guidance while solving problems.

### Built With

- **Frontend:** React 19, Vite, Tailwind CSS, DaisyUI
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Code Execution:** Judge0 through RapidAPI
- **AI:** Google Gemini
- **Email:** Brevo Transactional Email API

---

## Screenshots

![LeetLab Screenshot](/frontend/public/image-5.png)

![LeetLab Screenshot](/frontend/public/image.png)

![LeetLab Screenshot](/frontend/public/image-1.png)

![LeetLab Screenshot](/frontend/public/image-2.png)

![LeetLab Screenshot](/frontend/public/image-3.png)

![LeetLab Screenshot](/frontend/public/image-4.png)

---

## Features

### Core Features

- **Interactive Code Editor** - Monaco Editor with JavaScript, Python, and Java support
- **Real-time Code Execution** - Judge0 integration for running and validating code
- **AI-Powered Help** - Gemini-powered hints, complexity analysis, and improvement suggestions
- **Problem Library** - Coding problems with descriptions, examples, constraints, and test cases
- **Submission Tracking** - Runtime, memory usage, status, and submission history
- **Custom Playlists** - Create playlists and group problems for focused practice

### Authentication & Security

- **JWT Authentication** - Secure HTTP-only cookie based sessions
- **Email OTP Verification** - OTP flow for registration and password changes
- **Brevo Email Delivery** - Transactional emails for OTP, welcome, and password update messages
- **Password Hashing** - Bcryptjs for password storage
- **OTP Expiry** - OTP records expire after 10 minutes

### User Experience

- **Responsive UI** - Works across desktop, tablet, and mobile
- **Dark/Light Mode** - Theme support through DaisyUI
- **Profile Dashboard** - User stats, activity graph, submissions, and playlists
- **Admin Controls** - Admin-only problem creation, editing, and deletion

---

## Tech Stack

### Frontend

| Technology      | Version  | Purpose          |
| --------------- | -------- | ---------------- |
| React           | 19.1.0   | UI framework     |
| Vite            | 6.3.5    | Build tool       |
| Tailwind CSS    | 4.1.6    | Styling          |
| DaisyUI         | 5.0.35   | UI components    |
| Monaco Editor   | 0.52.2   | Code editor      |
| React Router    | 7.6.0    | Routing          |
| Zustand         | 5.0.4    | State management |
| Axios           | 1.9.0    | HTTP client      |
| React Hook Form | 7.56.3   | Form handling    |
| Zod             | 3.24.4   | Validation       |
| Framer Motion   | 12.23.24 | Animations       |
| Lucide React    | 0.509.0  | Icons            |

### Backend

| Technology           | Version  | Purpose                      |
| -------------------- | -------- | ---------------------------- |
| Node.js              | 18+      | Runtime                      |
| Express              | 5.1.0    | Web framework                |
| MongoDB              | 8.9.0    | Database                     |
| Mongoose             | 8.9.0    | ODM                          |
| Google Generative AI | 0.24.1   | Gemini integration           |
| Judge0 API           | External | Code execution               |
| Brevo API            | External | Transactional email delivery |
| JWT                  | 9.0.2    | Authentication               |
| Bcryptjs             | 3.0.2    | Password hashing             |
| OTP Generator        | 4.0.1    | OTP generation               |

---

## Project Structure

```text
LeetLab/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layout/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── store/
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── src/
    │   ├── controllers/
    │   ├── libs/
    │   ├── middlewares/
    │   ├── models/
    │   ├── routes/
    │   └── index.js
    ├── package.json
    └── .env
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm
- MongoDB local instance or MongoDB Atlas cluster
- Brevo account with a Transactional Email API key
- RapidAPI Judge0 credentials
- Google Gemini API key

---

## Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file:

   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/leetlab

   JWT_SECRET=your_very_secure_jwt_secret

   GEMINI_API_KEY=your_gemini_api_key

   JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
   RAPID_API_KEY=your_rapidapi_key
   RAPID_API_HOST=judge0-ce.p.rapidapi.com

   BREVO_API_KEY=your_brevo_transactional_email_api_key
   EMAIL_FROM=your_verified_sender@example.com
   CLIENT_URL=http://localhost:5173
   ```

4. Start the backend:

   ```bash
   npm run dev
   ```

   The backend should run on `http://localhost:8000` when `PORT=8000`.

### Backend Scripts

- `npm run dev` - Start the API with Nodemon
- `npm start` - Start the API with Node
- `npm run build` - Install backend dependencies

---

## Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend:

   ```bash
   npm run dev
   ```

   The frontend runs on `http://localhost:5173`.

### Frontend API URL

The frontend currently sends API requests to:

```js
http://localhost:8000/api/v1
```

This is configured in `frontend/src/lib/axios.js`. If the backend port or deployment URL changes, update the `baseURL` there.

### Frontend Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

## Email Setup

LeetLab uses the **Brevo Transactional Email API** instead of SMTP/Nodemailer.

Required backend environment variables:

```env
BREVO_API_KEY=your_brevo_transactional_email_api_key
EMAIL_FROM=your_verified_sender@example.com
CLIENT_URL=http://localhost:5173
```

Notes:

- `EMAIL_FROM` must be a sender verified in Brevo.
- Registration OTP and password reset OTP emails are valid for 10 minutes.
- A welcome email is sent after successful registration.
- A password update confirmation email is sent after a successful password change.
- `SMTP_EMAIL` and `SMTP_PASSWORD` are no longer used.

---

## Environment Variables

### Backend

| Variable         | Required | Description                                                      |
| ---------------- | -------- | ---------------------------------------------------------------- |
| `PORT`           | Yes      | Backend server port. Use `8000` for the current frontend config. |
| `MONGODB_URI`    | Yes      | MongoDB connection string.                                       |
| `JWT_SECRET`     | Yes      | Secret used to sign JWT auth cookies.                            |
| `GEMINI_API_KEY` | Yes      | Google Gemini API key for AI features.                           |
| `JUDGE0_API_URL` | Yes      | Judge0 API base URL.                                             |
| `RAPID_API_KEY`  | Yes      | RapidAPI key for Judge0.                                         |
| `RAPID_API_HOST` | Yes      | RapidAPI host for Judge0.                                        |
| `BREVO_API_KEY`  | Yes      | Brevo Transactional Email API key.                               |
| `EMAIL_FROM`     | Yes      | Verified sender email address in Brevo.                          |
| `CLIENT_URL`     | Yes      | Frontend URL used inside email links.                            |

### Frontend

No frontend `.env` variable is currently required for the API URL because `frontend/src/lib/axios.js` uses a fixed `baseURL`.

---

## API Endpoints

All backend routes are mounted under:

```text
/api/v1
```

### Auth

| Method | Endpoint                                  | Description                            |
| ------ | ----------------------------------------- | -------------------------------------- |
| POST   | `/api/v1/auth/login`                      | Log in a user                          |
| POST   | `/api/v1/auth/logout`                     | Log out the authenticated user         |
| GET    | `/api/v1/auth/check`                      | Check current authenticated user       |
| POST   | `/api/v1/auth/request-otp-register`       | Send registration OTP                  |
| POST   | `/api/v1/auth/verify-otp-register`        | Verify OTP and create account          |
| POST   | `/api/v1/auth/request-password-reset-otp` | Send password reset/change OTP         |
| POST   | `/api/v1/auth/reset-password-with-otp`    | Change password after OTP verification |

### Problems

| Method | Endpoint                               | Description                                    |
| ------ | -------------------------------------- | ---------------------------------------------- |
| GET    | `/api/v1/problems/get-all-problems`    | Get all problems                               |
| GET    | `/api/v1/problems/get-problem/:id`     | Get a problem by ID                            |
| GET    | `/api/v1/problems/get-sloved-problems` | Get solved problems for the authenticated user |
| POST   | `/api/v1/problems/create-problem`      | Create a problem, admin only                   |
| PUT    | `/api/v1/problems/update-problem/:id`  | Update a problem, admin only                   |
| DELETE | `/api/v1/problems/delete-problem/:id`  | Delete a problem, admin only                   |

### Code Execution

| Method | Endpoint               | Description                 |
| ------ | ---------------------- | --------------------------- |
| POST   | `/api/v1/execute-code` | Execute code through Judge0 |

### Submissions

| Method | Endpoint                                              | Description                          |
| ------ | ----------------------------------------------------- | ------------------------------------ |
| GET    | `/api/v1/submission/get-all-submissions`              | Get authenticated user's submissions |
| GET    | `/api/v1/submission/get-submission/:problemId`        | Get submissions for a problem        |
| GET    | `/api/v1/submission/get-submissions-count/:problemId` | Get submission count for a problem   |
| GET    | `/api/v1/submission/success-rate/:problemId`          | Get success rate for a problem       |

### Playlists

| Method | Endpoint                                      | Description                        |
| ------ | --------------------------------------------- | ---------------------------------- |
| GET    | `/api/v1/playlist`                            | Get authenticated user's playlists |
| GET    | `/api/v1/playlist/:playlistId`                | Get playlist details               |
| POST   | `/api/v1/playlist/create-playlist`            | Create a playlist                  |
| POST   | `/api/v1/playlist/:playlistId/add-problem`    | Add a problem to a playlist        |
| DELETE | `/api/v1/playlist/:playlistId`                | Delete a playlist                  |
| DELETE | `/api/v1/playlist/:playlistId/remove-problem` | Remove a problem from a playlist   |

### AI

| Method | Endpoint                        | Description                            |
| ------ | ------------------------------- | -------------------------------------- |
| POST   | `/api/v1/ai/analyze-complexity` | Analyze code time and space complexity |
| POST   | `/api/v1/ai/get-hint`           | Get an AI hint for a problem           |
| POST   | `/api/v1/ai/get-improvements`   | Get AI suggestions for improving code  |

### Health Check

| Method | Endpoint               | Description       |
| ------ | ---------------------- | ----------------- |
| GET    | `/api/v1/health-check` | API health check  |
| GET    | `/health-check`        | Root health check |

---

## Deployment Notes

- Update CORS origins in `backend/src/index.js` when adding a new frontend deployment URL.
- Update `CLIENT_URL` so email buttons point to the deployed frontend.
- Update `frontend/src/lib/axios.js` so the frontend points to the deployed backend API.
- Set `secure: true` and `sameSite: "None"` cookies require HTTPS in production.

---

## License

This project is licensed under the ISC License.

---

## Author

Made by **Amarnath Kumar**

- **Email:** amarnath.kumar152003@gmail.com
- **LinkedIn:** [Amarnath Kumar](https://linkedin.com/in/Amarnath15)
- **GitHub:** [Amarsah15](https://github.com/Amarsah15)
- **Portfolio:** [amar-portfolio-psi.vercel.app](https://amar-portfolio-psi.vercel.app/)

---

<div align="center">

### If this project helped you, please star the repository.

[Report Bug](https://github.com/Amarsah15/LeetLab/issues) | [Request Feature](https://github.com/Amarsah15/LeetLab/issues)

</div>
