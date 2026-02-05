import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { Loader } from "@/components/ui/Loader";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);
  const [redirectPath, setRedirectPath] = useState<string>("/login");

  useEffect(() => {
    // If authenticated but user data is loading, wait
    if (isAuthenticated && !user && !isLoading) {
      // Token exists but user data failed to load - clear invalid token
      localStorage.removeItem("token");
      setRedirectPath("/login");
    }
  }, [isAuthenticated, user, isLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="large" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
