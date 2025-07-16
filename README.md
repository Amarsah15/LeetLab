# Full Stack Web Application

This is a full-stack web application consisting of:

- **Frontend** built with **Vite** + **React**, **Tailwind CSS** and **DaisyUI**
- **Backend** using **Node.js**, **Express**, and **Prisma** ORM

---

# LeetLab
LeetLab is a platform designed to help users practice coding problems, learn algorithms, and improve their programming skills. It features a user-friendly interface, problem-solving capabilities, and integration with coding challenge APIs.

<!-- 5 Screenshot -->
![LeetLab Screenshot](![alt text](image.png))
![LeetLab Screenshot](![alt text](image-1.png))
![LeetLab Screenshot](![alt text](image-2.png))
![LeetLab Screenshot](![alt text](image-3.png))
![LeetLab Screenshot](![alt text](image-4.png))



## 📖 Table of Contents
- [🧩 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🌐 Frontend Setup](#-frontend-setup)
- [⚙️ Backend Setup](#-backend-setup)
- [🛠️ Prisma Setup](#-prisma-setup)
- [📦 Environment Variables](#-environment-variables)
- [📝 License](#-license)
- [✨ Author](#-author)

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
