import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetAdminDashboardStatsQuery } from "@/api/adminApi";

import {
  FaUsers,
  FaUserTie,
  FaWallet,
  FaExchangeAlt,
  FaChartLine,
  FaUserClock,
  FaCheckCircle,
  FaBan,
} from "react-icons/fa";
import { debugApiResponse } from "@/utils/debugHelper";
import { transformDashboardStats } from "@/utils/dataTransformers";

const AdminDashboard = () => {
  const { data: apiResponse, isLoading, error, refetch } = useGetAdminDashboardStatsQuery(undefined);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAgents: 0,
    totalWallets: 0,
    totalTransactions: 0,
    pendingAgents: 0,
    approvedAgents: 0,
    blockedUsers: 0,
    totalBalance: 0,
    transactionVolume: 0,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Transform API data when it's received
  useEffect(() => {
    if (apiResponse) {
      // Debug the API response
      debugApiResponse(apiResponse, "Admin Dashboard API");

      // Transform the data
      const transformedStats = transformDashboardStats(apiResponse);
      console.log("Transformed Stats:", transformedStats);

      setStats(transformedStats);
    }
  }, [apiResponse]);

  // Show error if API fails
  useEffect(() => {
    if (error) {
      console.error("Admin Dashboard API Error:", error);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Display API error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-700 mb-2">Failed to Load Dashboard</h2>
            <p className="text-red-600">Please check your connection and try again.</p>
            <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage users, agents, and monitor platform activity</p>

          {/* Backend Compatibility Note - Can be removed later */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Note: Some statistics show 0 because the backend API doesn't currently provide these values. The available
              statistics are: Total Users ({stats.totalUsers}), Total Agents ({stats.totalAgents}), Total Transactions (
              {stats.totalTransactions}), and Total Balance (৳{stats.totalBalance.toFixed(2)}).
            </p>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          {/* Total Agents */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaUserTie className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Agents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAgents}</p>
              </div>
            </div>
          </div>

          {/* Active Wallets */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaWallet className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Wallets</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalWallets}</p>
              </div>
            </div>
          </div>

          {/* Total Transactions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FaExchangeAlt className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Status Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FaUserClock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending Agents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingAgents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaCheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Approved Agents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approvedAgents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-lg">
                <FaBan className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Blocked Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.blockedUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Total Platform Balance</h3>
            <p className="text-4xl font-bold">৳{stats.totalBalance.toFixed(2)}</p>
            <p className="text-green-100 mt-2">Across all wallets</p>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Transaction Volume</h3>
            <p className="text-4xl font-bold">৳{stats.transactionVolume.toFixed(2)}</p>
            <p className="text-blue-100 mt-2">Total processed</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/users"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaUsers className="h-6 w-6 text-blue-600 mr-3" />
              <span className="font-medium text-gray-900">Manage Users</span>
            </Link>

            <Link
              to="/admin/agents"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaUserTie className="h-6 w-6 text-purple-600 mr-3" />
              <span className="font-medium text-gray-900">Manage Agents</span>
            </Link>

            <Link
              to="/admin/wallets"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaWallet className="h-6 w-6 text-green-600 mr-3" />
              <span className="font-medium text-gray-900">Manage Wallets</span>
            </Link>

            <Link
              to="/admin/transactions"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaExchangeAlt className="h-6 w-6 text-yellow-600 mr-3" />
              <span className="font-medium text-gray-900">View Transactions</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-gray-500">
            <FaChartLine className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Activity monitoring coming soon</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
