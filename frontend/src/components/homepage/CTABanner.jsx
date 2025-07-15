import React from "react";
import { Link } from "react-router-dom";

const CTABanner = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-900 via-purple-900 to-indigo-900" />
      <div className="absolute inset-0 bg-black/50" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500 rounded-full filter blur-2xl animate-pulse" />
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-purple-500 rounded-full filter blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-40 h-40 bg-blue-500 rounded-full filter blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
          Ready to Level Up Your{" "}
          <span className="text-gradient bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Algorithm Skills?
          </span>
        </h2>

        <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-12 leading-relaxed">
          Join thousands of developers who are mastering algorithms the right
          way. Start your journey today and unlock your coding potential!
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link to="/signup">
            <button className="px-10 py-4 bg-white text-gray-900 font-bold text-lg rounded-xl hover:scale-105 transform transition duration-300 shadow-xl">
              Create Free Account
            </button>
          </Link>
          <Link to="/problems">
            <button className="px-10 py-4 border-2 border-white/30 text-white font-semibold text-lg rounded-xl hover:bg-white/10 hover:border-white/50 transition duration-300">
              Browse Problems
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">10,000+</div>
            <div className="text-gray-300">Active Learners</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">500+</div>
            <div className="text-gray-300">Practice Problems</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">95%</div>
            <div className="text-gray-300">Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CTABanner;
