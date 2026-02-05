import { FaArrowUp, FaArrowDown, FaExchangeAlt, FaMoneyBillWave, FaChartLine } from "react-icons/fa";

interface TransactionStatsProps {
  stats: {
    totalTransactions: number;
    totalAmount: number;
    totalDeposits: number;
    totalWithdrawals: number;
    totalFees: number;
    totalCommission?: number;
  };
}

const TransactionStats = ({ stats }: TransactionStatsProps) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* Total Transactions */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-lg">
            <FaChartLine className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
          </div>
        </div>
      </div>

      {/* Total Amount */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="bg-green-100 p-3 rounded-lg">
            <FaMoneyBillWave className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-gray-900">{formatAmount(stats.totalAmount)}</p>
          </div>
        </div>
      </div>

      {/* Total Deposits */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="bg-green-100 p-3 rounded-lg">
            <FaArrowDown className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Total Deposits</p>
            <p className="text-2xl font-bold text-green-600">{formatAmount(stats.totalDeposits)}</p>
          </div>
        </div>
      </div>

      {/* Total Withdrawals */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="bg-red-100 p-3 rounded-lg">
            <FaArrowUp className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Total Withdrawals</p>
            <p className="text-2xl font-bold text-red-600">{formatAmount(stats.totalWithdrawals)}</p>
          </div>
        </div>
      </div>

      {/* Total Fees/Commission */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="bg-yellow-100 p-3 rounded-lg">
            <FaExchangeAlt className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-600">Total Fees</p>
            <p className="text-2xl font-bold text-yellow-600">{formatAmount(stats.totalFees)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStats;
