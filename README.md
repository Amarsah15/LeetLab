***

**Please Note:** *To run this project, third-party cookies are required. Please enable them if prompted, or adjust your browser's settings to allow them.*

***

# LeetLab

This is a full-stack web application consisting of:

- **Frontend** built with **Vite** + **React**, **Tailwind CSS** and **DaisyUI**
- **Backend** using **Node.js**, **Express**, and **Prisma** ORM

# Demo

You can view the live demo [here](https://leetlab-rho.vercel.app/).

---

## 📚 Overview

LeetLab is a platform designed to help users practice coding problems, learn algorithms, and improve their programming skills. It features a user-friendly interface, problem-solving capabilities, and integration with coding challenge APIs.

- **Dynamic Code Editor**: Powered by Monaco Editor, allowing users to write and test code in real-time.
- **Problem Descriptions**: Detailed problem descriptions, examples, constraints, and hints.
- **Test Cases**: Predefined test cases for each problem to validate solutions.
- **Multi-Language Support**: Write solutions in JavaScript, Python, or Java.
- **Submission Tracking**: View submission history, memory usage, runtime, and status (Accepted, Wrong Answer, etc.).
- **Responsive Design**: Built with modern UI/UX principles for a seamless experience on all devices.

<!-- 5 Screenshot -->

![LeetLab Screenshot](![LeetLab Screenshot](/frontend/public/image.png))

![LeetLab Screenshot](![LeetLab Screenshot](/frontend/public/image-1.png))

![LeetLab Screenshot](![LeetLab Screenshot](/frontend/public/image-2.png))

![LeetLab Screenshot](![LeetLab Screenshot](/frontend/public/image-3.png))

![LeetLab Screenshot](![LeetLab Screenshot](/frontend/public/image-4.png))

## 📖 Table of Contents

- [🚀 Features](#-features)
- [🧩 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🌐 Frontend Setup](#-frontend-setup)
- [⚙️ Backend Setup](#-backend-setup)
- [🛠️ Prisma Setup](#-prisma-setup)
- [📦 Environment Variables](#-environment-variables)
- [📝 License](#-license)
- [✨ Author](#-author)

## 🚀 Features

### 1. **Interactive Code Editor**

- Real-time syntax highlighting using the Monaco Editor.
- Supports JavaScript, Python, and Java.

### 2. **Dynamic Input Parsing**

- Users can submit input dynamically via `readline` or predefined test cases.

### 3. **Problem Details**

- Each problem includes:
  - Description
  - Examples with inputs, outputs, and explanations
  - Constraints
  - Editorial (hints and optimal solutions)

### 4. **Execution and Submission**

- Run code directly in the browser and get instant feedback.
- View execution results, including runtime, memory usage, and error messages.

### 5. **User Authentication**

- Secure login and registration for tracking user progress and submissions.

### 6. **Admin Panel**

- Admins can add new problems, manage submissions.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Monaco Editor
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (or Prisma ORM)
- **Authentication**: JWT (JSON Web Tokens)
- **Code Execution**: Judge0 API (for running and validating code submissions)
- **State Management**: Zustand (React state management library)
- **Version Control**: Git, GitHub

---

## 🧩 Project Structure

```
root/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── package.json
```

---

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/Amarsah15/LeetLab.git
cd backend
npm install
cd frontend
npm install
```

---

## 🌐 Frontend Setup

### 📁 Directory: `frontend/`

**Scripts**:

- `npm run dev` – Start development server
- `npm run build` – Build for production

**Start Dev Server**:

```bash
cd frontend
npm run dev
```

Frontend will typically run on: `http://localhost:5173/`

---

## ⚙️ Backend Setup

### 📁 Directory: `backend/`

**Scripts**:

- `npm run dev` – Run with `nodemon`
- `npm run start` – Start production server
- `npm run build` – Install dependencies

**Start Dev Server**:

```bash
cd backend
npm run dev
```

Backend will typically run on: `http://localhost:8000/`

**Note:** Make sure you create a `.env` file with your environment variables.

---

## 🛠️ Prisma Setup

Ensure your database is set up and run:

```bash
npx prisma generate
npx prisma migrate dev
```

---

## 📦 Environment Variables

Both frontend and backend may require `.env` files. At a minimum, the backend should define:

```env
DATABASE_URL=your_database_connection_url
PORT=port_number
JWT_SECRET=your_jwt_secret
JUDGE0_API_URL=judge0_api_url
RAPID_API_KEY=your_rapid_api_key
RAPID_API_HOST=your_rapid_api_host
```

---

## 📝 License

This project is licensed under the MIT License.

---

## ✨ Author

Made with ❤️ by Amarnath Kumar
