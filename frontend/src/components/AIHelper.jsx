import React, { useState } from "react";
import { useAIStore } from "../store/useAIStore";
import toast from "react-hot-toast";
import {
  Brain,
  Lightbulb,
  LineChart,
  Key,
  Save,
  Trash2,
  HelpCircle,
  Loader2,
} from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

const AIHelper = ({ code, problemDescription, language = "javascript" }) => {
  const [hintLevel, setHintLevel] = useState(1);
  const [activeAction, setActiveAction] = useState("hint");
  const [tempKey, setTempKey] = useState(
    () => localStorage.getItem("custom_gemini_key") || "",
  );
  const [isKeySaved, setIsKeySaved] = useState(
    () => !!localStorage.getItem("custom_gemini_key"),
  );

  const handleSaveKey = () => {
    if (!tempKey.trim()) {
      toast.error("Please enter a valid API key first!");
      return;
    }
    localStorage.setItem("custom_gemini_key", tempKey.trim());
    setIsKeySaved(true);
    toast.success("Custom Gemini key saved! Bypassing system limits.");
  };

  const handleClearKey = () => {
    localStorage.removeItem("custom_gemini_key");
    setTempKey("");
    setIsKeySaved(false);
    toast.success("Custom key cleared. Using system key.");
  };

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

  const loading =
    isAnalyzingComplexity || isGettingHint || isGettingImprovements;

  const handleAnalyzeComplexity = async () => {
    if (!code.trim()) {
      toast.error("Please write some code first!");
      return;
    }
    setActiveAction("complexity");
    await analyzeComplexity(code, language);
  };

  const handleGetHint = async (level) => {
    setHintLevel(level);
    setActiveAction("hint");
    await getHint(problemDescription, code, level);
  };

  const handleGetImprovements = async () => {
    if (!code.trim()) {
      toast.error("Please write some code first!");
      return;
    }
    setActiveAction("improve");
    await getImprovementSuggestions(code, problemDescription, language);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Premium API Key Card */}
      <div className="bg-base-200/50 p-5 rounded-xl border border-base-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-primary" />
            <span className="font-bold text-sm text-base-content/80">
              Custom Gemini Key (Optional)
            </span>
          </div>
          <a
            href="https://aistudio.google.com/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-primary hover:underline font-bold flex items-center gap-1"
          >
            Get Key (Free)
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <input
            type="password"
            placeholder={
              isKeySaved
                ? "••••••••••••••••••••••••••••••••"
                : "Paste your Gemini API key here..."
            }
            className="input input-sm glass-input w-full font-mono text-xs py-2 px-3 border border-base-300 dark:border-neutral-700 bg-base-100 rounded-md focus:outline-none focus:border-primary/50 text-base-content"
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            disabled={isKeySaved}
          />
          {isKeySaved ? (
            <button
              onClick={handleClearKey}
              className="btn btn-sm btn-error text-white font-bold h-9 min-h-[2.25rem] px-4 rounded-md cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Clear
            </button>
          ) : (
            <button
              onClick={handleSaveKey}
              className="btn btn-sm btn-primary font-bold h-9 min-h-[2.25rem] px-5 rounded-md text-white cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 mr-1" />
              Save
            </button>
          )}
        </div>
        <p className="text-[11px] text-base-content/50 leading-relaxed">
          This key is stored locally in your browser to bypass shared system
          limits. Getting a free key from Google AI Studio allows unlimited
          requests and faster response times.
        </p>
      </div>

      {/* Action panel */}
      <div className="space-y-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-xs font-bold text-base-content/50 uppercase tracking-wider">
            AI Operations
          </h3>
          <p className="text-[11px] text-base-content/40">
            Select an option below to request hints or analyze your code.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Hint levels dropdown/group */}
          <div className="flex flex-col bg-base-100 dark:bg-base-200/40 border border-base-300 dark:border-neutral-800 rounded-xl p-3.5 justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-base-content/85">
                  Get Hint
                </span>
                <span className="text-[10px] text-base-content/40">
                  Select level for a clue.
                </span>
              </div>
            </div>
            <div className="flex w-full gap-1">
              {[1, 2, 3].map((level) => (
                <button
                  key={level}
                  disabled={loading}
                  onClick={() => handleGetHint(level)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                    loading && activeAction === "hint" && hintLevel === level
                      ? "bg-amber-500/20 border-amber-500/30 text-amber-500"
                      : hintLevel === level
                        ? "bg-amber-500/15 border-amber-500/30 text-amber-500 hover:bg-amber-500/25 shadow-sm shadow-amber-500/10"
                        : "bg-base-200 dark:bg-neutral-800 hover:bg-base-300 dark:hover:bg-neutral-700 border-base-300 dark:border-neutral-700 text-base-content/70"
                  }`}
                >
                  L{level}
                </button>
              ))}
            </div>
          </div>

          {/* Complexity analysis button */}
          <button
            onClick={handleAnalyzeComplexity}
            disabled={loading}
            className="flex flex-col bg-base-100 dark:bg-base-200/40 border border-base-300 dark:border-neutral-800 hover:border-blue-500/40 hover:bg-blue-500/[0.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 rounded-xl p-3.5 gap-3 transition-all duration-250 cursor-pointer shadow-sm text-left group"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 group-hover:bg-blue-500/20 transition-colors">
                <LineChart className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-base-content/85">
                  Complexity
                </span>
                <span className="text-[10px] text-base-content/40">
                  Analyze runtime/space.
                </span>
              </div>
            </div>
            <span className="text-[11px] text-base-content/50 leading-normal">
              Calculate time and space complexity of your solution.
            </span>
          </button>

          {/* Improvement button */}
          <button
            onClick={handleGetImprovements}
            disabled={loading}
            className="flex flex-col bg-base-100 dark:bg-base-200/40 border border-base-300 dark:border-neutral-800 hover:border-purple-500/40 hover:bg-purple-500/[0.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 rounded-xl p-3.5 gap-3 transition-all duration-250 cursor-pointer shadow-sm text-left group"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500 group-hover:bg-purple-500/20 transition-colors">
                <Brain className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-base-content/85">
                  Optimizations
                </span>
                <span className="text-[10px] text-base-content/40">
                  Suggest code edits.
                </span>
              </div>
            </div>
            <span className="text-[11px] text-base-content/50 leading-normal">
              Get code optimization ideas and alternative structures.
            </span>
          </button>
        </div>
      </div>

      {/* AI Response display */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-base-content/50 uppercase tracking-wider">
            AI Assistant Output
          </h3>
          {result && (
            <button
              onClick={clearResult}
              className="text-[11px] text-error hover:underline font-bold cursor-pointer"
            >
              Clear Output
            </button>
          )}
        </div>

        <div className="min-h-[160px] bg-base-200/40 rounded-xl border border-base-300 p-5 flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-6">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-xs text-base-content/40 font-medium">
                Generating response...
              </p>
            </div>
          ) : result ? (
            <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed text-base-content/95 select-text">
              <MarkdownRenderer content={result} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-base-content/45 py-8">
              <Brain className="w-12 h-12 mb-3.5 text-base-content/25" />
              <p className="text-xs font-bold">No output generated yet</p>
              <p className="text-[11px] text-base-content/35 max-w-[240px] mt-1">
                Select one of the actions above to receive assistance for this
                problem.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIHelper;
