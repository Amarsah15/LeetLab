import React, { useEffect, useRef, useState } from "react";
import {
  User,
  Code,
  LogOut,
  Trophy,
  ListMusic,
  Layers,
  Flame,
  Settings,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, NavLink, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const getInitials = (name = "U") => {
    const words = name.trim().split(" ");
    const initials =
      words.length > 1 ? words[0][0] + words[words.length - 1][0] : words[0][0];
    return initials.toUpperCase();
  };

  const navLinks = [
    {
      to: "/problems",
      label: "Problems",
      icon: <Code className="w-3.5 h-3.5 text-primary" />,
    },
    {
      to: "/leaderboard",
      label: "Leaderboard",
      icon: <Trophy className="w-3.5 h-3.5 text-amber-400" />,
    },
    {
      to: "/playlists",
      label: "Playlists",
      icon: <ListMusic className="w-3.5 h-3.5 text-primary" />,
    },
  ];

  return (
    <nav className="glass-navbar w-full flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-3 sticky top-0 z-50">
      {/* Logo */}
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Link
          to={authUser ? "/problems" : "/"}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <img src="/leetlab.svg" className="h-7 w-7" alt="LeetLab Logo" />
          <span className="text-xl font-bold gradient-text">LeetLab</span>
        </Link>
      </motion.div>

      {/* Desktop Navigation Links */}
      {authUser && (
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-primary bg-primary/8"
                    : "text-base-content/60 hover:text-base-content hover:bg-base-content/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {icon}
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-primary to-secondary"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      )}

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak */}
        {authUser && (
          <motion.div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-base-200/50 border border-base-content/10 shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            <Flame
              className={`w-4 h-4 ${authUser.currentStreak > 0 ? "text-orange-500 fill-orange-500" : "text-base-content/40"}`}
            />
            <span
              className={`text-sm font-bold ${authUser.currentStreak > 0 ? "text-orange-500" : "text-base-content/60"}`}
            >
              {authUser.currentStreak || 0}
            </span>
          </motion.div>
        )}

        {/* User Avatar & Dropdown */}
        {authUser && (
          <div className="relative" ref={dropdownRef}>
            <motion.button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="btn btn-ghost btn-circle overflow-hidden ring-2 ring-primary/20 hover:ring-primary/50 transition-all flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="User profile menu"
            >
              {authUser.image ? (
                <img
                  src={authUser.image}
                  alt={authUser.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white text-sm">
                  {getInitials(authUser.name)}
                </div>
              )}
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-base-200 border border-base-content/10 rounded-2xl p-2.5 shadow-2xl z-[60]"
                >
                  {/* User Info */}
                  <div className="px-3 py-2.5 mb-1 bg-base-300/50 rounded-xl border border-base-content/10">
                    <p className="font-bold text-sm text-base-content truncate">
                      {authUser.name}
                    </p>
                    <p className="text-[11px] text-base-content/60 truncate mt-0.5">
                      {authUser.email}
                    </p>
                  </div>

                  <div className="gradient-divider my-1.5" />

                  {/* Menu Items */}
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-base-content/85 hover:text-base-content hover:bg-base-content/5 transition-colors"
                  >
                    <User className="w-4 h-4 text-purple-450" />
                    My Profile
                  </Link>

                  {/* Mobile-only nav links */}
                  <div className="md:hidden">
                    <Link
                      to="/leaderboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-base-content/85 hover:text-base-content hover:bg-base-content/5 transition-colors"
                    >
                      <Trophy className="w-4 h-4 text-amber-500" />
                      Leaderboard
                    </Link>
                    <Link
                      to="/playlists"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-base-content/85 hover:text-base-content hover:bg-base-content/5 transition-colors"
                    >
                      <ListMusic className="w-4 h-4 text-cyan-500" />
                      Playlists
                    </Link>
                  </div>

                  {authUser.role === "ADMIN" && (
                    <>
                      <Link
                        to="/add-problem"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-base-content/85 hover:text-base-content hover:bg-base-content/5 transition-colors"
                      >
                        <Code className="w-4 h-4 text-purple-455" />
                        Add Problem
                      </Link>
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-base-content/85 hover:text-base-content hover:bg-base-content/5 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-purple-455" />
                        Admin Dashboard
                      </Link>
                    </>
                  )}

                  <div className="gradient-divider my-1.5" />

                  <LogoutButton
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold w-full text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Logout
                  </LogoutButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
