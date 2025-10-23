import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Bookmark, PencilIcon, Trash, TrashIcon, Plus } from "lucide-react";
import AddToPlaylistModal from "./AddToPlaylist";
import CreatePlaylistModal from "./CreatePlaylistModal";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { useProblemStore } from "../store/useProblemStore";
import EditProblemModal from "./EditProblemModal";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
    useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Extract all unique tags from problems
  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [problems]);

  // Define allowed difficulties
  const difficulties = ["EASY", "MEDIUM", "HARD"];

  // Filter problems based on search, difficulty, and tags
  // Filter and sort problems: Demo tag first, then others
  const filteredProblems = useMemo(() => {
    const filtered = (problems || [])
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((problem) =>
        difficulty === "ALL" ? true : problem.difficulty === difficulty
      )
      .filter((problem) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
      );

    // Sort: Demo tag problems first
    return filtered.sort((a, b) => {
      const aHasDemo = a.tags?.includes("Demo");
      const bHasDemo = b.tags?.includes("Demo");

      // If a has Demo tag and b doesn't, a comes first
      if (aHasDemo && !bHasDemo) return -1;
      // If b has Demo tag and a doesn't, b comes first
      if (!aHasDemo && bHasDemo) return 1;
      // Otherwise, maintain original order
      return 0;
    });
  }, [problems, search, difficulty, selectedTag]);

  // Pagination logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProblems, currentPage]);

  const handleDelete = (id) => {
    setDeletedProblemId(id);
    setShowDeletedModel(true);
  };
  const handleSureDelete = async () => {
    deleteProblem(deletedProblemId);
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

  return (
    <div className="w-full max-w-6xl mx-auto mt-10">
      {/* Header with Create Playlist Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Problems</h2>
        <button
          className="btn btn-primary gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Create Playlist
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by title"
          className="input input-bordered w-full md:w-1/3 bg-base-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select select-bordered bg-base-200"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="ALL">All Difficulties</option>
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <select
          className="select select-bordered bg-base-200"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="ALL">All Tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="table table-zebra table-lg bg-base-200 text-base-content">
          <thead className="bg-base-300">
            <tr>
              <th>Solved</th>
              <th>Title</th>
              <th>Tags</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProblems.length > 0 ? (
              paginatedProblems.map((problem) => {
                const isSolved = problem.solvedBy.some(
                  (user) => user.userId === authUser?.id
                );
                return (
                  <tr key={problem.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSolved}
                        readOnly
                        className="checkbox checkbox-sm"
                      />
                    </td>
                    <td>
                      <Link
                        to={`/problem/${problem.id}`}
                        className="font-semibold hover:underline"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {(problem.tags || []).map((tag, idx) => (
                          <span
                            key={idx}
                            className={`badge badge-outline text-xs font-bold ${
                              tag === "Demo"
                                ? "badge-success text-success"
                                : "badge-warning"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge font-semibold text-xs text-white ${
                          problem.difficulty === "EASY"
                            ? "badge-success"
                            : problem.difficulty === "MEDIUM"
                            ? "badge-warning"
                            : "badge-error"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                        {authUser?.role === "ADMIN" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(problem.id)}
                              className="btn btn-sm btn-error"
                            >
                              <TrashIcon className="w-4 h-4 text-white" />
                            </button>
                            {showDeletedModel && (
                              <div className="fixed inset-0 flex justify-center items-center  bg-gray-900/50">
                                <div className=" p-4 rounded  shadow-md bg-base-100 ">
                                  <h2 className=" p-2 font-bold">
                                    Confirm Deletion
                                  </h2>
                                  <p className="p-2 text-sm">
                                    Are you sure you want to delete this
                                    problem?
                                  </p>
                                  <div className="flex gap-4 mt-5 mr-4 ml-4 items-center mb-3 justify-between">
                                    <button
                                      className="px-4 py-2 bg-primary/80 font-semibold rounded text-sm cursor-pointer"
                                      onClick={() => {
                                        handleSureDelete();
                                        setShowDeletedModel(false);
                                      }}
                                    >
                                      Yes, Delete
                                    </button>
                                    <button
                                      className="px-4 py-2 outline rounded text-sm cursor-pointer"
                                      onClick={handleModalClose}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            <button
                              className="btn btn-sm bg-base-200 outline-gray-50"
                              onClick={() => handleEditProblem(problem.id)}
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        <button
                          className="btn btn-sm btn-outline flex gap-2 items-center"
                          onClick={() => handleAddToPlaylist(problem.id)}
                        >
                          <Bookmark className="w-4 h-4" />
                          <span className="hidden sm:inline">
                            Save to Playlist
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No problems found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2 py-4 mb-4">
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
        problemId={editedProblemId} //sending data to backend
      />
    </div>
  );
};

export default ProblemsTable;
