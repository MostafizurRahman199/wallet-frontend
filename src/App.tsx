import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentToken, selectIsAuthenticated } from "./features/auth/authSlice";

import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentFailed from "./pages/payment/PaymentFailed";
import PaymentCancelled from "./pages/payment/PaymentCancelled";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Public Pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Features from "./pages/public/Features";
import Contact from "./pages/public/Contact";
import FAQ from "./pages/public/FAQ";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard Pages
import UserDashboard from "./pages/dashboard/UserDashboard";
import AgentDashboard from "./pages/dashboard/AgentDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Profile from "./pages/dashboard/Profile";
import WalletPage from "./pages/dashboard/Wallet";
import Transactions from "./pages/dashboard/Transactions";
import AdminTransactions from "./pages/dashboard/AdminTransactions";

// Protected Route Component
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAgents from "./pages/admin/AdminAgents";
import AdminWallets from "./pages/admin/AdminWallets";
import AdminSettings from "./pages/admin/AdminSettings";

function App() {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Public Routes with Layout */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout>
                <About />
              </PublicLayout>
            }
          />
          <Route
            path="/features"
            element={
              <PublicLayout>
                <Features />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout>
                <Contact />
              </PublicLayout>
            }
          />
          <Route
            path="/faq"
            element={
              <PublicLayout>
                <FAQ />
              </PublicLayout>
            }
          />

          {/* Payment Routes (public - no authentication required) */}
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentFailed />} />
          <Route path="/payment/cancelled" element={<PaymentCancelled />} />

          {/* Auth Routes (without layout) */}
          <Route
            path="/login"
            element={isAuthenticated && user ? <Navigate to={`/${user.role}/dashboard`} /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated && user ? <Navigate to={`/${user.role}/dashboard`} /> : <Register />}
          />

          {/* Protected Dashboard Routes */}
          {/* User Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <DashboardLayout role="user">
                  <UserDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/wallet"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <DashboardLayout role="user">
                  <WalletPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/transactions"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <DashboardLayout role="user">
                  <Transactions />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Agent Routes */}
          <Route
            path="/agent/dashboard"
            element={
              <ProtectedRoute allowedRoles={["agent"]}>
                <DashboardLayout role="agent">
                  <AgentDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/agent/wallet"
            element={
              <ProtectedRoute allowedRoles={["agent"]}>
                <DashboardLayout role="agent">
                  <WalletPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/agent/transactions"
            element={
              <ProtectedRoute allowedRoles={["agent"]}>
                <DashboardLayout role="agent">
                  <Transactions />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout role="admin">
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/transactions"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout role="admin">
                  <AdminTransactions />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout role="admin">
                  <AdminUsers /> {/* Create this component */}
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/agents"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout role="admin">
                  <AdminAgents /> {/* Create this component */}
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/wallets"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout role="admin">
                  <AdminWallets /> {/* Create this component */}
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout role="admin">
                  <AdminSettings /> {/* Create this component */}
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Common Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <DashboardLayout role={user?.role || "user"}>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Universal Routes (for easy access) */}
          <Route
            path="/wallet"
            element={
              <ProtectedRoute allowedRoles={["user", "agent"]}>
                <DashboardLayout role={user?.role || "user"}>
                  <WalletPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute allowedRoles={["user", "agent"]}>
                <DashboardLayout role={user?.role || "user"}>
                  <Transactions />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirects */}
          <Route
            path="/dashboard"
            element={<Navigate to={isAuthenticated && user ? `/${user.role}/dashboard` : "/login"} />}
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to={isAuthenticated && user ? `/${user.role}/dashboard` : "/"} />} />
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
