import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 px-6 relative overflow-hidden">
      {/* Ambient bg */}
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px] animate-mesh" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-secondary/10 blur-[100px] animate-mesh delay-1000" />

      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 404 */}
        <motion.h1
          className="text-[8rem] sm:text-[10rem] font-black leading-none select-none gradient-text animate-text-shimmer bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
        >
          404
        </motion.h1>

        <h2 className="text-2xl sm:text-3xl font-bold text-base-content mb-3 -mt-4">
          Page Not Found
        </h2>

        <p className="text-base-content/40 mb-8 max-w-md mx-auto text-sm leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>

        <div className="flex gap-3 justify-center">
          <Link to="/">
            <motion.button
              className="btn-gradient btn btn-sm gap-2 font-semibold"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Home className="h-4 w-4" />
              Go Home
            </motion.button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-ghost btn-sm gap-2 font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
