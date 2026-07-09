import React, { useEffect } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { useAuthStore } from "../store/useAuthStore";
import { Navigate, Link } from "react-router-dom";
import {
  Users,
  Code,
  Terminal,
  Settings,
  Activity,
  Cpu,
  Database,
  TrendingUp,
  ChevronRight,
  Clock,
  Zap,
  AlertCircle,
} from "lucide-react";

export default function AdminPage() {
  const { authUser } = useAuthStore();
  const { analytics, isLoading, error, fetchAnalytics } = useAdminStore();

  useEffect(() => {
    if (authUser?.role === "ADMIN") {
      fetchAnalytics();
    }
  }, [authUser, fetchAnalytics]);

  // Protect route
  if (!authUser || authUser.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-midnight text-slate-100 py-10 px-4 md:px-10 lg:px-20 relative overflow-hidden">
      {/* Header Container */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-base-content/10 pb-8">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-semibold tracking-wider text-xs uppercase mb-1">
            <Settings className="w-4 h-4 animate-spin-slow" />
            Control Center
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent">
            Admin Analytics
          </h1>
          <p className="text-slate-400 mt-2 text-sm max-w-xl">
            Real-time insights on submission activities, developer metrics, and
            LeetLab system execution performances.
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          disabled={isLoading}
          className="relative group overflow-hidden rounded-xl p-px transition-all hover:scale-[1.02]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl transition-all group-hover:opacity-100" />
          <div className="relative px-6 py-3 bg-gradient-to-br from-[#16142c] to-[#0d0c1b] rounded-xl text-sm font-semibold tracking-wide text-white transition-colors group-hover:bg-transparent">
            {isLoading ? "Refreshing Metrics..." : "Refresh Console"}
          </div>
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      {isLoading ? (
        // Skeleton loader
        <div className="space-y-10 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-32 bg-gradient-to-br from-[#16142c] to-[#0d0c1b] border border-white/5 rounded-2xl"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-gradient-to-br from-[#16142c] to-[#0d0c1b] border border-white/5 rounded-2xl" />
            <div className="h-96 bg-gradient-to-br from-[#16142c] to-[#0d0c1b] border border-white/5 rounded-2xl" />
          </div>
        </div>
      ) : analytics ? (
        <div className="space-y-10">
          {/* Card Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Users Card */}
            <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-[#16142c] to-[#0d0c1b] border border-white/5 p-6 hover:border-purple-500/30 transition-all duration-300 shadow-2xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-all duration-300" />
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 dark:text-purple-400">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400/80 bg-purple-500/5 px-2.5 py-1 rounded-full border border-purple-500/10">
                  +12% this week
                </span>
              </div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Total Accounts
              </p>
              <h2 className="text-3xl font-black tracking-tight text-white mt-1">
                {analytics.counts?.totalUsers || 0}
              </h2>
            </div>

            {/* Problems Card */}
            <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-[#16142c] to-[#0d0c1b] border border-white/5 p-6 hover:border-cyan-500/30 transition-all duration-300 shadow-2xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-all duration-300" />
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-500 dark:text-cyan-400">
                  <Code className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400/80 bg-cyan-500/5 px-2.5 py-1 rounded-full border border-cyan-500/10">
                  Active database
                </span>
              </div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Seeded Problems
              </p>
              <h2 className="text-3xl font-black tracking-tight text-white mt-1">
                {analytics.counts?.totalProblems || 0}
              </h2>
            </div>

            {/* Submissions Card */}
            <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-[#16142c] to-[#0d0c1b] border border-white/5 p-6 hover:border-rose-500/30 transition-all duration-300 shadow-2xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-all duration-300" />
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 dark:text-rose-400">
                  <Terminal className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400/80 bg-rose-500/5 px-2.5 py-1 rounded-full border border-rose-500/10">
                  Compiler runs
                </span>
              </div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Submissions Run
              </p>
              <h2 className="text-3xl font-black tracking-tight text-white mt-1">
                {analytics.counts?.totalSubmissions || 0}
              </h2>
            </div>
          </div>

          {/* Interactive Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Daily Submissions Chart */}
            <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-[#16142c] to-[#0d0c1b] border border-white/5 p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                      Submission Frequency
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Tracking code compiling iterations over the past week.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {analytics.dailySubmissions?.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-white/5 rounded-xl">
                      <TrendingUp className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-2" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        No activity registered this week
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-7 gap-2 items-end h-48 border-b border-slate-200 dark:border-white/5 pb-2">
                      {analytics.dailySubmissions?.map((day, idx) => {
                        const maxCount = Math.max(
                          ...analytics.dailySubmissions.map((d) => d.count),
                          1,
                        );
                        const percentage = (day.count / maxCount) * 100;
                        const dateObj = new Date(day._id);
                        const formattedDate = dateObj.toLocaleDateString(
                          "en-US",
                          { weekday: "short", day: "numeric" },
                        );

                        return (
                          <div
                            key={idx}
                            className="flex flex-col items-center group gap-2 h-full justify-end"
                          >
                            <div className="text-[10px] font-black text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {day.count}
                            </div>
                            <div
                              style={{ height: `${percentage}%` }}
                              className="w-full max-w-[24px] bg-gradient-to-t from-purple-500 to-cyan-400 rounded-t-md hover:from-purple-400 hover:to-cyan-300 transition-all duration-300 relative"
                            >
                              <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 rounded-t-md transition-opacity" />
                            </div>
                            <span className="text-[9px] font-medium text-slate-550 dark:text-slate-400 tracking-tight text-center truncate max-w-full">
                              {formattedDate}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Language & Outcomes Section */}
            <div className="rounded-2xl bg-gradient-to-br from-[#16142c] to-[#0d0c1b] border border-white/5 p-6 shadow-xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                  Language Analytics
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Distribution of compilers selected by users.
                </p>
              </div>

              <div className="space-y-4">
                {Object.keys(analytics.languageDistribution || {}).length ===
                0 ? (
                  <p className="text-xs text-slate-400 font-medium">
                    No language distributions logged
                  </p>
                ) : (
                  Object.entries(analytics.languageDistribution).map(
                    ([lang, count], idx) => {
                      const total = Object.values(
                        analytics.languageDistribution,
                      ).reduce((a, b) => a + b, 0);
                      const pct =
                        total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
                      const isCpp =
                        lang.toUpperCase() === "CPP" ||
                        lang.toUpperCase() === "C++";
                      const formattedLangName = isCpp
                        ? "C++"
                        : lang.charAt(0) + lang.slice(1).toLowerCase();

                      // Choose colors
                      const colorMap = {
                        JAVASCRIPT: "from-amber-400 to-orange-500",
                        PYTHON: "from-blue-400 to-indigo-500",
                        JAVA: "from-rose-500 to-red-600",
                        CPP: "from-cyan-400 to-purple-500",
                      };
                      const colorClass =
                        colorMap[lang.toUpperCase()] ||
                        "from-slate-400 to-slate-600";

                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-600 dark:text-slate-300">
                              {formattedLangName}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400">
                              {count} ({pct}%)
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${pct}%` }}
                              className={`h-full bg-gradient-to-r ${colorClass} rounded-full`}
                            />
                          </div>
                        </div>
                      );
                    },
                  )
                )}
              </div>
            </div>
          </div>

          {/* User & System Status Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Active Users List */}
            <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-[#16142c] to-[#0d0c1b] border border-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                Active Developers
              </h3>
              <div className="overflow-x-auto">
                <table className="table w-full text-slate-200 text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400 uppercase tracking-wider text-[10px] font-semibold">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4 text-center">Current Streak</th>
                      <th className="py-3 px-4 text-center">Max Streak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.activeUsers?.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center py-6 text-base-content/50 font-medium"
                        >
                          No registered developers found
                        </td>
                      </tr>
                    ) : (
                      analytics.activeUsers?.map((user, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-3.5 px-4 flex items-center gap-2">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name}
                                className="w-6 h-6 rounded-full object-cover border border-purple-500/20"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                                {user.name
                                  ? user.name.slice(0, 2).toUpperCase()
                                  : "??"}
                              </div>
                            )}
                            <span className="font-semibold text-white truncate max-w-[120px]">
                              {user.name || "Anonymous"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-350 truncate max-w-[150px]">
                            {user.email}
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-amber-500">
                            🔥 {user.currentStreak || 0}
                          </td>
                          <td className="py-3.5 px-4 text-center font-semibold text-base-content/50">
                            {user.maxStreak || 0}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* System Status Panel */}
            <div className="rounded-2xl bg-gradient-to-br from-[#16142c] to-[#0d0c1b] border border-white/5 p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <Database className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                  System Metrics
                </h3>

                <div className="space-y-4">
                  {/* Database Health */}
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                      <Database className="w-4 h-4 text-indigo-400" />
                      MongoDB Connection
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="text-xs font-bold text-emerald-450">
                        {analytics.systemMetrics?.dbConnection || "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Execution Latency */}
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      Average Latency
                    </span>
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-yellow-450 fill-yellow-500 animate-pulse" />
                      {analytics.systemMetrics?.averageExecutionTime ||
                        "0.000s"}
                    </span>
                  </div>

                  {/* Judge0 Health */}
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-rose-455" />
                      Compiler Status
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="text-xs font-bold text-emerald-450">
                        Online
                      </span>
                    </div>
                  </div>

                  {/* Node Uptime */}
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-purple-400" />
                      Console Uptime
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {analytics.systemMetrics?.nodeUptime || "0s"}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Dashboard Actions */}
              <div className="mt-6 border-t border-slate-200 dark:border-white/5 pt-4">
                <Link
                  to="/problems"
                  className="flex items-center justify-between text-xs font-semibold text-purple-650 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors group"
                >
                  Return to Problems console
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-gradient-to-br from-[#16142c] to-[#0d0c1b] rounded-2xl border border-white/5 shadow-xl">
          <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400 font-semibold">
            No analytics database records loaded.
          </p>
        </div>
      )}
    </div>
  );
}
