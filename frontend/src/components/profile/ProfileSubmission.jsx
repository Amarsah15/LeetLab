import React, { useEffect, useMemo, useState } from "react";
import { useSubmissionStore } from "../../store/useSubmissionStore";
import {
  Code,
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import SyntaxHighlighter from "./SyntaxHighlighter/SyntaxHighlighter";

const ProfileSubmission = () => {
  const { submissions, getAllSubmissions } = useSubmissionStore();
  const [expandedSubmission, setExpandedSubmission] = useState(null);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getAllSubmissions();
  }, [getAllSubmissions]);

  // Sort submissions descending (newest first) and filter them
  const filteredSubmissions = useMemo(() => {
    const filtered = submissions.filter((submission) => {
      if (filter === "all") return true;
      return submission.status === filter;
    });
    return [...filtered].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [submissions, filter]);

  // Pagination logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredSubmissions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [filteredSubmissions, currentPage]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-success text-success-content";
      case "Wrong Answer":
        return "bg-error text-error-content";
      case "Time Limit Exceeded":
        return "bg-warning text-warning-content";
      default:
        return "bg-info text-info-content";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const toggleExpand = (id) => {
    if (expandedSubmission === id) {
      setExpandedSubmission(null);
    } else {
      setExpandedSubmission(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Section Title */}
      <h2 className="text-lg font-bold text-base-content/70 mb-4 flex items-center gap-2">
        <Code className="w-4 h-4 text-primary" />
        My Submissions
      </h2>

      <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="dropdown mt-1">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-sm btn-ghost bg-base-200/50 border-base-content/10 px-4 flex items-center gap-2 font-semibold text-base-content/80 text-xs rounded-md"
            >
              <Filter size={14} className="opacity-75" />
              {filter === "all" ? "All Submissions" : filter}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-30 menu p-1.5 shadow-xl bg-base-200 rounded-box w-48 mt-1 border border-base-content/5 text-xs"
            >
              <li>
                <button
                  className="py-2"
                  onClick={() => {
                    setFilter("all");
                    document.activeElement?.blur();
                  }}
                >
                  All Submissions
                </button>
              </li>
              <li>
                <button
                  className="py-2"
                  onClick={() => {
                    setFilter("Accepted");
                    document.activeElement?.blur();
                  }}
                >
                  Accepted
                </button>
              </li>
              <li>
                <button
                  className="py-2"
                  onClick={() => {
                    setFilter("Wrong Answer");
                    document.activeElement?.blur();
                  }}
                >
                  Wrong Answer
                </button>
              </li>
              <li>
                <button
                  className="py-2"
                  onClick={() => {
                    setFilter("Time Limit Exceeded");
                    document.activeElement?.blur();
                  }}
                >
                  Time Limit Exceeded
                </button>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-base-content/50 bg-base-200/40 px-3 py-1.5 rounded-lg border border-base-content/5">
            <div>
              Total:{" "}
              <span className="text-base-content font-bold ml-0.5">
                {submissions.length}
              </span>
            </div>
            <div className="w-px h-3 bg-base-content/10"></div>
            <div>
              Accepted:{" "}
              <span className="text-success font-bold ml-0.5">
                {submissions.filter((s) => s.status === "Accepted").length}
              </span>
            </div>
          </div>
        </div>

        {paginatedProblems.length === 0 ? (
          <div className="glass-card bg-base-200/20 p-8 text-center border border-base-content/5">
            <h2 className="text-base font-semibold text-base-content/70 mb-1">
              No submissions found
            </h2>
            <p className="text-xs text-base-content/40">
              You haven't submitted any solutions yet, or none match your
              filter.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedProblems.map((submission) => (
              <div
                key={submission._id}
                className="glass-card bg-base-200/30 overflow-hidden border border-base-content/5 transition-all duration-300 hover:border-base-content/15"
              >
                <div
                  className="p-0"
                  role="button"
                  onClick={() => toggleExpand(submission._id)}
                >
                  {/* Submission Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 cursor-pointer hover:bg-base-200/30 transition-colors">
                    <div className="flex flex-wrap items-center gap-3 w-full text-xs font-medium text-base-content/70">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase flex items-center ${
                          submission.status === "Accepted"
                            ? "bg-success/15 text-success border border-success/20"
                            : "bg-error/15 text-error border border-error/20"
                        }`}
                      >
                        {submission.status === "Accepted" && (
                          <Check size={10} className="mr-0.5" />
                        )}
                        {submission.status}
                      </span>

                      <span className="flex items-center gap-1 opacity-80">
                        <Code size={13} className="text-primary" />
                        <span>{submission.language}</span>
                      </span>

                      <span className="flex items-center gap-1 opacity-60">
                        <Clock size={13} />
                        <span>
                          Submitted {formatDate(submission.createdAt)}
                        </span>
                      </span>
                    </div>

                    <div className="text-base-content/40 hover:text-base-content/80 transition-colors mt-2 sm:mt-0">
                      {expandedSubmission === submission._id ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                  </div>

                  {/* Expanded Code */}
                  {expandedSubmission === submission._id && (
                    <div className="border-t border-base-content/5 bg-base-300/30 p-4">
                      <h3 className="font-bold text-xs text-base-content/70 mb-3 flex items-center gap-1.5">
                        <Code size={14} className="text-primary" />
                        Solution Code
                      </h3>
                      <div className="text-xs rounded-lg overflow-hidden border border-base-content/5">
                        <SyntaxHighlighter
                          code={submission.sourceCode}
                          language={submission.language.toLowerCase()}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-2 text-xs">
            <button
              className="btn btn-xs btn-ghost bg-base-200/50 border-base-content/10 disabled:opacity-40"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span className="font-medium text-base-content/50 px-2 select-none">
              {currentPage} / {totalPages}
            </span>
            <button
              className="btn btn-xs btn-ghost bg-base-200/50 border-base-content/10 disabled:opacity-40"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSubmission;
