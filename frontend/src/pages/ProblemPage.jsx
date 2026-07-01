import React, { useState, useEffect, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import AIHelper from "../components/AIHelper";
import MarkdownRenderer from "../components/MarkdownRenderer";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
  AlignLeft,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Send,
  RotateCcw,
  Save,
  Sun,
  Moon,
  ArrowLeft,
  Tag,
  Settings,
  X,
  Minus,
  Plus,
  Sparkles,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../lib/lang";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import { useCodeDraft } from "../lib/useCodeDraft";
import { useAuthStore } from "../store/useAuthStore";
import Submission from "../components/Submission";
import SubmissionsList from "../components/SubmissionList";
import DiscussionSection from "../components/DiscussionSection";
import { useAIStore } from "../store/useAIStore";

const parseCodeSnippet = (fullCode, language) => {
  if (!fullCode) return { prefix: "", body: "", suffix: "" };

  if (language === "JAVASCRIPT") {
    const funcIndex = fullCode.indexOf("function ");
    const consoleIndex = fullCode.lastIndexOf("console.log");

    if (funcIndex !== -1 && consoleIndex !== -1 && consoleIndex > funcIndex) {
      return {
        prefix: fullCode.slice(0, funcIndex).trim(),
        body: fullCode.slice(funcIndex, consoleIndex).trim(),
        suffix: fullCode.slice(consoleIndex).trim(),
      };
    }
  }

  if (language === "PYTHON") {
    const defIndex = fullCode.indexOf("def ");
    let footerIndex = fullCode.lastIndexOf("print(");
    if (footerIndex === -1) {
      footerIndex = fullCode.indexOf("if __name__");
    }

    if (defIndex !== -1 && footerIndex !== -1 && footerIndex > defIndex) {
      return {
        prefix: fullCode.slice(0, defIndex).trim(),
        body: fullCode.slice(defIndex, footerIndex).trim(),
        suffix: fullCode.slice(footerIndex).trim(),
      };
    }
  }

  if (language === "CPP") {
    const classIndex = fullCode.indexOf("class Solution");
    const mainIndex = fullCode.indexOf("int main(");
    if (classIndex !== -1 && mainIndex !== -1 && mainIndex > classIndex) {
      return {
        prefix: fullCode.slice(0, classIndex).trim(),
        body: fullCode.slice(classIndex, mainIndex).trim(),
        suffix: fullCode.slice(mainIndex).trim(),
      };
    }
  }

  if (language === "JAVA") {
    const classIndex = fullCode.indexOf("class Solution");
    const mainIndex = fullCode.indexOf("class Main");
    if (classIndex !== -1 && mainIndex !== -1 && mainIndex > classIndex) {
      return {
        prefix: fullCode.slice(0, classIndex).trim(),
        body: fullCode.slice(classIndex, mainIndex).trim(),
        suffix: fullCode.slice(mainIndex).trim(),
      };
    }
  }

  return { prefix: "", body: fullCode, suffix: "" };
};

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();
  const { authUser } = useAuthStore();

  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
    getSuccessRate,
    successRate,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [codePrefix, setCodePrefix] = useState("");
  const [codeSuffix, setCodeSuffix] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [testCases, settestCases] = useState([]);
  const {
    executeCode,
    submission,
    isExecuting,
    runCode,
    runResult,
    isRunning,
  } = useExecutionStore();

  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const [showHints, setShowHints] = useState(false);

  // Editor settings (persisted)
  const [fontSize, setFontSize] = useState(() =>
    parseInt(localStorage.getItem("leetlab_fontSize") || "15"),
  );
  const [tabSize, setTabSize] = useState(() =>
    parseInt(localStorage.getItem("leetlab_tabSize") || "4"),
  );
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    localStorage.setItem("leetlab_fontSize", fontSize.toString());
  }, [fontSize]);
  useEffect(() => {
    localStorage.setItem("leetlab_tabSize", tabSize.toString());
  }, [tabSize]);

  // Update editor options and model options live when fontSize/tabSize changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize,
        lineHeight: Math.max(20, fontSize + 6),
        detectIndentation: false,
      });
      editorRef.current.getModel()?.updateOptions({
        tabSize,
        insertSpaces: true,
      });
    }
  }, [fontSize, tabSize]);

  // Draggable horizontal split (left/right)
  const containerRef = useRef(null);
  const [leftWidth, setLeftWidth] = useState(45);
  const [isResizing, setIsResizing] = useState(false);

  // Draggable vertical split (editor/console in right panel)
  const rightPanelRef = useRef(null);
  const [consoleHeight, setConsoleHeight] = useState(35);
  const [isVResizing, setIsVResizing] = useState(false);
  const [showConsole, setShowConsole] = useState(true);
  const [consoleTab, setConsoleTab] = useState("testcase");
  const [activeTestCaseTab, setActiveTestCaseTab] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true,
  );
  const [mobileTab, setMobileTab] = useState("info"); // "info" or "code"

  // Console scroll reset ref
  const consoleContentRef = useRef(null);

  useEffect(() => {
    if (consoleContentRef.current) {
      consoleContentRef.current.scrollTop = 0;
    }
  }, [consoleTab, submission, runResult]);

  useEffect(() => {
    if (submission || runResult) setConsoleTab("result");
  }, [submission, runResult]);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Horizontal resizer
  const startResizing = useCallback(
    (e) => {
      e.preventDefault();
      setIsResizing(true);
      const startX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      const startWidth = leftWidth;
      const doDrag = (ev) => {
        if (!containerRef.current) return;
        const clientX =
          ev.type === "touchmove" ? ev.touches[0].clientX : ev.clientX;
        const cw = containerRef.current.getBoundingClientRect().width;
        if (!cw) return;
        setLeftWidth(
          Math.max(
            40,
            Math.min(70, startWidth + ((clientX - startX) / cw) * 100),
          ),
        );
      };
      const stopDrag = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", doDrag);
        document.removeEventListener("mouseup", stopDrag);
        document.removeEventListener("touchmove", doDrag);
        document.removeEventListener("touchend", stopDrag);
      };
      document.addEventListener("mousemove", doDrag);
      document.addEventListener("mouseup", stopDrag);
      document.addEventListener("touchmove", doDrag, { passive: false });
      document.addEventListener("touchend", stopDrag);
    },
    [leftWidth],
  );

  // Vertical resizer
  const startVResizing = useCallback(
    (e) => {
      e.preventDefault();
      setIsVResizing(true);
      const startY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
      const startHeight = consoleHeight;
      const doDrag = (ev) => {
        if (!rightPanelRef.current) return;
        const clientY =
          ev.type === "touchmove" ? ev.touches[0].clientY : ev.clientY;
        const ph = rightPanelRef.current.getBoundingClientRect().height;
        if (!ph) return;
        setConsoleHeight(
          Math.max(
            15,
            Math.min(65, startHeight + ((startY - clientY) / ph) * 100),
          ),
        );
      };
      const stopDrag = () => {
        setIsVResizing(false);
        document.removeEventListener("mousemove", doDrag);
        document.removeEventListener("mouseup", stopDrag);
        document.removeEventListener("touchmove", doDrag);
        document.removeEventListener("touchend", stopDrag);
      };
      document.addEventListener("mousemove", doDrag);
      document.addEventListener("mouseup", stopDrag);
      document.addEventListener("touchmove", doDrag, { passive: false });
      document.addEventListener("touchend", stopDrag);
    },
    [consoleHeight],
  );

  const { draft, saveDraft, clearDraft, isDraftSaved } = useCodeDraft(
    id,
    selectedLanguage,
  );

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
    getSuccessRate(id);
  }, [id, getSubmissionCountForProblem, getProblemById, getSuccessRate]);

  useEffect(() => {
    if (submission) {
      getSubmissionCountForProblem(id);
      getSuccessRate(id);
      getSubmissionForProblem(id);
      if (submission.status === "Accepted") clearDraft();
    }
  }, [
    submission,
    id,
    getSubmissionCountForProblem,
    getSuccessRate,
    getSubmissionForProblem,
    clearDraft,
  ]);

  useEffect(() => {
    if (problem) {
      document.title = `${problem.title} — LeetLab`;

      const savedDraft = localStorage.getItem(
        `leetlab_draft_${id}_${selectedLanguage}`,
      );
      const rawCode =
        savedDraft || problem.codeSnippets?.[selectedLanguage] || "";
      const parsed = parseCodeSnippet(rawCode, selectedLanguage);
      setCode(parsed.body);
      setCodePrefix(parsed.prefix);
      setCodeSuffix(parsed.suffix);
      settestCases(
        (problem.testCases || [])
          .slice(0, 3)
          .map((tc) => ({ input: tc.input, output: tc.output })),
      );
    }

    return () => {
      // Reset title when leaving the problem page
      document.title = "LeetLab";
    };
  }, [problem, selectedLanguage, id]);

  useEffect(() => {
    useExecutionStore.setState({ submission: null, runResult: null });
    useAIStore.getState().clearResult();
  }, [id]);

  useEffect(() => {
    if (activeTab === "submissions" && id) getSubmissionForProblem(id);
  }, [activeTab, id, getSubmissionForProblem]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    const savedDraft = localStorage.getItem(`leetlab_draft_${id}_${lang}`);
    const rawCode = savedDraft || problem.codeSnippets?.[lang] || "";
    const parsed = parseCodeSnippet(rawCode, lang);
    setCode(parsed.body);
    setCodePrefix(parsed.prefix);
    setCodeSuffix(parsed.suffix);
  };

  const handleCodeChange = (value) => {
    const newBody = value || "";
    setCode(newBody);
    const fullCode = codePrefix
      ? `${codePrefix}\n\n${newBody}\n\n${codeSuffix}`
      : newBody;
    saveDraft(fullCode);
  };

  const handleResetCode = () => {
    clearDraft();
    const defaultCode = problem.codeSnippets?.[selectedLanguage] || "";
    const parsed = parseCodeSnippet(defaultCode, selectedLanguage);
    setCode(parsed.body);
    setCodePrefix(parsed.prefix);
    setCodeSuffix(parsed.suffix);
  };

  const triggerRun = useCallback(() => {
    try {
      setShowConsole(true);
      const language_id = getLanguageId(selectedLanguage);
      const runTestCases = (problem.testCases || []).slice(0, 3);
      const fullCode = codePrefix
        ? `${codePrefix}\n\n${code}\n\n${codeSuffix}`
        : code;
      runCode(
        fullCode,
        language_id,
        runTestCases.map((tc) => tc.input),
        runTestCases.map((tc) => tc.output),
        id,
      );
    } catch (error) {
      console.log("Error running code", error);
    }
  }, [code, selectedLanguage, problem, id, runCode, codePrefix, codeSuffix]);

  const triggerSubmit = useCallback(() => {
    try {
      setShowConsole(true);
      const language_id = getLanguageId(selectedLanguage);
      const fullCode = codePrefix
        ? `${codePrefix}\n\n${code}\n\n${codeSuffix}`
        : code;
      executeCode(
        fullCode,
        language_id,
        problem.testCases.map((tc) => tc.input),
        problem.testCases.map((tc) => tc.output),
        id,
      );
    } catch (error) {
      console.log("Error submitting code", error);
    }
  }, [
    code,
    selectedLanguage,
    problem,
    id,
    executeCode,
    codePrefix,
    codeSuffix,
  ]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;
      if (modKey && e.key === "s") {
        e.preventDefault();
        return;
      }
      if (modKey && e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) {
          if (!isExecuting && problem) triggerSubmit();
        } else {
          if (!isRunning && problem) triggerRun();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerRun, triggerSubmit, isRunning, isExecuting, problem]);

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#eef1f5] dark:bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-purple-500"></span>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Loading problem...
          </p>
        </div>
      </div>
    );
  }

  const displayResult = submission || runResult;

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="space-y-7 max-w-2xl">
            <div>
              {/* Difficulty Badge */}
              <div className="flex items-center mb-2.5">
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                    problem.difficulty === "EASY"
                      ? "bg-emerald-500/15 text-emerald-500"
                      : problem.difficulty === "MEDIUM"
                        ? "bg-amber-500/15 text-amber-500"
                        : "bg-rose-500/15 text-rose-500"
                  }`}
                >
                  {problem.difficulty || "EASY"}
                </span>
              </div>

              <h1 className="text-2xl font-extrabold text-base-content tracking-tight leading-snug mb-1 ">
                {problem.title}
              </h1>

              <div className="flex items-center gap-4 text-xs font-semibold border-b border-base-content/5 pb-3 text-base-content/50 mb-3.5">
                <span>{submissionCount} Submissions</span>
                <span>
                  {successRate > 0 ? `${successRate}%` : "N/A"} Success Rate
                </span>
              </div>
            </div>

            {/* Description body */}
            <div className="text-base-content/85 text-[15px] leading-7">
              <MarkdownRenderer content={problem.description} />
            </div>

            {/* Examples */}
            {problem.examples && (
              <div className="space-y-4">
                {Object.entries(problem.examples).map(
                  ([lang, example], idx) => (
                    <div key={lang}>
                      <h3 className="text-base font-bold text-base-content/85 mb-2">
                        Example {idx + 1}:
                      </h3>
                      <div className="border-l-[3px] border-base-content/15 pl-5 space-y-1 text-[14px]">
                        <p className="font-mono">
                          <span className="font-bold text-base-content/60">
                            Input:{" "}
                          </span>
                          <span className="text-base-content/90">
                            {example.input}
                          </span>
                        </p>
                        <p className="font-mono">
                          <span className="font-bold text-base-content/60">
                            Output:{" "}
                          </span>
                          <span className="text-base-content/90">
                            {example.output}
                          </span>
                        </p>
                        {example.explanation && (
                          <p>
                            <span className="font-bold text-base-content/60">
                              Explanation:{" "}
                            </span>
                            <span className="text-base-content/70">
                              {example.explanation}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}

            {/* Constraints */}
            {problem.constraints && (
              <div>
                <h3 className="text-base font-bold text-base-content/85 mb-2">
                  Constraints:
                </h3>
                <div className="text-[14px] text-base-content/70 leading-7">
                  <MarkdownRenderer content={problem.constraints} />
                </div>
              </div>
            )}

            {/* Hints */}
            {problem.hints && (
              <div className="pt-2">
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center gap-2 text-sm font-bold text-amber-500/80 hover:text-amber-400 transition-colors"
                >
                  <Lightbulb className="w-4 h-4" />
                  {showHints ? "Hide Hint" : "Hint"}
                  {showHints ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
                {showHints && (
                  <div className="mt-3 p-4 rounded-lg bg-amber-500/5 border border-amber-500/10 text-base-content/70 text-sm leading-relaxed">
                    <MarkdownRenderer content={problem.hints} />
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {problem.tags && problem.tags.length > 0 && (
              <div className="pt-4 border-t border-base-content/5 flex flex-wrap items-center gap-2 mt-6">
                <span className="text-xs uppercase font-extrabold text-base-content/45 tracking-wider mr-1">
                  Tags:
                </span>
                {problem.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-base-content/5 text-base-content/50 hover:text-primary hover:bg-primary/10 transition-all cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      case "submissions":
        return (
          <SubmissionsList
            submissions={submissions}
            isLoading={isSubmissionsLoading}
          />
        );
      case "editorial":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Official Editorial & Solution
            </h3>
            <div className="text-[14px] text-base-content/80 leading-7 pt-2">
              {problem.editorial ? (
                <MarkdownRenderer content={problem.editorial} />
              ) : (
                <p className="text-sm text-base-content/50 italic">
                  No official editorial available for this problem yet.
                </p>
              )}
            </div>
          </div>
        );
      case "discussion":
        return <DiscussionSection problemId={id} />;
      case "leetlab_ai":
        return (
          <AIHelper
            code={code}
            problemDescription={problem.description}
            language={selectedLanguage.toLowerCase()}
          />
        );
      default:
        return null;
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Define themes
    monaco.editor.defineTheme("leetlab-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6a9955", fontStyle: "italic" },
        { token: "keyword", foreground: "569cd6" },
        { token: "keyword.control", foreground: "c586c0" },
        { token: "storage", foreground: "569cd6" },
        { token: "storage.type", foreground: "569cd6" },
        { token: "string", foreground: "ce9178" },
        { token: "number", foreground: "b5cea8" },
        { token: "type", foreground: "4ec9b0" },
        { token: "class", foreground: "4ec9b0" },
        { token: "function", foreground: "dcdcaa" },
        { token: "variable", foreground: "9cdcfe" },
        { token: "operator", foreground: "d4d4d4" },
      ],
      colors: {
        "editor.background": "#1e1e1e",
        "editor.foreground": "#d4d4d4",
        "editorLineNumber.foreground": "#858585",
        "editorLineNumber.activeForeground": "#c6c6c6",
        "editor.lineHighlightBackground": "#2f2f2f30",
        "editor.selectionBackground": "#264f7880",
        "editorCursor.foreground": "#aeafad",
      },
    });

    monaco.editor.setTheme("leetlab-dark");

    editor.updateOptions({
      fontSize,
      lineHeight: Math.max(20, fontSize + 6),
      detectIndentation: false,
    });
    editor.getModel()?.updateOptions({ tabSize, insertSpaces: true });

    editor.addAction({
      id: "run-code",
      label: "Run Code",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter].filter(
        Boolean,
      ),
      run: () => {
        if (!isRunning && problem) triggerRun();
      },
    });
    editor.addAction({
      id: "submit-code",
      label: "Submit Code",
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
      ].filter(Boolean),
      run: () => {
        if (!isExecuting && problem) triggerSubmit();
      },
    });
  };

  const formatCode = () => {
    if (editorRef.current)
      editorRef.current.getAction("editor.action.formatDocument").run();
  };

  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const modKeyLabel = isMac ? "\u2318" : "Ctrl";

  return (
    <div className="h-[calc(100vh-64px)] bg-[#0a0a0f] text-slate-100 w-full flex flex-col overflow-hidden relative">
      {/* Mobile/Desktop Navigation Header */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0 bg-[#0a0a0f] z-30">
        <Link
          to="/problems"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-400 hover:text-purple-400 transition-all duration-200 uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Explore Problems</span>
          <span className="sm:hidden">Back</span>
        </Link>

        {/* Mobile View Switch Tabs */}
        {!isLargeScreen && (
          <div className="flex bg-[#12121a] border border-white/5 p-0.5 rounded-lg select-none">
            <button
              className={`text-xs font-black px-3.5 py-1.5 rounded-md transition-all cursor-pointer ${mobileTab === "info" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
              onClick={() => setMobileTab("info")}
            >
              Info
            </button>
            <button
              className={`text-xs font-black px-3.5 py-1.5 rounded-md transition-all cursor-pointer ${mobileTab === "code" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
              onClick={() => setMobileTab("code")}
            >
              Code
            </button>
          </div>
        )}

        {!isLargeScreen && <div className="w-14" />}
      </div>

      {/* Full-height workspace */}
      <div className="flex-1 w-full pb-2 px-2 lg:px-3 flex flex-col min-h-0">
        <div
          ref={containerRef}
          className={`flex flex-col lg:flex-row w-full flex-1 min-h-0 lg:h-full relative gap-1.5 ${isResizing || isVResizing ? "select-none" : ""}`}
        >
          {/* ═══════════ LEFT PANEL ═══════════ */}
          <div
            style={isLargeScreen ? { width: `${leftWidth}%` } : {}}
            className={`${!isLargeScreen && mobileTab !== "info" ? "hidden" : "flex"} w-full flex-1 min-h-0 lg:flex-none lg:h-full overflow-hidden flex flex-col rounded-xl bg-[#12121a] border border-white/5 ${isResizing ? "pointer-events-none" : ""}`}
          >
            {/* Clean tab bar */}
            <div className="flex items-center gap-0 px-2 pt-2 pb-0 border-b border-base-content/5 shrink-0 overflow-x-auto">
              {[
                { key: "description", icon: FileText, label: "Description" },
                { key: "submissions", icon: Code2, label: "Submissions" },
                { key: "editorial", icon: Lightbulb, label: "Editorial" },
                { key: "discussion", icon: MessageSquare, label: "Discussion" },
                { key: "leetlab_ai", icon: Sparkles, label: "AI" },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-[13px] font-semibold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                    activeTab === key
                      ? "text-base-content border-primary"
                      : "text-base-content/45 border-transparent hover:text-base-content/70"
                  }`}
                  onClick={() => setActiveTab(key)}
                  aria-label={label}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-3 lg:px-8 lg:pb-8 lg:pt-4">
              {renderTabContent()}
            </div>
          </div>

          {/* Horizontal resizer */}
          <div
            className={`hidden lg:flex w-1.5 cursor-col-resize h-full items-center justify-center group z-20 shrink-0 rounded-full transition-colors touch-none ${isResizing ? "bg-primary/30" : "hover:bg-primary/10"}`}
            onMouseDown={startResizing}
            onTouchStart={startResizing}
            aria-label="Resize panels horizontally"
          >
            <div className="w-[2px] h-10 rounded-full bg-base-content/10 group-hover:bg-primary/50 transition-colors" />
          </div>

          {/* ═══════════ RIGHT PANEL (Split Vertically) ═══════════ */}
          <div
            ref={rightPanelRef}
            style={isLargeScreen ? { flex: 1, minWidth: 0 } : {}}
            className={`${!isLargeScreen && mobileTab !== "code" ? "hidden" : "flex"} w-full flex-1 min-h-0 lg:h-full overflow-hidden flex flex-col gap-1.5 ${isResizing || isVResizing ? "pointer-events-none" : ""}`}
          >
            <div
              className="flex flex-col rounded-xl bg-[#12121a] border border-white/5 overflow-hidden"
              style={{ flex: 1, minHeight: 0 }}
            >
              {/* Editor toolbar */}
              <div className="flex justify-between items-center px-4 py-1.5 border-b border-base-content/5 shrink-0">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-primary/70" />
                  <div className="relative flex items-center">
                    <select
                      className="bg-base-200 dark:bg-base-300 border border-base-300 dark:border-neutral-700 text-xs font-bold text-base-content/95 rounded-md pl-3 pr-8 py-1.5 cursor-pointer focus:outline-none appearance-none hover:bg-base-300 dark:hover:bg-neutral-800 transition-colors"
                      value={selectedLanguage}
                      onChange={handleLanguageChange}
                    >
                      {Object.keys(problem.codeSnippets || {}).map((lang) => (
                        <option
                          key={lang}
                          value={lang}
                          className="bg-[#12121a] text-white font-semibold"
                        >
                          {lang === "JAVASCRIPT"
                            ? "JavaScript"
                            : lang === "CPP"
                              ? "C++"
                              : lang.charAt(0) + lang.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-2 pointer-events-none text-base-content/65" />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {isDraftSaved && (
                    <span className="text-[11px] text-success/70 flex items-center gap-1 mr-2 font-medium">
                      <Save className="w-3.5 h-3.5" />
                      Saved
                    </span>
                  )}
                  <button
                    className="p-1.5 rounded-md text-base-content/40 hover:text-base-content/80 hover:bg-base-content/5 transition-all cursor-pointer"
                    onClick={handleResetCode}
                    title="Reset Code"
                    aria-label="Reset Code"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className="p-1.5 rounded-md text-base-content/40 hover:text-base-content/80 hover:bg-base-content/5 transition-all cursor-pointer hidden sm:block"
                    onClick={formatCode}
                    title="Format Code"
                    aria-label="Format Code"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  {/* Settings */}
                  <div className="relative">
                    <button
                      className={`p-1.5 rounded-md transition-all cursor-pointer ${showSettings ? "text-primary bg-primary/10" : "text-base-content/40 hover:text-base-content/80 hover:bg-base-content/5"}`}
                      onClick={() => setShowSettings(!showSettings)}
                      title="Editor Settings"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                    {showSettings && (
                      <div className="absolute right-0 top-9 z-50 w-52 bg-[#12121a] rounded-xl shadow-2xl border border-white/10 p-4 space-y-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-base-content/60">
                            Editor Settings
                          </span>
                          <button
                            className="p-0.5 rounded text-base-content/40 hover:text-base-content cursor-pointer"
                            onClick={() => setShowSettings(false)}
                            aria-label="Close Settings"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {/* Font Size */}
                        <div>
                          <label className="text-[11px] font-semibold text-base-content/50 block mb-1.5">
                            Font Size
                          </label>
                          <div className="flex items-center gap-2">
                            <button
                              className="w-7 h-7 flex items-center justify-center rounded-md border border-base-content/10 text-base-content/60 hover:bg-base-content/5 cursor-pointer"
                              onClick={() =>
                                setFontSize(Math.max(10, fontSize - 1))
                              }
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-bold text-base-content min-w-[2.5rem] text-center">
                              {fontSize}px
                            </span>
                            <button
                              className="w-7 h-7 flex items-center justify-center rounded-md border border-base-content/10 text-base-content/60 hover:bg-base-content/5 cursor-pointer"
                              onClick={() =>
                                setFontSize(Math.min(28, fontSize + 1))
                              }
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        {/* Tab Size */}
                        <div>
                          <label className="text-[11px] font-semibold text-base-content/50 block mb-1.5">
                            Tab Size
                          </label>
                          <div className="flex items-center gap-1.5">
                            {[2, 4, 8].map((size) => (
                              <button
                                key={size}
                                className={`h-7 px-3 rounded-md text-xs font-bold transition-all cursor-pointer ${tabSize === size ? "bg-primary text-white" : "border border-base-content/10 text-base-content/60 hover:bg-base-content/5"}`}
                                onClick={() => setTabSize(size)}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 min-h-0 w-full">
                <Editor
                  height="100%"
                  language={selectedLanguage.toLowerCase()}
                  value={code}
                  onChange={handleCodeChange}
                  onMount={handleEditorDidMount}
                  options={{
                    minimap: { enabled: false },
                    fontSize,
                    tabSize,
                    detectIndentation: false,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                    formatOnType: true,
                    formatOnPaste: true,
                    padding: { top: 12, bottom: 12 },
                    lineHeight: Math.max(20, fontSize + 6),
                    fontFamily:
                      "Menlo, Monaco, Consolas, 'Courier New', monospace",
                    fontLigatures: true,
                    cursorBlinking: "smooth",
                    cursorSmoothCaretAnimation: "on",
                    smoothScrolling: true,
                    renderLineHighlight: "line",
                    renderLineHighlightOnlyWhenFocus: true,
                  }}
                />
              </div>

              {/* Action bar */}
              <div className="px-4 py-2 border-t border-base-content/5 flex justify-between items-center shrink-0">
                <button
                  onClick={() => setShowConsole(!showConsole)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${showConsole ? "text-primary bg-primary/10" : "text-base-content/45 hover:bg-base-content/5"}`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Console
                  {showConsole ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronUp className="w-3.5 h-3.5" />
                  )}
                </button>
                <div className="flex items-center gap-2.5">
                  {/* Run Button with Tooltip */}
                  <div className="relative group">
                    <button
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-bold border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 transition-all cursor-pointer ${isRunning ? "opacity-60" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        triggerRun();
                      }}
                      disabled={isRunning || isExecuting}
                    >
                      {isRunning ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                      Run
                    </button>
                    <div className="absolute bottom-full mb-2 right-0 hidden group-hover:flex items-center gap-1 bg-neutral-900 text-neutral-100 text-[11px] px-2 py-1.5 rounded-md shadow-lg whitespace-nowrap z-50 border border-neutral-800">
                      Run{" "}
                      <kbd className="bg-neutral-800 px-1 py-0.5 rounded border border-neutral-700 font-bold">
                        {modKeyLabel}
                      </kbd>{" "}
                      +{" "}
                      <kbd className="bg-neutral-800 px-1 py-0.5 rounded border border-neutral-700 font-bold">
                        Enter
                      </kbd>
                    </div>
                  </div>

                  {/* Submit Button with Tooltip */}
                  <div className="relative group">
                    <button
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-bold bg-gradient-to-r from-primary to-indigo-600 text-white shadow-sm shadow-primary/20 hover:shadow-primary/40 transition-all cursor-pointer ${isExecuting ? "opacity-60" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        triggerSubmit();
                      }}
                      disabled={isRunning || isExecuting}
                    >
                      {isExecuting ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      Submit
                    </button>
                    <div className="absolute bottom-full mb-2 right-0 hidden group-hover:flex items-center gap-1 bg-neutral-900 text-neutral-100 text-[11px] px-2 py-1.5 rounded-md shadow-lg whitespace-nowrap z-50 border border-neutral-800">
                      Submit{" "}
                      <kbd className="bg-neutral-800 px-1 py-0.5 rounded border border-neutral-700 font-bold">
                        {modKeyLabel}
                      </kbd>{" "}
                      +{" "}
                      <kbd className="bg-neutral-800 px-1 py-0.5 rounded border border-neutral-700 font-bold">
                        Shift
                      </kbd>{" "}
                      +{" "}
                      <kbd className="bg-neutral-800 px-1 py-0.5 rounded border border-neutral-700 font-bold">
                        Enter
                      </kbd>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Vertical Resizer ─── */}
            {showConsole && (
              <div
                className={`h-1.5 cursor-row-resize flex items-center justify-center group z-20 shrink-0 transition-colors touch-none ${isVResizing ? "bg-primary/20" : "hover:bg-primary/10"}`}
                onMouseDown={startVResizing}
                onTouchStart={startVResizing}
                aria-label="Resize editor and console vertically"
              >
                <div className="h-[2px] w-12 rounded-full bg-base-content/10 group-hover:bg-primary/50 transition-colors" />
              </div>
            )}

            {/* ─── Console Card ─── */}
            {showConsole && (
              <div
                className="flex flex-col rounded-xl bg-[#12121a] border border-white/5 overflow-hidden"
                style={{ height: `${consoleHeight}%` }}
              >
                {/* Console tabs */}
                <div className="flex items-center justify-between px-4 py-1.5 border-b border-base-content/5 shrink-0">
                  <div className="flex items-center gap-0">
                    <button
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-bold transition-all border-b-2 cursor-pointer ${
                        consoleTab === "testcase"
                          ? "text-primary border-primary"
                          : "text-base-content/45 border-transparent hover:text-base-content/70"
                      }`}
                      onClick={() => setConsoleTab("testcase")}
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      Testcase
                    </button>
                    {displayResult && (
                      <button
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-bold transition-all border-b-2 cursor-pointer ${
                          consoleTab === "result"
                            ? "text-primary border-primary"
                            : "text-base-content/45 border-transparent hover:text-base-content/70"
                        }`}
                        onClick={() => setConsoleTab("result")}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        Test Result
                      </button>
                    )}
                  </div>
                  <button
                    className="p-1 rounded text-base-content/30 hover:text-base-content/60 transition-all cursor-pointer"
                    onClick={() => setShowConsole(false)}
                    aria-label="Close Console"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Console content */}
                <div
                  ref={consoleContentRef}
                  className="flex-1 overflow-y-auto px-5 py-4"
                >
                  {consoleTab === "result" && displayResult ? (
                    <Submission submission={displayResult} />
                  ) : (
                    <div className="space-y-4">
                      {/* Case tabs (normal scrollable) */}
                      {testCases.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {testCases.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveTestCaseTab(idx)}
                              className={`px-3.5 py-1.5 rounded-md text-[13px] font-bold transition-all cursor-pointer ${
                                activeTestCaseTab === idx
                                  ? "bg-base-content/10 text-base-content"
                                  : "text-base-content/40 hover:text-base-content/70"
                              }`}
                            >
                              Case {idx + 1}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Test case content */}
                      {testCases[activeTestCaseTab] && (
                        <div className="space-y-4">
                          <div>
                            <div className="text-xs uppercase font-bold text-base-content/65 tracking-wide mb-2">
                              Input
                            </div>
                            <div className="bg-base-content/[0.03] border border-base-content/5 rounded-lg px-4 py-3 font-mono text-[15px] text-base-content/90 font-bold select-all">
                              {testCases[activeTestCaseTab].input}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs uppercase font-bold text-base-content/65 tracking-wide mb-2">
                              Expected Output
                            </div>
                            <div className="bg-base-content/[0.03] border border-base-content/5 rounded-lg px-4 py-3 font-mono text-[15px] text-base-content/90 font-bold select-all">
                              {testCases[activeTestCaseTab].output}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
