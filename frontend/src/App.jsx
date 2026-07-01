import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useAuthStore } from "./store/useAuthStore";
import Layout from "./layout/Layout";
import AdminRoute from "./components/AdminRoute";
import AddProblem from "./pages/AddProblem";
import ProblemPage from "./pages/ProblemPage";
import ProfilePage from "./pages/ProfilePage";
import ProblemsPage from "./pages/ProblemsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import PlaylistsPage from "./pages/PlaylistsPage";
import AdminPage from "./pages/AdminPage";
import ForgotPassword from "./components/ForgotPassword";
import Navbar from "./components/Navbar";

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
);

const AuthLayout = () => (
  <div className="min-h-screen flex flex-col bg-[#0a0a0f]">
    <Navbar />
    <main className="flex-1 flex flex-col">
      <Outlet />
    </main>
  </div>
);

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Dynamic page title based on route
  useEffect(() => {
    const path = location.pathname;
    const titleMap = {
      "/": "LeetLab - Master Coding Interviews",
      "/home": "LeetLab - Master Coding Interviews",
      "/login": "Login - LeetLab",
      "/signup": "Sign Up - LeetLab",
      "/forgot-password": "Forgot Password - LeetLab",
      "/problems": "Problems - LeetLab",
      "/leaderboard": "Leaderboard - LeetLab",
      "/playlists": "Playlists - LeetLab",
      "/profile": "Profile - LeetLab",
      "/add-problem": "Add Problem - LeetLab",
      "/admin": "Admin Dashboard - LeetLab",
    };

    // Problem page title is set inside ProblemPage.jsx once the problem loads
    if (!path.startsWith("/problem/")) {
      document.title = titleMap[path] ?? "LeetLab";
    }
  }, [location.pathname]);

  if (isCheckingAuth) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-base-100 relative overflow-hidden">
        {/* Ambient gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/20 blur-[100px] animate-mesh" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-secondary/20 blur-[100px] animate-mesh delay-1000" />

        {/* Logo + Spinner */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative">
            {/* Spinning ring */}
            <div className="w-20 h-20 rounded-full border-2 border-transparent border-t-primary border-r-secondary animate-spin-slow" />
            {/* Logo in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="/leetlab.svg" className="w-8 h-8" alt="LeetLab" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <h1 className="text-xl font-bold gradient-text">LeetLab</h1>
            <p className="text-base-content/40 text-sm font-medium">
              Loading your workspace...
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-48 h-1 rounded-full bg-base-300 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary animate-progress" />
          </div>
        </div>

        <p className="absolute bottom-6 text-xs text-base-content/30 font-medium">
          © {new Date().getFullYear()} LeetLab - Amarnath Kumar
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.875rem",
            fontWeight: 500,
            borderRadius: "0.75rem",
            padding: "12px 16px",
            background: "var(--ll-glass-bg)",
            backdropFilter: "blur(20px)",
            color: "oklch(var(--bc))",
            border: "1px solid var(--ll-glass-border)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          },
          success: {
            iconTheme: { primary: "#10b981", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#f43f5e", secondary: "#fff" },
          },
        }}
      />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Default route */}
          <Route
            path="/"
            element={
              authUser ? (
                <Navigate to="/problems" replace />
              ) : (
                <PageWrapper>
                  <HomePage />
                </PageWrapper>
              )
            }
          />

          {/* Home page */}
          <Route
            path="/home"
            element={
              !authUser ? (
                <PageWrapper>
                  <HomePage />
                </PageWrapper>
              ) : (
                <Navigate to="/problems" replace />
              )
            }
          />

          {/* Auth Layout wrapped routes */}
          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={
                !authUser ? (
                  <PageWrapper>
                    <LoginPage />
                  </PageWrapper>
                ) : (
                  <Navigate to="/problems" replace />
                )
              }
            />
            <Route
              path="/signup"
              element={
                !authUser ? (
                  <PageWrapper>
                    <SignUpPage />
                  </PageWrapper>
                ) : (
                  <Navigate to="/problems" replace />
                )
              }
            />
          </Route>

          <Route
            path="/forgot-password"
            element={
              !authUser ? (
                <PageWrapper>
                  <ForgotPassword />
                </PageWrapper>
              ) : (
                <Navigate to="/problems" replace />
              )
            }
          />

          {/* Protected routes with Layout */}
          {authUser ? (
            <Route element={<Layout />}>
              <Route
                path="/problems"
                element={
                  <PageWrapper>
                    <ProblemsPage />
                  </PageWrapper>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <PageWrapper>
                    <LeaderboardPage />
                  </PageWrapper>
                }
              />
              <Route
                path="/playlists"
                element={
                  <PageWrapper>
                    <PlaylistsPage />
                  </PageWrapper>
                }
              />
              <Route
                path="/profile"
                element={
                  <PageWrapper>
                    <ProfilePage />
                  </PageWrapper>
                }
              />
              <Route path="/problem/:id" element={<ProblemPage />} />

              {/* Admin routes with Layout */}
              <Route element={<AdminRoute />}>
                <Route
                  path="/add-problem"
                  element={
                    <PageWrapper>
                      <AddProblem />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <PageWrapper>
                      <AdminPage />
                    </PageWrapper>
                  }
                />
              </Route>
            </Route>
          ) : (
            <>
              <Route path="/problems" element={<Navigate to="/login" replace />} />
              <Route
                path="/leaderboard"
                element={<Navigate to="/login" replace />}
              />
              <Route path="/playlists" element={<Navigate to="/login" replace />} />
              <Route path="/profile" element={<Navigate to="/login" replace />} />
              <Route
                path="/problem/:id"
                element={<Navigate to="/login" replace />}
              />
              <Route
                path="/add-problem"
                element={<Navigate to="/login" replace />}
              />
              <Route path="/admin" element={<Navigate to="/login" replace />} />
            </>
          )}

          {/* 404 */}
          <Route
            path="*"
            element={
              <PageWrapper>
                <NotFoundPage />
              </PageWrapper>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;
