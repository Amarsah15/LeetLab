import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

const ChangePasswordPopup = ({ isOpen, onClose, onSubmit }) => {
  const {
   handleSubmit,
    register,
    reset,
  } = useForm();
  const navigate = useNavigate(); 
  const { authUser,logout} = useAuthStore();
  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
    logout();
    navigate("/login"); 
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-base-300 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-base-300">
          <h3 className="text-xl font-bold">Create New Password</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-4"
        >
          <div className="form-control">
            <label className="label">
              <h3 className="text-lg mb-5 ">Enter details</h3>
            </label>
            <input
              type="text"
              className="input input-bordered w-full "
              placeholder="Enter email"
              defaultValue={authUser.email}
              disabled
              {...register("email")}
            />
          </div>

          <div className="form-control">
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter old password"
              {...register("oldPassword")}
            />
          </div>

          <div className="form-control">
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter new password"
              {...register("newPassword")}
            />
          </div>
          <div className="form-control">
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Confirm password"
              {...register("confirmPassword")}
            />
          </div>
          <div className="flex justify-between gap-2 mt-7">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-outline"
            >
              Back
            </button>{" "}
            <div className="flex justify-end gap-2 ">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPopup;