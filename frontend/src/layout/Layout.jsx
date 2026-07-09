import React from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Code, Trophy, ListMusic, User } from "lucide-react";

const Layout = () => {
  const location = useLocation();

  const mobileNavItems = [
    { to: "/problems", icon: Code, label: "Problems" },
    { to: "/leaderboard", icon: Trophy, label: "Ranks" },
    { to: "/playlists", icon: ListMusic, label: "Playlists" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  const isProblemPage = location.pathname.startsWith("/problem/");

  return (
    <div className="relative min-h-screen">
      {/* Desktop navbar */}
      <Navbar />

      {/* Main content */}
      <main
        className={`relative z-10 ${isProblemPage ? "" : "has-bottom-nav"} md:pb-0`}
      >
        <Outlet />
      </main>

      {/* Mobile bottom tab bar */}
      {!isProblemPage && (
        <nav className="bottom-nav md:hidden">
          <div className="flex justify-around items-center max-w-md mx-auto">
            {mobileNavItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `bottom-nav-item ${isActive ? "active" : ""}`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;
