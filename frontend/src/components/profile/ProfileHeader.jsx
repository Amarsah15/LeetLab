import {
  ArrowLeft,
  Mail,
  User,
  Shield,
  Image,
  EyeOff,
  Eye,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";
import ChangePasswordPopup from "../profile/ChangePasswordPopup";

const Profile = () => {
  const { authUser, changePassword } = useAuthStore();

  const useProfile = (name = "Profile") => {
    const words = name.trim().split(" ");
    const initials =
      words.length > 1 ? words[0][0] + words[words.length - 1][0] : words[0][0];
    return initials.toUpperCase();
  };

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const handleChangePassword = async (data) => {
    await changePassword(data);
  };

  return (
    <div className="p-4 bg-base-200">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-24 h-24 ring ring-primary ring-offset-base-100 ring-offset-2">
                  <div className="w-10 rounded-full ">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-800 to-blue-500 flex items-center justify-center text-3xl font-bold text-white">
                      {useProfile(authUser?.name)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Name and Role Badge */}
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold">{authUser.name}</h2>
              </div>
            </div>

            <div className="divider"></div>

            {/* User Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-figure text-primary">
                  <Mail className="w-8 h-8" />
                </div>
                <div className="stat-title">Email</div>
                <div className="stat-value text-lg break-all">
                  {authUser.email}
                </div>
              </div>

              {/* User ID */}
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-figure text-primary gap-2 flex flex-row">
                  <button
                    className=" ml-2 text-primary/80 hover:text-primary-focus  cursor-pointer"
                    onClick={() => setIsHidden(!isHidden)}
                    aria-label="Toggle User ID visibility"
                  >
                    {isHidden ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  <User className="w-8 h-8" />
                </div>
                <div className="stat-title flex items-center gap-2">
                  User ID
                </div>
                <div className="pt-2 stat-value text-sm break-all w-[18rem]">
                  {isHidden ? "********************************" : authUser.id}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card-actions justify-end mt-6">
              <button
                className="btn btn-primary"
                onClick={() => setIsChangePasswordOpen(true)}
              >
                Change Password
              </button>
              <ChangePasswordPopup
                isOpen={isChangePasswordOpen} //value of clicked button
                onClose={() => setIsChangePasswordOpen(false)}
                onSubmit={handleChangePassword} //sending data to ChangePassword in authStore which will then send to backend
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
