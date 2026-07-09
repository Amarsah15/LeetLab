import React, { useEffect, useRef } from "react";
import { useLeaderboardStore } from "../store/useLeaderboardStore";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Trophy, Medal, ArrowLeft, Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const LeaderboardPage = () => {
  const { leaderboard, isLoading, getLeaderboard } = useLeaderboardStore();
  const { authUser } = useAuthStore();
  const currentUserRef = useRef(null);

  useEffect(() => {
    getLeaderboard();
  }, [getLeaderboard]);

  const getRankDisplay = (rank) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center gap-1.5 justify-center">
            <Crown className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]" />
            <span className="font-bold text-yellow-400">1</span>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center gap-1.5 justify-center">
            <Medal className="w-5 h-5 text-slate-300 drop-shadow-[0_0_4px_rgba(200,200,200,0.4)]" />
            <span className="font-bold text-slate-300">2</span>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center gap-1.5 justify-center">
            <Medal className="w-5 h-5 text-amber-600 drop-shadow-[0_0_4px_rgba(180,130,40,0.4)]" />
            <span className="font-bold text-amber-600">3</span>
          </div>
        );
      default:
        return (
          <span className="font-semibold text-slate-500 text-sm text-center">
            {rank}
          </span>
        );
    }
  };

  const UserAvatar = ({ user, size = "w-9 h-9" }) => {
    if (user.image) {
      return (
        <img
          src={user.image}
          alt={user.name}
          className={`${size} rounded-full object-cover border border-purple-500/20`}
        />
      );
    }
    const initials = (user.name || "U")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    return (
      <div
        className={`${size} rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs`}
      >
        {initials}
      </div>
    );
  };

  if (isLoading) {
    return <SkeletonLeaderboard />;
  }

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
              Leaderboard
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Global rankings of top competitive developers solving problems.
            </p>
          </div>
          <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 text-yellow-400 hidden sm:block">
            <Trophy className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="flex items-end justify-center gap-4 sm:gap-8 max-w-lg mx-auto py-4">
            {/* 2nd Place */}
            <PodiumCard
              entry={leaderboard[1]}
              rank={2}
              height="h-28"
              color="from-slate-200/50 via-slate-100/30 to-[#f8fafc] dark:from-slate-800/40 dark:via-slate-900/40 dark:to-[#161622]"
              borderColor="border-slate-300/30 dark:border-slate-700/40"
              authUserId={authUser?._id}
            />
            {/* 1st Place */}
            <PodiumCard
              entry={leaderboard[0]}
              rank={1}
              height="h-36"
              color="from-yellow-200/50 via-yellow-100/30 to-[#f8fafc] dark:from-yellow-950/20 dark:via-yellow-900/10 dark:to-[#161622]"
              borderColor="border-yellow-400/30 dark:border-yellow-500/30"
              crown
              authUserId={authUser?._id}
            />
            {/* 3rd Place */}
            <PodiumCard
              entry={leaderboard[2]}
              rank={3}
              height="h-24"
              color="from-amber-200/50 via-amber-100/30 to-[#f8fafc] dark:from-amber-950/20 dark:via-amber-900/10 dark:to-[#161622]"
              borderColor="border-amber-500/20 dark:border-amber-700/30"
              authUserId={authUser?._id}
            />
          </div>
        )}

        {/* Rankings Table */}
        <div className="w-full">
          {leaderboard.length === 0 ? (
            <div className="p-12 text-center bg-gradient-to-br from-[#16142c] to-[#0d0c1b] border border-white/5 rounded-2xl shadow-xl">
              <Trophy className="w-14 h-14 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">No rankings yet</h3>
              <p className="text-xs text-slate-400">
                Solve problems to submit your solutions and appear on the
                leaderboard!
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#16142c] to-[#0d0c1b] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
              <table className="w-full text-slate-200 text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400 uppercase tracking-wider text-[10px] font-semibold bg-white/5">
                    <th className="py-4 px-6 text-center w-20">Rank</th>
                    <th className="py-4 px-6 text-left">Developer</th>
                    <th className="py-4 px-6 text-right w-40">
                      Problems Solved
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => {
                    const isCurrentUser =
                      entry.userId?.toString() === authUser?._id?.toString();
                    return (
                      <tr
                        key={entry.userId}
                        ref={isCurrentUser ? currentUserRef : null}
                        className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                          isCurrentUser
                            ? "bg-purple-500/10 border-l-4 border-l-purple-500"
                            : ""
                        }`}
                      >
                        <td className="py-4 px-6 text-center font-bold">
                          {getRankDisplay(entry.rank)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <UserAvatar user={entry} />
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">
                                {entry.name}
                              </span>
                              {isCurrentUser && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right font-black text-sm bg-gradient-to-r from-purple-600 to-cyan-500 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
                          {entry.problemsSolved}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function PodiumCard({
  entry,
  rank,
  height,
  color,
  borderColor,
  crown,
  authUserId,
}) {
  const isCurrentUser = entry.userId?.toString() === authUserId?.toString();
  const initials = (entry.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col items-center flex-1 max-w-[140px] group">
      {/* Avatar container with hover glow */}
      <div className="relative mb-2 transition-transform duration-300 group-hover:-translate-y-1">
        {crown && (
          <Crown className="absolute -top-5 left-1/2 -translate-x-1/2 w-6 h-6 text-yellow-500 dark:text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
        )}
        <div
          className={`w-12 h-12 rounded-full ring-2 ${
            rank === 1
              ? "ring-yellow-500/50 shadow-[0_0_10px_rgba(250,204,21,0.2)]"
              : rank === 2
                ? "ring-slate-350"
                : "ring-amber-600/50"
          } overflow-hidden`}
        >
          {entry.image ? (
            <img
              src={entry.image}
              alt={entry.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
              {initials}
            </div>
          )}
        </div>
      </div>

      {/* Developer Name */}
      <p className="text-xs font-semibold truncate w-full text-center mb-1 text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
        {entry.name}
      </p>

      {/* Podium base bar */}
      <div
        className={`w-full ${height} rounded-t-2xl bg-gradient-to-t ${color} border ${borderColor} border-b-0 flex flex-col items-center justify-center shadow-2xl`}
      >
        <span className="text-2xl font-black bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          {entry.problemsSolved}
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-500 font-medium">
          solved
        </span>
      </div>
    </div>
  );
}

function SkeletonLeaderboard() {
  return (
    <div className="min-h-screen bg-[#080711] text-slate-100 py-10 px-4 md:px-10 lg:px-20 relative w-full flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-10 animate-pulse">
        <div className="border-b border-white/5 pb-8">
          <div className="h-4 w-32 bg-white/5 rounded mb-2" />
          <div className="h-8 w-48 bg-white/5 rounded" />
        </div>

        <div className="flex items-end justify-center gap-6 max-w-lg mx-auto h-48">
          <div className="w-24 h-24 bg-white/5 rounded-t-2xl border border-white/5" />
          <div className="w-24 h-32 bg-white/5 rounded-t-2xl border border-white/5" />
          <div className="w-24 h-20 bg-white/5 rounded-t-2xl border border-white/5" />
        </div>

        <div className="bg-gradient-to-br from-[#16142c] to-[#0d0c1b] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex justify-between p-4 border-b border-white/5">
            <div className="h-4 w-12 bg-white/5 rounded" />
            <div className="h-4 w-32 bg-white/5 rounded" />
            <div className="h-4 w-20 bg-white/5 rounded" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 border-b border-white/5"
              style={{ opacity: 1 - i * 0.15 }}
            >
              <div className="h-5 w-8 bg-white/5 rounded" />
              <div className="h-9 w-9 bg-white/5 rounded-full" />
              <div className="h-4 w-40 bg-white/5 rounded" />
              <div className="h-4 w-10 bg-white/5 rounded ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;
