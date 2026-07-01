import React from "react";
import { useAuthStore } from "../store/useAuthStore";

const LogoutButton = ({ children, className, onClick }) => {
  const { logout } = useAuthStore();

  const onLogout = async () => {
    try {
      if (onClick) onClick();
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button className={className || "btn btn-primary"} onClick={onLogout}>
      {children}
    </button>
  );
};

export default LogoutButton;
