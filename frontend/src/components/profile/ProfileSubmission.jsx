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

  const filteredSubmissions = submissions.filter((submission) => {
    if (filter === "all") return true;
    return submission.status === filter;
  });
  // Pagination logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredSubmissions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
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
    <div className="n bg-base-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary mb-4 md:mb-0">
            My Submissions
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto ">
            <div className="dropdown dropdown-end mt-3">
              <div tabIndex={0} role="button" className="btn btn-outline gap-2">
                <Filter size={16} />
                {filter === "all" ? "All Submissions" : filter}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <button onClick={() => setFilter("all")}>
                    All Submissions
                  </button>
                </li>
                <li>
                  <button onClick={() => setFilter("Accepted")}>
                    Accepted
                  </button>
                </li>
                <li>
                  <button onClick={() => setFilter("Wrong Answer")}>
                    Wrong Answer
                  </button>
                </li>
                <li>
                  <button onClick={() => setFilter("Time Limit Exceeded")}>
                    Time Limit Exceeded
                  </button>
                </li>
              </ul>
            </div>

            <div className="stats shadow bg-base-100">
              <div className="stat p-2 mx-1">
                <div className="stat-title text-center">Total</div>
                <div className="stat-value text-lg text-center">
                  {submissions.length}
                </div>
              </div>
              <div className="stat p-2">
                <div className="stat-title text-center ml-1">Accepted</div>
                <div className="stat-value text-lg text-success text-center">
                  {submissions.filter((s) => s.status === "Accepted").length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {paginatedProblems.length === 0 ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title">No submissions found</h2>
              <p>
                You haven't submitted any solutions yet, or none match your
                current filter.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedProblems.reverse().map((submission) => (
              <div
                key={submission.id}
                className="card bg-base-100 shadow-xl overflow-hidden transition-all duration-300"
              >
                <div
                  className="card-body p-0"
                  role="button"
                  onClick={() => toggleExpand(submission.id)}
                >
                  {/* Submission Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 cursor-pointer hover:bg-base-200">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
                      <div
                        className={`badge badge-lg ${getStatusClass(
                          submission.status
                        )}`}
                      >
                        {submission.status === "Accepted" ? (
                          <Check size={14} className="mr-1" />
                        ) : null}
                        {submission.status}
                      </div>

                      <div className="flex items-center gap-2">
                        <Code size={16} />
                        <span className="font-medium">
                          {submission.language}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>
                          Submitted {formatDate(submission.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 md:mt-0">
                      {expandedSubmission === submission.id ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedSubmission === submission.id && (
                    <div className="border-t border-base-300">
                      {/* Code Section */}
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                          <Code size={18} />
                          Solution Code
                        </h3>
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
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          className="btn btn-sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </button>
        <span className="btn btn-ghost btn-sm">
          {currentPage} / {totalPages}
        </span>
        <button
          className="btn btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProfileSubmission;
