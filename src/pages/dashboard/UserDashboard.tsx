import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { useGetProfileQuery } from "@/api/authApi";
// import { useGetWalletBalanceQuery } from "@/api/walletApi";
// import { useGetTransactionsQuery } from "@/api/transactionApi";
import toast from "react-hot-toast";
import { FaWallet, FaExchangeAlt, FaArrowUp, FaArrowDown, FaHistory, FaUser, FaSignOutAlt } from "react-icons/fa";

const UserDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: profileData, isLoading: isLoadingProfile, refetch: refetchProfile } = useGetProfileQuery();
//   const { data: walletData, isLoading: isLoadingWallet } = useGetWalletBalanceQuery();
//   const { data: transactionsData, isLoading: isLoadingTransactions } = useGetTransactionsQuery({ limit: 5 });

  useEffect(() => {
    // Refresh profile on dashboard load
    refetchProfile();
  }, [refetchProfile]);

  const handleLogout = () => {
    // Will implement logout later
    toast.success("Logout functionality coming soon!");
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const userData = profileData?.data || user;
//   const walletBalance = walletData?.data?.balance || userData?.walletBalance || 0;
//   const recentTransactions = transactionsData?.data?.items || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary-600">Digital Wallet</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/user/dashboard"
                  className="border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/user/transactions"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Transactions
                </Link>
                <Link
                  to="/user/send-money"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Send Money
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaUser className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700 font-medium">{userData?.name}</span>
              </div>
              <Link
                to="/profile"
                className="px-3 py-2 rounded-md text-sm font-medium text-primary-600 hover:text-primary-800"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userData?.name}!</h1>
          <p className="text-gray-600 mt-2">Here's your wallet overview and quick actions.</p>
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Wallet Balance</h2>
              <p className="text-primary-100 mt-2">Available for transactions</p>
              {/* <p className="text-5xl font-bold mt-4">৳{walletBalance.toFixed(2)}</p> */}
            </div>
            <FaWallet className="h-20 w-20 opacity-20" />
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/user/send-money"
              className="bg-white text-primary-600 py-3 px-4 rounded-lg text-center font-semibold hover:bg-gray-100 transition-colors"
            >
              Send Money
            </Link>
            <Link
              to="/user/deposit"
              className="bg-white text-primary-600 py-3 px-4 rounded-lg text-center font-semibold hover:bg-gray-100 transition-colors"
            >
              Deposit
            </Link>
            <Link
              to="/user/withdraw"
              className="bg-white text-primary-600 py-3 px-4 rounded-lg text-center font-semibold hover:bg-gray-100 transition-colors"
            >
              Withdraw
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaArrowUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold text-gray-900">৳0.00</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaArrowDown className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Received</p>
                <p className="text-2xl font-bold text-gray-900">৳0.00</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaExchangeAlt className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
              <Link to="/user/transactions" className="flex items-center text-primary-600 hover:text-primary-800">
                <FaHistory className="mr-2" />
                View All
              </Link>
            </div>
          </div>

          {/* <div className="overflow-x-auto">
            {isLoadingTransactions ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : recentTransactions.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentTransactions.map((transaction: any) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.type === "send" || transaction.type === "withdraw"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {transaction.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span
                          className={
                            transaction.type === "send" || transaction.type === "withdraw"
                              ? "text-red-600"
                              : "text-green-600"
                          }
                        >
                          {transaction.type === "send" || transaction.type === "withdraw" ? "-" : "+"}৳
                          {transaction.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{transaction.description || "No description"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <FaHistory className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No transactions yet</p>
                <p className="text-gray-400 text-sm mt-2">Your transaction history will appear here</p>
              </div>
            )}
          </div> */}
        </div>

        {/* Account Information */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Account Type</p>
              <p className="font-medium capitalize">{userData?.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone Number</p>
              <p className="font-medium">{userData?.phone}</p>
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
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-medium">
                {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
