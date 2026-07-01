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
      {/* Ambient background orbs */}
      <div className="ambient-bg">
        <div className="ambient-orb w-96 h-96 bg-primary/30 -top-20 -right-20 animate-mesh" />
        <div className="ambient-orb w-72 h-72 bg-secondary/20 top-1/2 -left-16 animate-mesh delay-1000" />
        <div className="ambient-orb w-56 h-56 bg-accent/10 bottom-20 right-1/4 animate-mesh delay-2000" />
      </div>

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
