import React from "react";
import CreateProblemForm from "../components/CreateProblemForm";
import { Link } from "react-router-dom";
import { ArrowLeft, Code } from "lucide-react";

const AddProblem = () => {
  return (
    <div className="min-h-screen bg-[#080711] text-slate-100 py-10 px-4 md:px-10 lg:px-20 relative w-full overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header Back Navigation */}
        <div className="flex justify-between items-center border-b border-white/5 pb-8">
          <div>
            <Link
              to="/problems"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-purple-400 transition-all uppercase tracking-wider mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Explore Problems
            </Link>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent">
              Add New Problem
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Design a new coding challenge complete with descriptions, test
              cases, and solution code.
            </p>
          </div>
          <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400 hidden sm:block">
            <Code className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="w-full">
          <CreateProblemForm />
        </div>
      </div>
    </div>
  );
};

export default AddProblem;
