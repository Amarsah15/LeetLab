import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useAuthStore } from "./store/useAuthStore";
import { Home, Loader } from "lucide-react";
import Layout from "./layout/Layout";
import AdminRoute from "./components/AdminRoute";
import AddProblem from "./pages/AddProblem";
import ProblemPage from "./pages/ProblemPage";
import ProfilePage from "./pages/ProfilePage";
import ProblemsPage from "./pages/ProblemsPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster />
      <Routes>
        {/* Default route - HomePage for non-logged in, redirect to problems for logged in */}
        <Route
          path="/"
          element={
            authUser ? <Navigate to="/problems" replace /> : <HomePage />
          }
        />

        {/* Home page - accessible to non-logged in users */}
        <Route
          path="/home"
          element={
            !authUser ? <HomePage /> : <Navigate to="/problems" replace />
          }
        />

        {/* Auth routes */}
        <Route
          path="/login"
          element={
            !authUser ? <LoginPage /> : <Navigate to="/problems" replace />
          }
        />
        <Route
          path="/signup"
          element={
            !authUser ? <SignUpPage /> : <Navigate to="/problems" replace />
          }
        />

        {/* Protected routes with Layout */}
        {authUser ? (
          <Route element={<Layout />}>
            <Route path="/problems" element={<ProblemsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/problem/:id" element={<ProblemPage />} />
          </Route>
        ) : (
          <>
            <Route path="/problems" element={<Navigate to="/" replace />} />
            <Route path="/profile" element={<Navigate to="/" replace />} />
            <Route path="/problem/:id" element={<Navigate to="/" replace />} />
          </>
        )}

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route
            path="/add-problem"
            element={authUser ? <AddProblem /> : <Navigate to="/" replace />}
          />
        </Route>

        {/* 404 - Catch all unmatched routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
