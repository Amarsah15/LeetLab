import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import {
  Bookmark,
  PencilIcon,
  TrashIcon,
  Plus,
  Search,
  X,
  CheckCircle,
  Filter,
  Command,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddToPlaylistModal from "./AddToPlaylist";
import CreatePlaylistModal from "./CreatePlaylistModal";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { useProblemStore } from "../store/useProblemStore";
import EditProblemModal from "./EditProblemModal";

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Custom Dropdown Select Component to fix opening direction and styling
const CustomSelect = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectedOption = options.find(
    (o) => (typeof o === "string" ? o : o.value) === value,
  );
  const selectedLabel = selectedOption
    ? typeof selectedOption === "string"
      ? selectedOption
      : selectedOption.label
    : label;

  return (
    <div ref={dropdownRef} className="relative flex-1 min-w-[130px] z-[40]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="select select-sm glass-select text-sm w-full flex items-center justify-between cursor-pointer pr-8 pl-3 text-left font-medium rounded-lg h-9"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40 pointer-events-none" />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-[#12121a] border border-white/10 shadow-2xl rounded-xl py-1.5 max-h-60 overflow-y-auto z-[60] custom-scrollbar animate-scale-in">
          <button
            type="button"
            onClick={() => {
              onChange("ALL");
              setIsOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors font-medium ${value === "ALL" ? "text-primary bg-primary/5" : "text-base-content/75"}`}
          >
            {label}
          </button>
          {options.map((opt) => {
            const optVal = typeof opt === "string" ? opt : opt.value;
            const optLabel = typeof opt === "string" ? opt : opt.label;
            return (
              <button
                key={optVal}
                type="button"
                onClick={() => {
                  onChange(optVal);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors font-medium ${value === optVal ? "text-primary bg-primary/5" : "text-base-content/75"}`}
              >
                {optLabel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ProblemsTable = ({ problems }) => {
  const { deleteProblem, getAllProblems } = useProblemStore();
  const { authUser } = useAuthStore();
  const { createPlaylist } = usePlaylistStore();
  const [showDeletedModel, setShowDeletedModel] = useState(false);
  const [deletedProblemId, setDeletedProblemId] = useState(null);
  const [editedProblemId, setEditedProblemId] = useState(null);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [solvedFilter, setSolvedFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
    useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const searchInputRef = useRef(null);
  const debouncedSearch = useDebounce(search, 300);

  // Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Escape to blur search
      if (e.key === "Escape") {
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [problems]);

  const difficulties = ["EASY", "MEDIUM", "HARD"];

  const hasActiveFilters =
    difficulty !== "ALL" ||
    selectedTag !== "ALL" ||
    solvedFilter !== "ALL" ||
    debouncedSearch !== "";

  const filteredProblems = useMemo(() => {
    const filtered = (problems || [])
      .filter((problem) =>
        problem?.title?.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )
      .filter((problem) =>
        difficulty === "ALL" ? true : problem.difficulty === difficulty,
      )
      .filter((problem) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag),
      )
      .filter((problem) => {
        if (solvedFilter === "ALL") return true;
        const isSolved = problem.solvedBy?.some(
          (user) => user.userId === authUser?._id,
        );
        return solvedFilter === "SOLVED" ? isSolved : !isSolved;
      });

    return filtered.sort((a, b) => {
      const aHasDemo = a.tags?.includes("Demo");
      const bHasDemo = b.tags?.includes("Demo");
      if (aHasDemo && !bHasDemo) return -1;
      if (!aHasDemo && bHasDemo) return 1;
      return 0;
    });
  }, [
    problems,
    debouncedSearch,
    difficulty,
    selectedTag,
    solvedFilter,
    authUser,
  ]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [filteredProblems, currentPage]);

  const handleDelete = (id) => {
    setDeletedProblemId(id);
    setShowDeletedModel(true);
  };
  const handleSureDelete = async () => {
    await deleteProblem(deletedProblemId);
    await getAllProblems();
    setShowDeletedModel(false);
  };
  const handleModalClose = () => setShowDeletedModel(false);

  const handleEditProblem = (id) => {
    setEditedProblemId(id);
    setIsEditModalOpen(true);
  };

  const handleCreatePlaylist = async (data) => {
    await createPlaylist(data);
  };

  const handleAddToPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  };

  const clearFilters = () => {
    setSearch("");
    setDifficulty("ALL");
    setSelectedTag("ALL");
    setSolvedFilter("ALL");
    setCurrentPage(1);
  };

  // Close delete modal on escape
  useEffect(() => {
    if (!showDeletedModel) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowDeletedModel(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showDeletedModel]);

  return (
    <div className="w-full max-w-6xl mx-auto mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-baseline gap-2.5">
          <h2 className="text-xl font-bold text-base-content/80">
            All Problems
          </h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary uppercase tracking-wider">
            {problems.length} total
          </span>
        </div>
        <motion.button
          className="btn-gradient btn btn-sm gap-1.5 text-sm"
          onClick={() => setIsCreateModalOpen(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus className="w-3.5 h-3.5" />
          Create Playlist
        </motion.button>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky-filters">
        <div className="flex flex-wrap items-center gap-3 w-full">
          {/* Search */}
          <div className="relative flex-[2] min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search problems..."
              className="input input-sm w-full pl-9 pr-16 glass-input text-sm cursor-pointer"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-base-content/30 bg-base-content/5 rounded border border-base-content/10">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </div>

          {/* Filters */}
          <CustomSelect
            label="All Difficulty"
            value={difficulty}
            options={difficulties.map((diff) => ({
              value: diff,
              label:
                diff === "MEDIUM"
                  ? "Med."
                  : diff.charAt(0) + diff.slice(1).toLowerCase(),
            }))}
            onChange={(val) => {
              setDifficulty(val);
              setCurrentPage(1);
            }}
          />

          <CustomSelect
            label="All Tags"
            value={selectedTag}
            options={allTags}
            onChange={(val) => {
              setSelectedTag(val);
              setCurrentPage(1);
            }}
          />

          <CustomSelect
            label="All Status"
            value={solvedFilter}
            options={[
              { value: "SOLVED", label: "Solved" },
              { value: "UNSOLVED", label: "Unsolved" },
            ]}
            onChange={(val) => {
              setSolvedFilter(val);
              setCurrentPage(1);
            }}
          />

          {/* Clear filters */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="btn btn-ghost btn-sm gap-1 text-xs text-base-content/50 ml-auto md:ml-0 cursor-pointer"
                onClick={clearFilters}
              >
                <X className="w-3 h-3" />
                Clear
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#12121a]/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="premium-table w-full">
            <thead>
              <tr>
                <th className="w-16 text-pl-4">Status</th>
                <th className="text-left">Title</th>
                <th className="text-left pl-6 hidden sm:table-cell">Tags</th>
                <th className="w-28 text-left">Difficulty</th>
                <th className="w-36 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {paginatedProblems.length > 0 ? (
                  paginatedProblems.map((problem, index) => {
                    const isSolved = problem.solvedBy.some(
                      (user) => user.userId === authUser?._id,
                    );
                    return (
                      <motion.tr
                        key={problem._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="cursor-pointer hover:bg-base-content/5 transition-colors"
                      >
                        <td>
                          {isSolved ? (
                            <CheckCircle className="w-[22px] h-[22px] text-success" />
                          ) : (
                            <div className="w-[22px] h-[22px] rounded-full border-2 border-base-content/15" />
                          )}
                        </td>
                        <td>
                          <Link
                            to={`/problem/${problem._id}`}
                            className="font-bold text-[15px] hover:text-primary transition-colors block py-1"
                          >
                            {problem.title}
                          </Link>
                        </td>
                        <td className="hidden sm:table-cell">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {(problem.tags || [])
                              .slice(0, 2)
                              .map((tag, idx) => (
                                <span
                                  key={idx}
                                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                    tag === "Demo"
                                      ? "bg-success/10 text-success border border-success/20"
                                      : "bg-primary/10 text-primary border border-primary/20"
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                            {(problem.tags?.length || 0) > 2 && (
                              <span className="text-xs text-base-content/35 font-semibold">
                                +{problem.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`text-[13px] font-bold px-3 py-1 rounded-full ${
                              problem.difficulty === "EASY"
                                ? "badge-glow-easy"
                                : problem.difficulty === "MEDIUM"
                                  ? "badge-glow-medium"
                                  : "badge-glow-hard"
                            }`}
                          >
                            {problem.difficulty === "MEDIUM"
                              ? "MED."
                              : problem.difficulty}
                          </span>
                        </td>
                         <td className="text-center">
                          <div className="flex items-center justify-center gap-2">
                             {authUser?.role === "ADMIN" && (
                              <>
                                <button
                                  onClick={() => handleDelete(problem._id)}
                                  className="btn btn-ghost btn-xs text-error/60 hover:text-error hover:bg-error/10"
                                >
                                  <TrashIcon className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  className="btn btn-ghost btn-xs text-base-content/40 hover:text-primary hover:bg-primary/10"
                                  onClick={() => handleEditProblem(problem._id)}
                                >
                                  <PencilIcon className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                            <button
                              className="btn btn-ghost btn-xs gap-1 text-base-content/40 hover:text-primary hover:bg-primary/10"
                              onClick={() => handleAddToPlaylist(problem._id)}
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline text-xs">
                                Save
                              </span>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <Filter className="w-8 h-8 text-base-content/15 mx-auto mb-3" />
                      <p className="text-sm text-base-content/40 font-medium">
                        No problems found
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="text-xs text-primary mt-2 hover:underline"
                        >
                          Clear all filters
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-1 pb-4">
          <button
            className="btn btn-ghost btn-sm text-xs font-medium"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`btn btn-sm btn-ghost text-xs font-medium min-w-[32px] ${
                currentPage === page ? "btn-gradient !text-white" : ""
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="btn btn-ghost btn-sm text-xs font-medium"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeletedModel && (
          <motion.div
            className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleModalClose}
          >
            <motion.div
              className="glass-card bg-base-100/95 border border-base-content/10 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold mb-2">Delete Problem</h2>
              <p className="text-sm text-base-content/50 mb-6">
                Are you sure? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => {
                    handleSureDelete();
                    setShowDeletedModel(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />
      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        problemId={selectedProblemId}
      />
      <EditProblemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        problemId={editedProblemId}
        onSubmitSuccess={getAllProblems}
      />
    </div>
  );
};

export default ProblemsTable;
