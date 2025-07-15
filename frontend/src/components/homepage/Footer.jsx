import React from "react";
import { Github, Twitter, Mail, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-gradient bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                {"AlgoPookie{🎀}"}
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Built to Practice. Shaped by Challenge. The next generation
              platform for mastering algorithms.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-pink-400 transition"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-400 transition"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-400 transition"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-400 transition"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/problems"
                  className="text-gray-400 hover:text-pink-400 transition"
                >
                  Problems
                </a>
              </li>
              <li>
                <a
                  href="/topics"
                  className="text-gray-400 hover:text-pink-400 transition"
                >
                  Topics
                </a>
              </li>
              <li>
                <a
                  href="/profile"
                  className="text-gray-400 hover:text-pink-400 transition"
                >
                  Profile
                </a>
              </li>
              <li>
                <a
                  href="/leaderboard"
                  className="text-gray-400 hover:text-pink-400 transition"
                >
                  Leaderboard
                </a>
              </li>
            </ul>
          </div>

          {/* Explore Topics */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">
              Explore Topics
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/topics/arrays"
                  className="text-gray-400 hover:text-pink-400 transition"
                >
                  Arrays
                </a>
              </li>
              <li>
                <a
                  href="/topics/strings"
                  className="text-gray-400 hover:text-pink-400 transition"
                >
                  Strings
                </a>
              </li>
              <li>
                <a
                  href="/topics/trees"
                  className="text-gray-400 hover:text-pink-400 transition"
                >
                  Trees
                </a>
              </li>
              <li>
                <a
                  href="/topics/graphs"
                  className="text-gray-400 hover:text-pink-400 transition"
                >
                  Graphs
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/about"
                  className="text-gray-400 hover:text-pink-400 transition"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-400 hover:text-pink-400 transition"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-gray-400 hover:text-pink-400 transition"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-gray-400 hover:text-pink-400 transition"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 py-8">
        <p className="text-gray-500 text-sm text-center">© 2024 AlgoPookie</p>
      </div>
    </footer>
  );
};
export default Footer;
