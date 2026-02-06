import { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/api/authApi";
import { useAppDispatch } from "@/app/hooks";
import { setCredentials } from "@/features/auth/authSlice";
import { loginSchema } from "@/utils/validation";
import toast from "react-hot-toast";
import { Loader } from "@/components/ui/Loader";
import { Eye, EyeOff, Smartphone, Lock, LogIn, Sparkles, Fingerprint, ShieldCheck, SmartphoneIcon } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formik = useFormik({
    initialValues: {
      phone: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const result = await login(values).unwrap();

        if (result.success && result.data) {
          dispatch(
            setCredentials({
              user: result.data.user,
              token: result.data.token,
            }),
          );

          toast.success("Welcome back! Login successful!", {
            icon: "🎉",
            style: {
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            },
          });

          // Add a slight delay for smooth transition
          setTimeout(() => {
            if (result.data.user.role === "admin") {
              navigate("/admin/dashboard");
            } else if (result.data.user.role === "agent") {
              navigate("/agent/dashboard");
            } else {
              navigate("/user/dashboard");
            }
          }, 300);
        }
      } catch (error: any) {
        toast.error(error.data?.message || "Login failed. Please check your credentials.", {
          icon: "🔐",
        });
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header with glass effect */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl shadow-purple-100/50 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-500 rounded-2xl mb-4 shadow-lg">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <Sparkles className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-slate-600 mt-2">Sign in to continue your journey</p>
          </div>

          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {/* Phone Input with modern styling */}
            <div className="group">
              <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <SmartphoneIcon className="w-4 h-4" />
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Smartphone className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="block w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 text-slate-800 shadow-sm hover:border-purple-300"
                  placeholder="Enter your phone number"
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

            {/* Password Input with modern styling */}
            <div className="group">
              <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="block w-full pl-10 pr-12 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-slate-400 text-slate-800 shadow-sm hover:border-purple-300"
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-slate-400 hover:text-purple-500 transition-colors" />
                  ) : (
                    <Eye className="w-5 h-5 text-slate-400 hover:text-purple-500 transition-colors" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" className="sr-only" id="remember-me" />
                  <div className="w-5 h-5 border-2 border-slate-300 rounded-md group-hover:border-purple-400 transition-colors flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-purple-600 opacity-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="ml-2 text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-purple-600 hover:text-purple-500 transition-colors hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader size="small" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                    {isHovered && <Fingerprint className="w-4 h-4 animate-pulse" />}
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-purple-600 hover:text-purple-500 transition-colors group"
              >
                <span className="group-hover:underline">Create account</span>
                <span className="ml-1">→</span>
              </Link>
            </p>
          </div>

          {/* Quick demo credentials */}
          {/* <div className="mt-6 p-4 bg-slate-50/50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500 text-center">💡 Demo: Try 01712345678 / password123</p>
          </div> */}
        </div>

        {/* Security footer */}
        <div className="text-center">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
            <ShieldCheck className="w-3 h-3" />
            Your data is securely encrypted
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
