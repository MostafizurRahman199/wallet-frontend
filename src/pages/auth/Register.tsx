import { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/api/authApi";
import { useAppDispatch } from "@/app/hooks";
import { setCredentials } from "@/features/auth/authSlice";
import { registerSchema } from "@/utils/validation";
import toast from "react-hot-toast";
import { Loader } from "@/components/ui/Loader";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "user" as "user" | "agent",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        const { confirmPassword, ...registerData } = values;
        const result = await register(registerData).unwrap();

        if (result.success && result.data) {
          toast.success("🎉 Registration successful! Please login with your credentials.", {
            style: {
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            },
          });

          navigate("/login", {
            state: {
              phone: values.phone,
              message: "Registration successful! Please login.",
            },
          });
        }
      } catch (error: any) {
        toast.error(error.data?.message || "Registration failed. Please try again.", {
          icon: "❌",
        });
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header with glass effect */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl shadow-purple-100/50 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-500 rounded-2xl mb-4 shadow-lg">
              <span className="text-white text-2xl">👤</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
              Join Our Community
            </h2>
            <p className="text-slate-600 mt-2">Create your account in minutes</p>
            <p className="text-sm text-slate-500 mt-1">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-purple-600 hover:text-purple-500 transition-colors hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {/* Name Input */}
            <div className="group">
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <span className="text-slate-600">👤</span>
                Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="block w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 text-slate-800 shadow-sm hover:border-blue-300"
                  placeholder="Enter your full name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {formik.errors.name}
                </p>
              )}
            </div>

            {/* Phone Input */}
            <div className="group">
              <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <span className="text-slate-600">📱</span>
                Phone Number
              </label>
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="block w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 text-slate-800 shadow-sm hover:border-blue-300"
                  placeholder="e.g., 01712345678"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.phone && formik.errors.phone && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {formik.errors.phone}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="group">
              <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <span className="text-slate-600">🔑</span>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="block w-full px-4 pr-12 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 text-slate-800 shadow-sm hover:border-blue-300"
                  placeholder="Create a strong password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="text-slate-400 hover:text-blue-500 transition-colors">
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </span>
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {formik.errors.password}
                </p>
              )}
              <p className="text-xs text-slate-500 mt-1">Minimum 6 characters with letters and numbers</p>
            </div>

            {/* Confirm Password Input */}
            <div className="group">
              <label
                htmlFor="confirmPassword"
                className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2"
              >
                <span className="text-slate-600">✅</span>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="block w-full px-4 pr-12 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 text-slate-800 shadow-sm hover:border-blue-300"
                  placeholder="Re-enter your password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span className="text-slate-400 hover:text-blue-500 transition-colors">
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </span>
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {formik.errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div className="group">
              <label className="block text-sm font-medium text-slate-700 mb-3">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`
                  relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
                  ${
                    formik.values.role === "user"
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-slate-200 hover:border-blue-300 hover:bg-slate-50/50"
                  }
                `}
                >
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formik.values.role === "user"}
                    onChange={formik.handleChange}
                    className="sr-only"
                  />
                  <span className="text-2xl mb-2">👤</span>
                  <span className="font-medium text-slate-800">User</span>
                  <span className="text-xs text-slate-500 text-center mt-1">Personal Account</span>
                  {formik.values.role === "user" && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </label>

                <label
                  className={`
                  relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
                  ${
                    formik.values.role === "agent"
                      ? "border-purple-500 bg-purple-50/50"
                      : "border-slate-200 hover:border-purple-300 hover:bg-slate-50/50"
                  }
                `}
                >
                  <input
                    type="radio"
                    name="role"
                    value="agent"
                    checked={formik.values.role === "agent"}
                    onChange={formik.handleChange}
                    className="sr-only"
                  />
                  <span className="text-2xl mb-2">💼</span>
                  <span className="font-medium text-slate-800">Agent</span>
                  <span className="text-xs text-slate-500 text-center mt-1">Business Account</span>
                  {formik.values.role === "agent" && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </label>
              </div>
              {formik.touched.role && formik.errors.role && (
                <p className="mt-2 text-sm text-red-500">{formik.errors.role}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-slate-700">
                  I agree to the{" "}
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader size="small" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    <span>Create Account</span>
                    {isHovered && <span className="animate-pulse">✨</span>}
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Agent Note */}
          {formik.values.role === "agent" && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
              <div className="flex items-start gap-3">
                <span className="text-purple-600 mt-0.5">💼</span>
                <div>
                  <p className="text-sm font-medium text-purple-900">Agent Account Information</p>
                  <p className="text-xs text-purple-700 mt-1">
                    Your agent account requires admin approval before you can process transactions. You'll be notified
                    via SMS once approved.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security footer */}
        <div className="text-center">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
            <span>🔒</span>
            End-to-end encrypted • Your data is secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
