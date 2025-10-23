import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBrain, FaLightbulb, FaChartLine, FaTimes } from "react-icons/fa";
import { useAIStore } from "../store/useAIStore";
import toast from "react-hot-toast";

const AIHelper = ({ code, problemDescription, language = "javascript" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("hint");
  const [hintLevel, setHintLevel] = useState(1);

  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  // Get AI store state and actions
  const {
    result,
    isAnalyzingComplexity,
    isGettingHint,
    isGettingImprovements,
    analyzeComplexity,
    getHint,
    getImprovementSuggestions,
    clearResult,
  } = useAIStore();

  // Determine loading state based on active tab
  const loading =
    (activeTab === "complexity" && isAnalyzingComplexity) ||
    (activeTab === "hint" && isGettingHint) ||
    (activeTab === "improve" && isGettingImprovements);

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAnalyzeComplexity = async () => {
    if (!code.trim()) {
      toast.error("Please write some code first!");
      return;
    }

    setActiveTab("complexity");
    await analyzeComplexity(code, language);
  };

  const handleGetHint = async () => {
    setActiveTab("hint");
    await getHint(problemDescription, code, hintLevel);
  };

  const handleGetImprovements = async () => {
    if (!code.trim()) {
      toast.error("Please write some code first!");
      return;
    }

    setActiveTab("improve");
    await getImprovementSuggestions(code, problemDescription, language);
  };

  return (
    <>
      {/* Floating AI Button */}
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg flex items-center justify-center z-50 hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaBrain className="text-white text-2xl" />
      </motion.button>

      {/* AI Helper Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-0 right-0 w-full sm:w-96 h-full bg-base-200 shadow-2xl z-40 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FaBrain className="text-white text-xl" />
                <h3 className="text-white font-bold text-lg">AI Assistant</h3>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  clearResult();
                }}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="p-4 space-y-3 border-b border-base-300">
              <button
                onClick={handleGetHint}
                disabled={loading}
                className="btn btn-outline w-full justify-start gap-2"
              >
                <FaLightbulb className="text-yellow-500" />
                Get Hint (Level {hintLevel})
              </button>

              <div className="flex gap-2 pl-8">
                {[1, 2, 3].map((level) => (
                  <button
                    key={level}
                    onClick={() => setHintLevel(level)}
                    className={`btn btn-xs ${
                      hintLevel === level ? "btn-primary" : "btn-ghost"
                    }`}
                  >
                    L{level}
                  </button>
                ))}
              </div>

              <button
                onClick={handleAnalyzeComplexity}
                disabled={loading}
                className="btn btn-outline w-full justify-start gap-2"
              >
                <FaChartLine className="text-blue-500" />
                Analyze Complexity
              </button>

              <button
                onClick={handleGetImprovements}
                disabled={loading}
                className="btn btn-outline w-full justify-start gap-2"
              >
                <FaBrain className="text-purple-500" />
                Get Improvements
              </button>
            </div>

            {/* Result Display */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="loading loading-spinner loading-lg text-primary"></div>
                </div>
              ) : result ? (
                <div className="prose prose-sm max-w-none">
                  <div className="bg-base-100 p-4 rounded-lg whitespace-pre-wrap">
                    {result}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-base-content/50">
                  <FaBrain className="text-6xl mb-4" />
                  <p>Select an option to get AI assistance</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIHelper;
