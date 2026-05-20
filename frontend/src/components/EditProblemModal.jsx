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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-base-300 bg-opacity-50">
      <div className="bg-base-100 rounded-lg shadow-xl w-full md:w-1/2 ">
        <div className="p-4 md:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Update Problem</h2>
            <button onClick={onClose} className="btn btn-circle btn-ghost">
              <X className="w-6 h-6" />
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

          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button
              disabled={isUpdatingProblem}
              onClick={handleSubmit}
              className="btn btn-primary"
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
