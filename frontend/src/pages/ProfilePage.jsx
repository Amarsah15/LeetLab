import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import { useSubmissionStore } from "../store/useSubmissionStore";
import { useAuthStore } from "../store/useAuthStore";
import ProfileHeader from "../components/profile/ProfileHeader";
import StatsCard from "../components/profile/StatsCard";
import { useProblemStore } from "../store/useProblemStore";
import ProfileSubmission from "../components/profile/ProfileSubmission";
import PlaylistProfile from "../components/profile/PlaylistProfile";
import ActivityGraph from "../components/profile/ActivityGraph";
import ChangePasswordPopup from "../components/profile/ChangePasswordPopup";
import CreatePlaylistModal from "../components/CreatePlaylistModal";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const { submissions, getAllSubmissions } = useSubmissionStore();
  const { authUser, checkAuth, changePassword } = useAuthStore();
  const { getAllProblems, problems } = useProblemStore();
  const { createPlaylist } = usePlaylistStore();

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);

  useEffect(() => {
    getAllSubmissions();
    getAllProblems();
  }, [getAllSubmissions, checkAuth, getAllProblems]);

  const handleChangePassword = async (data) => {
    await changePassword(data);
  };

  const handleCreatePlaylist = async (data) => {
    await createPlaylist(data);
    window.location.reload();
  };

  let easy = 0;
  let medium = 0;
  let hard = 0;
  let solved = 0;

  problems.forEach((problem) => {
    const isSolved = problem.solvedBy.some(
      (user) => user.userId === authUser?._id,
    );
    if (isSolved) {
      solved++;
      if (problem.difficulty === "EASY") easy++;
      if (problem.difficulty === "MEDIUM") medium++;
      if (problem.difficulty === "HARD") hard++;
    }
  });

  const sections = [
    {
      id: "header",
      component: (
        <ProfileHeader
          user={{
            username: authUser.name,
            email: authUser.email,
            id: authUser._id,
          }}
          onOpenChangePassword={() => setIsChangePasswordOpen(true)}
        />
      ),
    },
    {
      id: "stats",
      component: (
        <StatsCard
          stats={{
            totalSubmited: submissions.length,
            easy,
            medium,
            hard,
            totalSolved: solved,
            highestStreak: authUser.maxStreak || 0,
            rank: 1350,
            contestRating: 1780,
          }}
        />
      ),
    },
    { id: "activity", component: <ActivityGraph submissions={submissions} /> },
    { id: "submissions", component: <ProfileSubmission /> },
    {
      id: "playlists",
      component: (
        <PlaylistProfile
          onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#080711] text-slate-100 py-10 px-4 md:px-10 lg:px-20 relative w-full overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-8">
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
              My Profile
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Trace solved coding tasks, heatmaps, and developer analytics.
            </p>
          </div>
          <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400 hidden sm:block">
            <UserIcon className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {section.component}
              {index < sections.length - 1 && (
                <div className="gradient-divider my-6" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Render modals at root */}
      <ChangePasswordPopup
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSubmit={handleChangePassword}
      />
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        onSubmit={handleCreatePlaylist}
      />
    </div>
  );
};

export default ProfilePage;
