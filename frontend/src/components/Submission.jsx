import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
  Book,
  Terminal,
} from "lucide-react";

const Submission = ({ submission }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Parse stringified arrays
  const memoryArr = JSON.parse(submission.memory || "[]");
  const timeArr = JSON.parse(submission.time || "[]");

  // Calculate averages
  const avgMemory = memoryArr.length
    ? memoryArr.map((m) => parseFloat(m)).reduce((a, b) => a + b, 0) /
      memoryArr.length
    : 0;

  const avgTime = timeArr.length
    ? timeArr.map((t) => parseFloat(t)).reduce((a, b) => a + b, 0) /
      timeArr.length
    : 0;

  const testCasesList = submission.testCases || [];
  const passedTests = testCasesList.filter((tc) => tc.passed).length;
  const totalTests = testCasesList.length;
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  const isRunMode = submission.mode === "run";
  const allPassed = passedTests === totalTests && totalTests > 0;

  // Active test case details
  const activeCase = testCasesList[activeTab];

  return (
    <div className="space-y-4 text-base-content select-text">
      {isRunMode ? (
        /* Run Mode Sleek Banner */
        <div
          className={`flex items-center gap-3 p-3.5 rounded-xl border ${
            allPassed
              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-500"
              : "bg-rose-500/10 border-rose-500/25 text-rose-500"
          }`}
        >
          {allPassed ? (
            <>
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <h3 className="font-bold text-base">Accepted</h3>
                <p className="text-sm opacity-90">
                  All test cases passed successfully!
                </p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 shrink-0" />
              <div>
                <h3 className="font-bold text-base">Wrong Answer / Failed</h3>
                <p className="text-sm opacity-90">
                  Some test cases returned unexpected output or errors.
                </p>
              </div>
            </>
          )}
        </div>
      ) : (
        /* Submit Mode Stats Cards */
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div className="bg-base-200/60 dark:bg-base-300/30 p-4 rounded-xl border border-base-300/40 flex flex-col justify-center shadow-sm">
            <span className="text-[13px] uppercase font-bold text-base-content/50 flex items-center gap-1.5 tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-primary" /> Status
            </span>
            <span
              className={`text-[16px] font-extrabold mt-1.5 ${
                submission.status === "Accepted"
                  ? "text-emerald-500"
                  : "text-rose-500"
              }`}
            >
              {submission.status}
            </span>
          </div>

          <div className="bg-base-200/60 dark:bg-base-300/30 p-4 rounded-xl border border-base-300/40 flex flex-col justify-center shadow-sm">
            <span className="text-[13px] uppercase font-bold text-base-content/50 flex items-center gap-1.5 tracking-wider">
              <Book className="w-4 h-4 text-primary" /> Success Rate
            </span>
            <span className="text-[16px] font-extrabold mt-1.5 text-base-content">
              {successRate.toFixed(1)}%
            </span>
          </div>

          <div className="bg-base-200/60 dark:bg-base-300/30 p-4 rounded-xl border border-base-300/40 flex flex-col justify-center shadow-sm">
            <span className="text-[13px] uppercase font-bold text-base-content/50 flex items-center gap-1.5 tracking-wider">
              <Clock className="w-4 h-4 text-primary" /> Runtime
            </span>
            <span className="text-[16px] font-extrabold mt-1.5 text-base-content">
              {avgTime.toFixed(3)} s
            </span>
          </div>

          <div className="bg-base-200/60 dark:bg-base-300/30 p-4 rounded-xl border border-base-300/40 flex flex-col justify-center shadow-sm">
            <span className="text-[13px] uppercase font-bold text-base-content/50 flex items-center gap-1.5 tracking-wider">
              <Memory className="w-4 h-4 text-primary" /> Memory
            </span>
            <span className="text-[16px] font-extrabold mt-1.5 text-base-content">
              {avgMemory.toFixed(0)} KB
            </span>
          </div>
        </div>
      )}

      {/* Case-by-case Tabs */}
      {testCasesList.length > 0 && (
        <div className="flex flex-col gap-3">
          {/* Tab Selector */}
          <div className="flex flex-wrap gap-1.5 border-b border-base-300/50 pb-2">
            {testCasesList.map((tc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`btn btn-sm rounded-lg font-bold border gap-1.5 text-[13px] ${
                  activeTab === idx
                    ? "btn-active bg-primary/10 border-primary/20 text-primary"
                    : "btn-ghost border-transparent text-base-content/75 hover:bg-base-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${tc.passed ? "bg-emerald-500" : "bg-rose-500"}`}
                />
                Case {idx + 1}
              </button>
            ))}
          </div>

          {/* Active Case Detail Output */}
          {activeCase && (
            <div className="space-y-4 bg-base-200/50 p-5 rounded-xl border border-base-300">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-base-content/75 uppercase tracking-wide">
                  Test Case details
                </span>
                <span
                  className={`text-base font-extrabold ${activeCase.passed ? "text-emerald-500" : "text-rose-500"}`}
                >
                  {activeCase.passed
                    ? "PASSED"
                    : activeCase.status === "Accepted"
                      ? "Wrong Answer"
                      : activeCase.status || "FAILED"}
                </span>
              </div>

              {/* Input */}
              {activeCase.input && (
                <div>
                  <div className="text-[13px] uppercase font-bold text-base-content/70 tracking-wide">
                    Input:
                  </div>
                  <pre className="border-l-4 border-blue-500 bg-base-200/60 text-base-content p-3.5 rounded-r-lg font-mono text-[15px] border-y border-r border-base-300/40 mt-1 select-all overflow-x-auto font-bold shadow-sm">
                    {activeCase.input}
                  </pre>
                </div>
              )}

              {/* Expected Output */}
              <div>
                <div className="text-[13px] uppercase font-bold text-base-content/70 tracking-wide">
                  Expected Output:
                </div>
                <pre className="border-l-4 border-emerald-500 bg-base-200/60 text-emerald-600 dark:text-emerald-400 p-3.5 rounded-r-lg font-mono text-[15px] border-y border-r border-base-300/40 mt-1 select-all overflow-x-auto font-bold shadow-sm">
                  {activeCase.expected || "null"}
                </pre>
              </div>

              {/* Your Output */}
              <div>
                <div className="text-[13px] uppercase font-bold text-base-content/70 tracking-wide">
                  Your Output:
                </div>
                <pre
                  className={`border-l-4 p-3.5 rounded-r-lg font-mono text-[15px] border-y border-r border-base-300/40 mt-1 select-all overflow-x-auto font-bold shadow-sm ${
                    activeCase.passed
                      ? "border-emerald-500 bg-base-200/60 text-emerald-600 dark:text-emerald-400"
                      : "border-rose-500 bg-base-200/60 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {activeCase.stdout || "null"}
                </pre>
              </div>

              {/* Compile Error logs */}
              {activeCase.compileOutput && (
                <div>
                  <div className="text-[13px] uppercase font-bold text-rose-600 dark:text-rose-400 tracking-wide">
                    Compile Error log:
                  </div>
                  <pre className="border-l-4 border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 p-3.5 rounded-r-lg font-mono text-[15px] border-y border-r border-rose-500/25 mt-1 overflow-x-auto whitespace-pre-wrap font-bold shadow-sm">
                    {activeCase.compileOutput}
                  </pre>
                </div>
              )}

              {/* Standard Error logs */}
              {activeCase.stderr && (
                <div>
                  <div className="text-[13px] uppercase font-bold text-rose-600 dark:text-rose-400 tracking-wide">
                    Runtime Error (stderr):
                  </div>
                  <pre className="border-l-4 border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 p-3.5 rounded-r-lg font-mono text-[15px] border-y border-r border-rose-500/25 mt-1 overflow-x-auto whitespace-pre-wrap font-bold shadow-sm">
                    {activeCase.stderr}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Submission;
