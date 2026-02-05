import { useGetWalletBalanceQuery } from "@/api/walletApi";
import { FaWallet, FaExclamationTriangle } from "react-icons/fa";
import { Loader } from "@/components/ui/Loader";

const WalletBalance = () => {
  const { data, isLoading, error, refetch } = useGetWalletBalanceQuery();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center">
          <Loader size="medium" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <FaExclamationTriangle className="h-6 w-6 text-red-600 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-red-800">Error Loading Balance</h3>
            <p className="text-red-700 mt-1">Failed to load wallet balance</p>
            <button onClick={() => refetch()} className="mt-3 text-sm text-red-600 hover:text-red-800">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const wallet = data?.data;
  const isBlocked = wallet?.isBlocked;

  return (
    <div className={`rounded-lg shadow p-6 ${isBlocked ? "bg-red-50 border border-red-200" : "bg-white"}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Wallet Balance</h3>
          <p className="text-sm text-gray-500 mt-1">Available for transactions</p>

          <div className="mt-4">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">৳{wallet?.balance?.toFixed(2) || "0.00"}</span>
            </div>
          </div>
        </div>

        <div className={`p-3 rounded-full ${isBlocked ? "bg-red-100" : "bg-green-100"}`}>
          {isBlocked ? (
            <FaExclamationTriangle className="h-8 w-8 text-red-600" />
          ) : (
            <FaWallet className="h-8 w-8 text-green-600" />
          )}
        </div>
      </div>

      {isBlocked && (
        <div className="mt-4 p-3 bg-red-100 rounded-lg">
          <p className="text-sm text-red-800">
            <FaExclamationTriangle className="inline mr-2" />
            Your wallet is temporarily blocked. Please contact support.
          </p>
        </div>
      )}

      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-800"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default WalletBalance;
