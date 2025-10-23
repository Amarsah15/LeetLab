import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 px-6">
      <h1 className="text-[6rem] font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-lg mb-4 select-none leading-none">
        404
      </h1>
      <h2 className="text-2xl sm:text-3xl font-bold text-base-content mb-2">
        Page Not Found
      </h2>
      <p className="text-base-content/70 mb-8 max-w-md text-center">
        Oops! The page you’re looking for doesn’t exist.
        <br />
        It might have been moved or deleted, or you may have entered a broken
        link.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          to="/"
          className="btn btn-primary font-semibold flex items-center gap-2"
        >
          <FaHome className="h-4 w-4" /> Go Home
        </Link>
      </div>
      <div className="mt-12 opacity-50 pointer-events-none select-none"></div>
    </div>
  );
};

export default NotFoundPage;
