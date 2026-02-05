import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } from "@/api/authApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { updateUser } from "@/features/auth/authSlice";
import { updateProfileSchema, changePasswordSchema } from "@/utils/validation";
import toast from "react-hot-toast";
import { Loader } from "@/components/ui/Loader";

const Profile = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { data: profileData, isLoading: isLoadingProfile, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  const profileFormik = useFormik({
    initialValues: {
      name: user?.name || "",
      phone: user?.phone || "",
    },
    validationSchema: updateProfileSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const result = await updateProfile(values).unwrap();

        if (result.success && result.data) {
          // Update user in Redux store
          dispatch(updateUser(result.data));
          toast.success("Profile updated successfully!");
          await refetch(); // Refresh profile data
        }
      } catch (error: any) {
        toast.error(error.data?.message || "Failed to update profile");
      }
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: changePasswordSchema,
    onSubmit: async (values) => {
      try {
        const { confirmNewPassword, ...passwordData } = values;
        const result = await changePassword(passwordData).unwrap();

        if (result.success) {
          toast.success("Password changed successfully!");
          passwordFormik.resetForm();
        }
      } catch (error: any) {
        toast.error(error.data?.message || "Failed to change password");
      }
    },
  });

  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="large" />
      </div>
    );
  }

  const userData = profileData?.data || user;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-primary-100">Manage your account information and security</p>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === "profile"
                    ? "border-b-2 border-primary-500 text-primary-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`py-2 px-4 font-medium text-sm ${
                  activeTab === "password"
                    ? "border-b-2 border-primary-500 text-primary-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Change Password
              </button>
            </nav>
          </div>

          {/* Profile Information Tab */}
          {activeTab === "profile" && (
            <div>
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Account Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Account Type</p>
                    <p className="font-medium capitalize">{userData?.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Wallet Balance</p>
                    <p className="font-medium text-green-600">৳{userData?.walletBalance?.toFixed(2) || "0.00"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Status</p>
                    <p className="font-medium">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          userData?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {userData?.isActive ? "Active" : "Blocked"}
                      </span>
                    </p>
                  </div>
                  {userData?.role === "agent" && (
                    <div>
                      <p className="text-sm text-gray-600">Agent Status</p>
                      <p className="font-medium">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            userData?.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {userData?.isApproved ? "Approved" : "Pending Approval"}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={profileFormik.handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileFormik.values.name}
                      onChange={profileFormik.handleChange}
                      onBlur={profileFormik.handleBlur}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    {profileFormik.touched.name && profileFormik.errors.name && (
                      <p className="mt-1 text-sm text-red-600">{profileFormik.errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profileFormik.values.phone}
                      onChange={profileFormik.handleChange}
                      onBlur={profileFormik.handleBlur}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    {profileFormik.touched.phone && profileFormik.errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{profileFormik.errors.phone}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdating || !profileFormik.dirty}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? <Loader size="small" /> : "Update Profile"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Change Password Tab */}
          {activeTab === "password" && (
            <form onSubmit={passwordFormik.handleSubmit} className="space-y-6 max-w-md">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordFormik.values.currentPassword}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                {passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordFormik.errors.currentPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordFormik.values.newPassword}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordFormik.errors.newPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={passwordFormik.values.confirmNewPassword}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                {passwordFormik.touched.confirmNewPassword && passwordFormik.errors.confirmNewPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordFormik.errors.confirmNewPassword}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isChangingPassword || !passwordFormik.dirty}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChangingPassword ? <Loader size="small" /> : "Change Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
