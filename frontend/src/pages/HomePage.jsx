import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBriefcase, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Home() {
  const [theme, setTheme] = useState("dark");

  // Apply theme to <html> tag
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content transition-colors duration-300">
      <nav className="w-full flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-3 sm:py-4 shadow-lg border-b border-base-300 sticky top-0 z-50 backdrop-blur-md bg-base-100/95">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 cursor-pointer"
          >
            <img
              src="/leetlab.svg"
              className="h-6 sm:h-8 w-6 sm:w-8"
              alt="LeetLab Logo"
            />
            <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              LeetLab
            </span>
          </Link>
        </motion.div>

        <div className="flex items-center gap-2 sm:gap-4">
          <motion.button
            className="btn btn-ghost btn-xs sm:btn-sm md:btn-md gap-1 sm:gap-2 px-2 sm:px-4"
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {theme === "dark" ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
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
                <span className="hidden sm:inline">Dark</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
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
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </motion.button>
          <Link to="/login">
            <motion.button
              className="btn btn-outline btn-primary btn-xs sm:btn-sm md:btn-md px-3 sm:px-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          </Link>
          <Link to="/signup">
            <motion.button
              className="btn btn-primary btn-xs sm:btn-sm md:btn-md shadow-lg px-3 sm:px-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
          </Link>
        </div>
      </nav>

      <main className="w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-12 sm:py-16 md:py-20 bg-base-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl"
        >
          {/* Icon/Logo Badge */}
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl mb-4 sm:mb-6 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 sm:h-8 sm:w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>

          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-3 sm:mb-4 px-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Practice. Learn. Grow.
          </motion.h1>

          <motion.div
            className="h-1 w-32 sm:w-44 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-6 sm:mb-8 mt-4 sm:mt-6"
            initial={{ width: 0 }}
            animate={{ width: "auto" }}
            transition={{ delay: 0.4, duration: 0.6 }}
          ></motion.div>
        </motion.div>

        <motion.p
          className="text-base sm:text-lg md:text-xl max-w-2xl text-base-content/80 leading-relaxed mb-6 sm:mb-8 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Welcome to <span className="font-bold text-primary">LeetLab</span> — a
          powerful coding practice platform where you can solve problems, get AI
          hints, and track your progress in real-time.
        </motion.p>

        {/* Stats Section */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatBadge number="50+" label="Problems" />
          <StatBadge number="10+" label="Users" />
          <StatBadge number="AI" label="Powered" />
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/login" className="w-full sm:w-auto">
            <motion.button
              className="btn btn-primary btn-md sm:btn-lg text-base sm:text-lg px-6 sm:px-8 shadow-2xl w-full sm:w-auto"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Get Started
            </motion.button>
          </Link>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-12 sm:py-16 md:py-20 bg-base-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 max-w-6xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-base-content px-2">
            Why Choose <span className="text-primary">LeetLab</span>?
          </h2>
          <p className="text-sm sm:text-base text-base-content/70 max-w-2xl mx-auto px-4">
            Elevate your coding skills with our comprehensive platform designed
            for developers of all levels
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            }
            title="Code & Submit"
            desc="Solve coding challenges with instant feedback and comprehensive test cases to validate your solutions."
            color="from-blue-500 to-cyan-500"
          />
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
            title="Track Progress"
            desc="Monitor your solved problems, performance stats, and improvement over time with detailed analytics."
            color="from-green-500 to-emerald-500"
          />
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 17l4-4-4-4m5 8h5a2 2 0 002-2v-4a2 2 0 00-2-2h-5"
                />
              </svg>
            }
            title="Multi-Language Support"
            desc="Code in Python, JavaScript, Java with syntax highlighting."
            color="from-purple-500 to-pink-500"
          />
        </div>
      </section>

      {/* Ready to Level Up Section */}
      <section className="w-full bg-base-200 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-base-content px-2">
              Ready to Level Up Your Coding Skills?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-base-content/70 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
              Join thousands of developers who are already improving their
              skills with LeetLab. Start solving problems, track your progress,
              and achieve your coding goals today.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link to="/signup" className="w-full sm:w-auto">
                <motion.button
                  className="btn btn-primary btn-md sm:btn-lg px-8 py-6 sm:px-10 shadow-2xl text-base sm:text-lg w-full sm:w-auto "
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Start Your Journey Today
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Additional Stats or Trust Indicators */}
          <motion.div
            className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-2">
                50+
              </div>
              <div className="text-xs sm:text-sm text-base-content/60">
                Coding Problems
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-2">
                10+
              </div>
              <div className="text-xs sm:text-sm text-base-content/60">
                Active Users
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-2">
                50+
              </div>
              <div className="text-xs sm:text-sm text-base-content/60">
                Solutions Submitted
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-2">
                24/7
              </div>
              <div className="text-xs sm:text-sm text-base-content/60">
                AI Support
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-base-100 border-t border-base-300 mt-auto">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-8 sm:py-12">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 sm:gap-12 mb-6 sm:mb-8">
            {/* Left: Brand Section */}
            <div className="max-w-sm">
              <Link
                to="/problems"
                className="flex items-center gap-2 sm:gap-3 cursor-pointer"
              >
                <img
                  src="/leetlab.svg"
                  className="h-6 sm:h-8 w-6 sm:w-8"
                  alt="LeetLab Logo"
                />
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-3">
                  LeetLab
                </span>
              </Link>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                Your ultimate platform for mastering coding interviews and
                improving problem-solving skills.
              </p>
            </div>

            {/* Right: Links Section */}
            <div className="flex flex-wrap gap-8 sm:gap-12 md:gap-16 w-full md:w-auto">
              {/* Quick Links */}
              <div>
                <h4 className="font-semibold text-sm sm:text-base text-base-content mb-3 sm:mb-4">
                  Quick Links
                </h4>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-base-content/70">
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Problems
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Contests
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Leaderboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Discussion
                    </a>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-semibold text-sm sm:text-base text-base-content mb-3 sm:mb-4">
                  Resources
                </h4>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-base-content/70">
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Explore Topics
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Interview Prep
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Study Plans
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Code Library
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-semibold text-sm sm:text-base text-base-content mb-3 sm:mb-4">
                  Company
                </h4>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-base-content/70">
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent my-6 sm:my-8"></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 pt-6 sm:pt-8">
            {/* Left: Built by */}
            <div className="order-2 md:order-1 text-center md:text-left">
              <p className="text-xs sm:text-sm text-base-content/70">
                Built with <span className="text-red-500">❤️</span> by{" "}
                <span className="font-semibold text-primary hover:text-primary/80 transition-colors">
                  Amarnath Kumar
                </span>
              </p>
            </div>

            {/* Center: Copyright */}
            <div className="order-1 md:order-2">
              <p className="text-xs sm:text-sm text-base-content/70 text-center">
                © {new Date().getFullYear()}{" "}
                <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  LeetLab
                </span>
                . All rights reserved.
              </p>
            </div>

            {/* Right: Social Links */}
            <div className="flex gap-2 sm:gap-3 order-3">
              <motion.a
                href="https://amar-portfolio-psi.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-base-200 hover:bg-primary/20 flex items-center justify-center text-base-content/70 hover:text-primary transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaBriefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </motion.a>
              <motion.a
                href="https://github.com/Amarsah15"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-base-200 hover:bg-primary/20 flex items-center justify-center text-base-content/70 hover:text-primary transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGithub className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/Amarnath15"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-base-200 hover:bg-primary/20 flex items-center justify-center text-base-content/70 hover:text-primary transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaLinkedin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </motion.a>
              <motion.a
                href="https://instagram.com/_amar_sah_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-base-200 hover:bg-primary/20 flex items-center justify-center text-base-content/70 hover:text-primary transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaInstagram className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }) {
  return (
    <motion.div
      className="group p-5 sm:p-6 md:p-8 border border-base-300 rounded-2xl shadow-md hover:shadow-2xl transition-all bg-base-100 relative overflow-hidden"
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      {/* Gradient Background on Hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      ></div>

      {/* Icon Container */}
      <div
        className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${color} rounded-xl mb-3 sm:mb-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>

      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-base-content group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-base-content/70 leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}

function StatBadge({ number, label }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      whileHover={{ scale: 1.1 }}
    >
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
        {number}
      </div>
      <div className="text-xs sm:text-sm text-base-content/60 font-medium">
        {label}
      </div>
    </motion.div>
  );
}
