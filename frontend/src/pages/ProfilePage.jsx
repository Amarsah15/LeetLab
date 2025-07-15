import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, User, Shield, Image } from "lucide-react";
import { useSubmissionStore } from "../store/useSubmissionStore";
import { useAuthStore } from "../store/useAuthStore";
import ProfileHeader from "../components/profile/ProfileHeader";
import StatsCard from "../components/profile/StatsCard";
import { useProblemStore } from "../store/useProblemStore";
import ProfileSubmission from "../components/profile/ProfileSubmission";
import PlaylistProfile from "../components/profile/PlaylistProfile";
import ActivityGraph from "../components/profile/ActivityGraph";

const ProfilePage = () => {
  const { submissions, getAllSubmissions } = useSubmissionStore();
  const { authUser, checkAuth } = useAuthStore();
  const { getAllProblems, problems } = useProblemStore();

  useEffect(() => {
    getAllSubmissions(), getAllProblems();
  }, [getAllSubmissions, checkAuth, getAllProblems]);

  let easy = 0;
  let medium = 0;
  let hard = 0;
  let solved = 0;

  problems.forEach((problem) => {
    const isSolved = problem.solvedBy.some(
      (user) => user.userId === authUser?.id
    );
    if (isSolved) {
      solved++;
      if (problem.difficulty === "EASY") {
        easy++;
      }
      if (problem.difficulty === "MEDIUM") {
        medium++;
      }
      if (problem.difficulty === "HARD") {
        hard++;
      }
    }
  });

  return (
    <div>
      {/* Header with back button */}
      <div className="flex flex-row justify-between items-center w-full mb-6">
        <div className="flex items-center gap-3 mt-5">
          <Link to={"/"} className="btn btn-circle btn-ghost">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-primary ">Profile</h1>
        </div>
      </div>
      <div>
        <ProfileHeader
          user={{
            username: authUser.name,
            email: authUser.email,
            id: authUser.id,
          }}
        />
        <div className="divider"></div>
        <StatsCard
          stats={{
            totalSubmited: submissions.length,
            easy: easy,
            medium: medium,
            hard: hard,
            totalSolved: solved,
            highestStreak: 22,
            rank: 1350,
            contestRating: 1780,
          }}
        />
        <div className="divider"></div>
        <ProfileSubmission />
        <div className="divider"></div>
        <PlaylistProfile />
        <div className="divider"></div>
        <ActivityGraph submissions={submissions} />
        <div className="divider"></div>
      </div>
    </div>
  );
};

export default ProfilePage;
