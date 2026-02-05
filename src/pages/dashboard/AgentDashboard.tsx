import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { useGetProfileQuery } from "@/features/auth/authApi";
import { useGetWalletBalanceQuery } from "@/api/walletApi";
import { useGetMyTransactionsQuery, useGetMyCommissionsQuery } from "@/api/transactionApi";
import {
  FaWallet,
  FaExchangeAlt,
  FaMoneyBillWave,
  FaHistory,
  FaUserFriends,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const { data: profileData, isLoading: isLoadingProfile, refetch: refetchProfile } = useGetProfileQuery(undefined);
  const { data: walletData, isLoading: isLoadingWallet } = useGetWalletBalanceQuery();
  const { data: transactionsData, isLoading: isLoadingTransactions } = useGetMyTransactionsQuery({
    page: 1,
    limit: 5,
  });
  const { data: commissionsData, isLoading: isLoadingCommissions } = useGetMyCommissionsQuery({
    page: 1,
    limit: 5,
  });

  useEffect(() => {
    refetchProfile();
  }, [refetchProfile]);

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const userData = profileData?.data || user;
  const walletBalance = walletData?.data?.balance || userData?.walletBalance || 0;
  const recentTransactions = transactionsData?.data?.transactions || [];
  const commissions = commissionsData?.data?.commissions || [];

  // Calculate commission stats
  const totalCommission = commissions.reduce((sum, commission) => sum + (commission.commission || 0), 0);
  const todayCommission = commissions
    .filter((c) => new Date(c.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, commission) => sum + (commission.commission || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, Agent {userData?.name}!</h1>
          <p className="text-gray-600 mt-2">Manage cash-in transactions and track your commissions</p>
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Agent Wallet Balance</h2>
              <p className="text-purple-100 mt-2">Available for transactions</p>
              <p className="text-5xl font-bold mt-4">
                {isLoadingWallet ? <span className="animate-pulse">Loading...</span> : `৳${walletBalance.toFixed(2)}`}
              </p>
            </div>
            <FaWallet className="h-20 w-20 opacity-20" />
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/agent/wallet"
              className="bg-white text-purple-600 py-3 px-4 rounded-lg text-center font-semibold hover:bg-gray-100 transition-colors"
            >
              <FaUserFriends className="inline mr-2" />
              Cash In Service
            </Link>
            <Link
              to="/agent/transactions"
              className="bg-white text-purple-600 py-3 px-4 rounded-lg text-center font-semibold hover:bg-gray-100 transition-colors"
            >
              <FaHistory className="inline mr-2" />
              View Commissions
            </Link>
          </div>
        </div>

        {/* Commission Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaMoneyBillWave className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Commission</p>
                <p className="text-2xl font-bold text-gray-900">৳{totalCommission.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaChartLine className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Today's Commission</p>
                <p className="text-2xl font-bold text-gray-900">৳{todayCommission.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaExchangeAlt className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{commissions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Commissions */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Recent Commissions</h2>
              <Link to="/agent/transactions" className="flex items-center text-primary-600 hover:text-primary-800">
                <FaHistory className="mr-2" />
                View All
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoadingCommissions ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : commissions.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commission
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {commissions.map((commission: any) => (
                    <tr key={commission._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(commission.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {commission.from?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ৳{commission.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                        +৳{(commission.commission || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <FaMoneyBillWave className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No commissions yet</p>
                <p className="text-gray-400 text-sm mt-2">Start providing cash-in services to earn commissions</p>
              </div>
            )}
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Agent ID</p>
              <p className="font-medium text-gray-900">{userData?.id || userData?._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone Number</p>
              <p className="font-medium text-gray-900">{userData?.mobileNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Account Status</p>
              <p className="font-medium">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    userData?.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {userData?.status}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-medium text-gray-900">
                {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentDashboard;
