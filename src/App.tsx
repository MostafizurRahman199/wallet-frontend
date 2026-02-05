import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAppSelector } from "./app/hooks";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/dashboard/Profile";
import UserDashboard from "./pages/dashboard/UserDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={isAuthenticated ? <Navigate to={`/${user?.role}/dashboard`} /> : <Login />} />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to={`/${user?.role}/dashboard`} /> : <Register />}
          />

          {/* Protected Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to={`/${user?.role}/dashboard`} /> : <Navigate to="/login" />}
          />

          {/* Catch all route */}
          <Route
            path="*"
            element={isAuthenticated ? <Navigate to={`/${user?.role}/dashboard`} /> : <Navigate to="/login" />}
          />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              style: {
                background: "#10b981",
              },
            },
            error: {
              duration: 4000,
              style: {
                background: "#ef4444",
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
