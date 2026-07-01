import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useProblemStore } from "../store/useProblemStore";

const EditProblemModal = ({ isOpen, onClose, problemId, onSubmitSuccess }) => {
  const { problem, getProblemById, updateProblem, isUpdatingProblem } =
    useProblemStore();
  const [editedProblem, setEditedProblem] = useState("");

  useEffect(() => {
    if (isOpen) {
      getProblemById(problemId);
    }
  }, [isOpen, problemId, getProblemById]);

  useEffect(() => {
    if (problem) {
      setEditedProblem(JSON.stringify(problem, null, 2));
    }
  }, [problem]);

  const handleEditorChange = (value) => {
    setEditedProblem(value);
  };

  const handleSubmit = async () => {
    try {
      const parsedProblem = JSON.parse(editedProblem); // Convert string back to JSON
      await updateProblem(problemId, parsedProblem); // Send updated JSON to DB
      if (onSubmitSuccess) {
        await onSubmitSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Invalid JSON format:", error);
      alert("Error: Invalid JSON format. Please check your input.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up duration-150">
      <div className="glass-card bg-base-100/95 border border-base-content/10 rounded-2xl shadow-2xl w-full md:w-1/2 transform transition-all duration-300 animate-scale-in">
        <div className="p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-base-content/5 pb-4">
            <h2 className="text-xl font-bold">Update Problem</h2>
            <button onClick={onClose} className="btn btn-circle btn-ghost hover:bg-base-content/10">
              <X className="w-5 h-5" />
            </button>
          </div>

          {problem && (
            <Editor
              height="400px"
              defaultLanguage="json"
              theme="vs-dark"
              value={JSON.stringify(problem, null, 2)}
              onChange={handleEditorChange}
            />
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-base-content/5">
            <button onClick={onClose} className="btn btn-ghost btn-sm font-semibold rounded-lg">
              Cancel
            </button>
            <button
              disabled={isUpdatingProblem}
              onClick={handleSubmit}
              className="btn btn-primary btn-sm px-5 font-bold rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProblemModal;
