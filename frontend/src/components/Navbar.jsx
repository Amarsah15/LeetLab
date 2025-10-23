import React from "react";
import { User, Code, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { motion } from "framer-motion";
import { useState } from "react";
import { useEffect } from "react";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const [theme, setTheme] = useState("dark");

  const useProfile = (name = "Profile") => {
    const words = name.trim().split(" ");
    const initials =
      words.length > 1 ? words[0][0] + words[words.length - 1][0] : words[0][0];
    return initials.toUpperCase();
  };

  // Apply theme to <html> tag
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="w-full flex justify-between items-center px-6 sm:px-8 md:px-12 lg:px-20 xl:px-32 py-4 shadow-lg border-b border-base-300 sticky top-0 z-50 backdrop-blur-md bg-base-100/95">
      {/* Logo Section */}
      <motion.div whileHover={{ scale: 1.05 }}>
        <Link to="/problems" className="flex items-center gap-3 cursor-pointer">
          <img src="/leetlab.svg" className="h-8 w-8" alt="LeetLab Logo" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            LeetLab
          </span>
        </Link>
      </motion.div>

      {/* User Profile and Dropdown */}
      <div className="flex items-center gap-4">
        <motion.button
          className="btn btn-ghost btn-sm sm:btn-md gap-2"
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {theme === "dark" ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
              Dark
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Light
            </>
          )}
        </motion.button>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 h-10 pt-2 bg-gradient-to-r from-blue-800 to-blue-500 rounded-full flex items-center justify-center font-bold">
              <p>{useProfile(authUser ? authUser.name : "Profile")}</p>
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 space-y-3"
          >
            {/* Common Options */}
            <li className=" border-gray-200/10 border-b-3">
              <p className="text-base font-semibold mx-auto">
                {authUser?.name}
              </p>
            </li>
            <li>
              <Link
                to="/profile"
                className="hover:bg-primary hover:text-white text-base font-semibold"
              >
                <User className="w-4 h-4 mr-2" />
                My Profile
              </Link>
            </li>
            {authUser?.role === "ADMIN" && (
              <li>
                <Link
                  to="/add-problem"
                  className="hover:bg-primary hover:text-white text-base font-semibold"
                >
                  <Code className="w-4 h-4 mr-1" />
                  Add Problem
                </Link>
              </li>
            )}
            <li>
              <LogoutButton className="hover:bg-primary hover:text-white">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </LogoutButton>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
