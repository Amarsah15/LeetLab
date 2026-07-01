import React, { useEffect } from "react";
import { useProblemStore } from "../store/useProblemStore";
import ProblemTable from "../components/ProblemTable";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";
import {
  Code,
  Trophy,
  Activity,
  Flame,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Link } from "react-router-dom";

const ProblemsPage = () => {
  const {
    getAllProblems,
    problems,
    isProblemsLoading,
    getDailyProblem,
    dailyProblem,
    isDailyProblemLoading,
  } = useProblemStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getAllProblems();
    getDailyProblem();
  }, [getAllProblems, getDailyProblem]);

  // Calculate stats
  const solvedCount = problems.filter((p) =>
    p.solvedBy?.some((u) => u.userId === authUser?._id),
  ).length;

  const easyProblems = problems.filter((p) => p.difficulty === "EASY");
  const mediumProblems = problems.filter((p) => p.difficulty === "MEDIUM");
  const hardProblems = problems.filter((p) => p.difficulty === "HARD");

  const easySolved = easyProblems.filter((p) =>
    p.solvedBy?.some((u) => u.userId === authUser?._id),
  ).length;
  const mediumSolved = mediumProblems.filter((p) =>
    p.solvedBy?.some((u) => u.userId === authUser?._id),
  ).length;
  const hardSolved = hardProblems.filter((p) =>
    p.solvedBy?.some((u) => u.userId === authUser?._id),
  ).length;

  const completionRate =
    problems.length > 0 ? Math.round((solvedCount / problems.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 py-10 px-4 md:px-10 lg:px-20 relative w-full overflow-hidden">
      {/* Background radial gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] rounded-full bg-purple-900/10 blur-[120px] animate-pulse" />
      <div
        className="absolute top-24 right-1/4 w-[400px] h-[250px] rounded-full bg-cyan-900/10 blur-[100px] animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-base-content/10 pb-8">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-semibold tracking-wider text-xs uppercase mb-1">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Welcome to your workspace
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent">
              {authUser?.name || "Developer"}
            </h1>
            <p className="text-slate-400 mt-2 text-sm max-w-xl">
              Sharpen your coding skills, practice interview challenges, and
              trace your solution analytics in real-time.
            </p>
          </div>

          {/* User Streak Overlay Card */}
          {authUser && (
            <div className="flex items-center gap-4 bg-[#12121a] border border-white/5 px-6 py-3.5 rounded-2xl shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Current Streak
                </p>
                <h3 className="text-xl font-black text-white">
                  {authUser.currentStreak || 0} consecutive days
                </h3>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards Section */}
        {!isProblemsLoading && problems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Total Progress */}
            <div className="relative group overflow-hidden rounded-2xl bg-[#12121a] border border-white/5 p-6 hover:border-purple-500/30 transition-all duration-300 shadow-2xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-all duration-300" />
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 dark:text-purple-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400/80 bg-purple-500/5 px-2.5 py-1 rounded-full border border-purple-500/10">
                  {completionRate}% Solved
                </span>
              </div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Overall Progress
              </p>
              <h2 className="text-3xl font-black tracking-tight text-white mt-1">
                {solvedCount}{" "}
                <span className="text-sm font-semibold text-slate-500">
                  / {problems.length}
                </span>
              </h2>
              <div className="w-full bg-base-content/10 rounded-full h-1.5 mt-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            {/* Card 2: Easy Problems */}
            <div className="relative group overflow-hidden rounded-2xl bg-[#12121a] border border-white/5 p-6 hover:border-emerald-500/30 transition-all duration-300 shadow-2xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all duration-300" />
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Easy Tasks
              </p>
              <h2 className="text-3xl font-black tracking-tight text-white mt-1">
                {easySolved}{" "}
                <span className="text-sm font-semibold text-slate-500">
                  / {easyProblems.length}
                </span>
              </h2>
              <p className="text-[10px] text-emerald-400 font-semibold mt-3 select-none">
                Beginner challenges
              </p>
            </div>

            {/* Card 3: Medium Problems */}
            <div className="relative group overflow-hidden rounded-2xl bg-[#12121a] border border-white/5 p-6 hover:border-amber-500/30 transition-all duration-300 shadow-2xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all duration-300" />
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Medium Tasks
              </p>
              <h2 className="text-3xl font-black tracking-tight text-white mt-1">
                {mediumSolved}{" "}
                <span className="text-sm font-semibold text-slate-500">
                  / {mediumProblems.length}
                </span>
              </h2>
              <p className="text-[10px] text-amber-450 font-semibold mt-3">
                Interview coding practice
              </p>
            </div>

            {/* Card 4: Hard Problems */}
            <div className="relative group overflow-hidden rounded-2xl bg-[#12121a] border border-white/5 p-6 hover:border-rose-500/30 transition-all duration-300 shadow-2xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-all duration-300" />
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 dark:text-rose-400">
                  <Flame className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Hard Tasks
              </p>
              <h2 className="text-3xl font-black tracking-tight text-white mt-1">
                {hardSolved}{" "}
                <span className="text-sm font-semibold text-slate-500">
                  / {hardProblems.length}
                </span>
              </h2>
              <p className="text-[10px] text-rose-450 font-semibold mt-3">
                Advanced algorithmic concepts
              </p>
            </div>
          </div>
        )}

        {/* Daily Challenge Special Banner */}
        {!isDailyProblemLoading && dailyProblem && (
          <div className="relative group overflow-hidden rounded-2xl bg-[#12121a] border border-white/5 p-6 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -z-10 group-hover:bg-purple-500/10 transition-all" />
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Sparkles className="w-3 h-3" />
                Daily Challenge
              </span>
              <h3 className="text-2xl font-black text-white">
                {dailyProblem.title}
              </h3>
              <p className="text-xs text-slate-400 max-w-xl truncate">
                {dailyProblem.description?.replace(/\\n/g, " ")}
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs font-semibold">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    dailyProblem.difficulty === "EASY"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : dailyProblem.difficulty === "MEDIUM"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {dailyProblem.difficulty}
                </span>
                <span className="text-base-content/50">
                  {dailyProblem.solvedBy?.length || 0} developers solved
                </span>
              </div>
            </div>

            <Link
              to={`/problem/${dailyProblem._id}`}
              className="relative overflow-hidden rounded-xl p-px group/btn hover:scale-[1.02] transition-transform self-stretch md:self-auto flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl" />
              <div className="relative px-6 py-3.5 bg-[#12121a] rounded-xl text-xs font-bold tracking-wider uppercase text-white flex items-center gap-2 group-hover/btn:bg-transparent transition-colors">
                Solve Challenge
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        )}

        {/* Problem Table or Skeleton */}
        {isProblemsLoading ? (
          <SkeletonTable />
        ) : problems.length > 0 ? (
          <ProblemTable problems={problems} />
        ) : (
          <div className="text-center py-20 bg-[#12121a] rounded-2xl border border-white/5 shadow-xl">
            <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2 text-white">
              No problems loaded
            </h3>
            <p className="text-xs text-slate-400">
              Check database seeding setup or refresh console endpoints.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

function SkeletonTable() {
  return (
    <div className="w-full space-y-3">
      {/* Skeleton filter bar */}
      <div className="flex flex-wrap gap-3 mb-6 animate-pulse">
        <div className="h-10 w-48 bg-white/5 rounded-lg border border-white/5" />
        <div className="h-10 w-32 bg-white/5 rounded-lg border border-white/5" />
        <div className="h-10 w-28 bg-white/5 rounded-lg border border-white/5" />
        <div className="h-10 w-28 bg-white/5 rounded-lg border border-white/5" />
      </div>

      {/* Skeleton table */}
      <div className="bg-base-200 border border-base-content/10 rounded-2xl overflow-hidden shadow-2xl animate-pulse">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-white/5">
          <div className="h-4 w-16 bg-white/5 rounded" />
          <div className="h-4 w-40 flex-1 bg-white/5 rounded" />
          <div className="h-4 w-20 bg-white/5 rounded" />
          <div className="h-4 w-20 bg-white/5 rounded" />
          <div className="h-4 w-24 bg-white/5 rounded" />
        </div>
        {/* Rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 border-b border-white/5"
            style={{ opacity: 1 - i * 0.12 }}
          >
            <div className="h-5 w-5 bg-white/5 rounded" />
            <div
              className="h-4 flex-1 bg-white/5 rounded"
              style={{ maxWidth: `${200 + Math.random() * 150}px` }}
            />
            <div className="h-5 w-14 bg-white/5 rounded-full" />
            <div className="h-5 w-16 bg-white/5 rounded-full" />
            <div className="h-8 w-24 bg-white/5 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProblemsPage;
