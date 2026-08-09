<div align="center">

<img src="/frontend/public/leetlab.svg" alt="LeetLab Logo" width="80" height="80" />

# LeetLab

### 🚀 A Modern Competitive Programming Platform

Practice coding problems • Execute code in real-time • Track your progress • Get AI-powered assistance

[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-5.1-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Swagger](https://img.shields.io/badge/Swagger-API_Docs-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)

<br />

[🌐 Live Demo](https://leetlab.amarnathkumar.dev/) · [🐛 Report Bug](https://github.com/Amarsah15/LeetLab/issues) · [✨ Request Feature](https://github.com/Amarsah15/LeetLab/issues)

</div>

<br />

---

## 📸 Screenshots

<div align="center">

|                                              |                                              |
| :------------------------------------------: | :------------------------------------------: |
|  ![Home Page](/frontend/public/image-5.png)  | ![Problem List](/frontend/public/image.png)  |
|                **Home Page**                 |             **Problem Library**              |
| ![Code Editor](/frontend/public/image-1.png) | ![Submissions](/frontend/public/image-2.png) |
|         **Interactive Code Editor**          |           **Submission Tracking**            |
|   ![Profile](/frontend/public/image-3.png)   |  ![Playlists](/frontend/public/image-4.png)  |
|           **User Profile & Stats**           |             **Custom Playlists**             |

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 💻 Code & Execute

- **Monaco Editor** with syntax highlighting for JavaScript, Python, Java, and C++
- **Real-time execution** via Judge0 API with test case validation
- **Submission tracking** — runtime, memory usage, status history
- **Problem editorial** tab with official solutions

</td>
<td width="50%">

### 🤖 AI-Powered Assistance

- **Complexity analysis** — instant Big-O time & space breakdown
- **Smart hints** — context-aware guidance without spoilers
- **Code improvements** — AI suggestions for optimization
- Powered by **Google Gemini**

</td>
</tr>
<tr>
<td width="50%">

### 🔐 Security & Auth

- **JWT authentication** with HTTP-only cookies
- **Email OTP verification** for registration & password reset
- **Helmet** security headers
- **Rate limiting** on auth, AI, and code execution routes
- **Request body size limit** (1MB)

</td>
<td width="50%">

### 📊 User Experience

- **Responsive design** — desktop, tablet, and mobile
- **Dark/Light mode** with DaisyUI themes
- **Profile dashboard** with stats, streaks, and activity
- **Leaderboard** — compete with other users
- **Discussion forums** on each problem
- **Custom playlists** to organize practice

</td>
</tr>
</table>

### 🛠️ Admin Features

- Problem CRUD (create, update, delete) with code validation
- Admin analytics dashboard
- Swagger API documentation at `/api-docs`

---

## 🏗️ Tech Stack

<details>
<summary><strong>Frontend</strong></summary>

| Technology            | Version | Purpose                    |
| :-------------------- | :-----: | :------------------------- |
| React                 |  19.1   | UI framework               |
| Vite                  |   6.3   | Build tool & dev server    |
| Tailwind CSS          |   4.1   | Utility-first styling      |
| DaisyUI               |   5.0   | Component library          |
| Monaco Editor         |  0.52   | Code editor                |
| Zustand               |   5.0   | State management           |
| React Router          |   7.6   | Client-side routing        |
| React Hook Form + Zod |    —    | Form handling & validation |
| Framer Motion         |  12.23  | Animations                 |
| Lucide React          |  0.509  | Icon library               |

</details>

<details>
<summary><strong>Backend</strong></summary>

| Technology           |  Version  | Purpose                |
| :------------------- | :-------: | :--------------------- |
| Node.js              |    18+    | Runtime                |
| Express              |    5.1    | Web framework          |
| MongoDB + Mongoose   |    8.9    | Database & ODM         |
| Google Generative AI |   0.24    | Gemini AI integration  |
| Judge0 (RapidAPI)    | External  | Code execution engine  |
| Brevo API            | External  | Transactional emails   |
| JWT                  |    9.0    | Authentication tokens  |
| Bcryptjs             |    3.0    | Password hashing       |
| Helmet               |    8.2    | Security headers       |
| Express Rate Limit   |    8.5    | Request throttling     |
| Swagger (JSDoc + UI) | 6.3 / 5.0 | API documentation      |
| Zod                  |    4.4    | Server-side validation |

</details>

---

## 📁 Project Structure

```
LeetLab/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── layout/          # Page layouts
│   │   ├── lib/             # Utilities & API client
│   │   ├── pages/           # Route pages
│   │   ├── store/           # Zustand state stores
│   │   └── App.jsx          # Root component
│   ├── public/              # Static assets
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── src/
    │   ├── controllers/     # Route handlers
    │   ├── libs/            # Database, Judge0, Swagger, email
    │   ├── middlewares/     # Auth, rate limiting, uploads
    │   ├── models/          # Mongoose schemas
    │   ├── routes/          # API route definitions
    │   └── index.js         # Express app entrypoint
    ├── package.json
    └── .env
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** package manager
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **Brevo** account — [Transactional Email API key](https://www.brevo.com/)
- **RapidAPI** — [Judge0 CE credentials](https://rapidapi.com/judge0-official/api/judge0-ce)
- **Google AI** — [Gemini API key](https://ai.google.dev/)

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file (see template below)
cp .env.example .env

# 4. Start development server
npm run dev
```

The backend runs at `http://localhost:8000`

### Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The frontend runs at `http://localhost:5173`

> **Note:** The frontend API base URL is configured in `frontend/src/lib/axios.js`. Update the `baseURL` if your backend runs on a different port or deployment URL.

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory:

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

| Variable         | Required | Description                           |
| :--------------- | :------: | :------------------------------------ |
| `PORT`           |    ✅    | Backend server port (default: `8000`) |
| `MONGODB_URI`    |    ✅    | MongoDB connection string             |
| `JWT_SECRET`     |    ✅    | Secret for signing JWT auth cookies   |
| `GEMINI_API_KEY` |    ✅    | Google Gemini API key                 |
| `JUDGE0_API_URL` |    ✅    | Judge0 API base URL                   |
| `RAPID_API_KEY`  |    ✅    | RapidAPI key for Judge0               |
| `RAPID_API_HOST` |    ✅    | RapidAPI host for Judge0              |
| `BREVO_API_KEY`  |    ✅    | Brevo Transactional Email API key     |
| `EMAIL_FROM`     |    ✅    | Verified sender email in Brevo        |
| `CLIENT_URL`     |    ✅    | Frontend URL for email links          |

---

## 📡 API Reference

All endpoints are prefixed with `/api/v1`. Full interactive documentation available at **`/api-docs`** (Swagger UI).

<details>
<summary><strong>🔐 Authentication</strong></summary>

| Method | Endpoint                           | Description                 |
| :----- | :--------------------------------- | :-------------------------- |
| `POST` | `/auth/login`                      | Log in a user               |
| `POST` | `/auth/logout`                     | Log out current user        |
| `GET`  | `/auth/check`                      | Check authentication status |
| `POST` | `/auth/request-otp-register`       | Request registration OTP    |
| `POST` | `/auth/verify-otp-register`        | Verify OTP & create account |
| `POST` | `/auth/request-password-reset-otp` | Request password reset OTP  |
| `POST` | `/auth/reset-password-with-otp`    | Reset password with OTP     |

</details>

<details>
<summary><strong>📝 Problems</strong></summary>

| Method   | Endpoint                        | Description                |
| :------- | :------------------------------ | :------------------------- |
| `GET`    | `/problems/get-all-problems`    | Get all problems           |
| `GET`    | `/problems/get-problem/:id`     | Get problem by ID          |
| `GET`    | `/problems/get-solved-problems` | Get user's solved problems |
| `POST`   | `/problems/create-problem`      | Create problem _(admin)_   |
| `PUT`    | `/problems/update-problem/:id`  | Update problem _(admin)_   |
| `DELETE` | `/problems/delete-problem/:id`  | Delete problem _(admin)_   |

</details>

<details>
<summary><strong>▶️ Code Execution</strong></summary>

| Method | Endpoint        | Description             |
| :----- | :-------------- | :---------------------- |
| `POST` | `/execute-code` | Execute code via Judge0 |

</details>

<details>
<summary><strong>📊 Submissions</strong></summary>

| Method | Endpoint                                       | Description                   |
| :----- | :--------------------------------------------- | :---------------------------- |
| `GET`  | `/submission/get-all-submissions`              | Get user's submissions        |
| `GET`  | `/submission/get-submission/:problemId`        | Get submissions for a problem |
| `GET`  | `/submission/get-submissions-count/:problemId` | Get submission count          |
| `GET`  | `/submission/success-rate/:problemId`          | Get success rate              |

</details>

<details>
<summary><strong>📋 Playlists</strong></summary>

| Method   | Endpoint                               | Description                  |
| :------- | :------------------------------------- | :--------------------------- |
| `GET`    | `/playlist`                            | Get user's playlists         |
| `GET`    | `/playlist/:playlistId`                | Get playlist details         |
| `POST`   | `/playlist/create-playlist`            | Create a playlist            |
| `POST`   | `/playlist/:playlistId/add-problem`    | Add problem to playlist      |
| `DELETE` | `/playlist/:playlistId`                | Delete playlist              |
| `DELETE` | `/playlist/:playlistId/remove-problem` | Remove problem from playlist |

</details>

<details>
<summary><strong>💬 Discussions</strong></summary>

| Method   | Endpoint                            | Description                   |
| :------- | :---------------------------------- | :---------------------------- |
| `GET`    | `/discussions/:problemId`           | Get discussions for a problem |
| `POST`   | `/discussions/:problemId`           | Create a discussion           |
| `PUT`    | `/discussions/:discussionId`        | Update a discussion           |
| `DELETE` | `/discussions/:discussionId`        | Delete a discussion           |
| `POST`   | `/discussions/:discussionId/upvote` | Toggle upvote                 |

</details>

<details>
<summary><strong>🤖 AI</strong></summary>

| Method | Endpoint                 | Description                      |
| :----- | :----------------------- | :------------------------------- |
| `POST` | `/ai/analyze-complexity` | Analyze time & space complexity  |
| `POST` | `/ai/get-hint`           | Get AI hint for a problem        |
| `POST` | `/ai/get-improvements`   | Get code improvement suggestions |

</details>

<details>
<summary><strong>🏆 Leaderboard & User</strong></summary>

| Method   | Endpoint              | Description                 |
| :------- | :-------------------- | :-------------------------- |
| `GET`    | `/leaderboard`        | Get leaderboard rankings    |
| `PUT`    | `/user/profile-image` | Upload/update profile image |
| `DELETE` | `/user/profile-image` | Remove profile image        |

</details>

<details>
<summary><strong>🔧 Admin & Health</strong></summary>

| Method | Endpoint           | Description               |
| :----- | :----------------- | :------------------------ |
| `GET`  | `/admin/analytics` | Admin analytics dashboard |
| `GET`  | `/health-check`    | API health check          |

</details>

---

## 📜 Available Scripts

### Backend

| Script      | Command         | Description                      |
| :---------- | :-------------- | :------------------------------- |
| Development | `npm run dev`   | Start with Nodemon (auto-reload) |
| Production  | `npm start`     | Start with Node.js               |
| Install     | `npm run build` | Install dependencies             |

### Frontend

| Script      | Command           | Description              |
| :---------- | :---------------- | :----------------------- |
| Development | `npm run dev`     | Start Vite dev server    |
| Build       | `npm run build`   | Build for production     |
| Preview     | `npm run preview` | Preview production build |
| Lint        | `npm run lint`    | Run ESLint               |

---

## 🌐 Deployment Notes

- Update **CORS origins** in `backend/src/index.js` when adding new frontend domains
- Update **`CLIENT_URL`** in `.env` so email links point to the deployed frontend
- Update **`baseURL`** in `frontend/src/lib/axios.js` to point to the deployed backend
- JWT cookies require **HTTPS** in production (`secure: true`, `sameSite: "None"`)
- Swagger API docs are accessible at **`/api-docs`** on the deployed backend

---

## 📧 Email Setup

LeetLab uses the **Brevo Transactional Email API** for sending emails.

| Email Type         | Trigger                          |
| :----------------- | :------------------------------- |
| Registration OTP   | User requests account creation   |
| Password Reset OTP | User requests password change    |
| Welcome Email      | After successful registration    |
| Password Changed   | After successful password update |

> **Note:** `EMAIL_FROM` must be a verified sender in your Brevo account. OTPs expire after 10 minutes.

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">

## 👨‍💻 Author

**Amarnath Kumar**

[![Email](https://img.shields.io/badge/Email-amarnath.kumar152003@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:amarnath.kumar152003@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Amarnath15-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/Amarnath15)
[![GitHub](https://img.shields.io/badge/GitHub-Amarsah15-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Amarsah15)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white)](https://amar-portfolio-psi.vercel.app/)

---

### ⭐ If this project helped you, please give it a star!

[🐛 Report Bug](https://github.com/Amarsah15/LeetLab/issues) · [✨ Request Feature](https://github.com/Amarsah15/LeetLab/issues)

</div>
