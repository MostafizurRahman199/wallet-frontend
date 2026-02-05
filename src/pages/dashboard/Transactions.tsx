import { useState, useEffect } from "react";
import { useAppSelector } from "@/app/hooks";
import { useGetMyTransactionsQuery, useGetMyCommissionsQuery } from "@/api/transactionApi";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionStats from "@/components/transactions/TransactionStats";
import { FaHistory, FaMoneyBillWave } from "react-icons/fa";

const Transactions = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<"transactions" | "commissions">("transactions");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const limit = 10;

  // Fetch transactions
  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = useGetMyTransactionsQuery({
    page,
    limit,
    ...filters,
  });

  // Fetch commissions (for agents)
  const {
    data: commissionsData,
    isLoading: isLoadingCommissions,
    refetch: refetchCommissions,
  } = useGetMyCommissionsQuery(
    { page, limit, ...filters },
    { skip: user?.role !== "agent" || activeTab !== "commissions" },
  );

  const currentData = activeTab === "transactions" ? transactionsData : commissionsData;
  const isLoading = activeTab === "transactions" ? isLoadingTransactions : isLoadingCommissions;

  const transactions = currentData?.data?.transactions || currentData?.data?.commissions || [];
  const pagination = currentData?.data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  };

  // Calculate stats
  const calculateStats = () => {
    if (!transactions.length) {
      return {
        totalTransactions: 0,
        totalAmount: 0,
        totalDeposits: 0,
        totalWithdrawals: 0,
        totalFees: 0,
        totalCommission: 0,
      };
    }

    const stats = transactions.reduce(
      (acc: any, transaction: any) => {
        acc.totalTransactions++;
        acc.totalAmount += transaction.amount;
        acc.totalFees += transaction.fee || 0;

        if (transaction.type === "DEPOSIT" || transaction.type === "CASH_IN") {
          acc.totalDeposits += transaction.amount;
        } else if (transaction.type === "WITHDRAW" || transaction.type === "CASH_OUT") {
          acc.totalWithdrawals += transaction.amount;
        }

        if (transaction.commission) {
          acc.totalCommission += transaction.commission;
        }

        return acc;
      },
      {
        totalTransactions: 0,
        totalAmount: 0,
        totalDeposits: 0,
        totalWithdrawals: 0,
        totalFees: 0,
        totalCommission: 0,
      },
    );

    return stats;
  };

  const stats = calculateStats();

  useEffect(() => {
    if (activeTab === "transactions") {
      refetchTransactions();
    } else if (activeTab === "commissions" && user?.role === "agent") {
      refetchCommissions();
    }
  }, [page, filters, activeTab, refetchTransactions, refetchCommissions, user?.role]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
        <p className="text-gray-600 mt-2">View and manage your transaction history</p>
      </div>

      {/* Stats */}
      <TransactionStats stats={stats} />

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => {
                setActiveTab("transactions");
                setPage(1);
              }}
              className={`flex items-center py-4 px-6 font-medium text-sm ${
                activeTab === "transactions"
                  ? "border-b-2 border-primary-500 text-primary-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FaHistory className="mr-2" />
              All Transactions
            </button>

            {user?.role === "agent" && (
              <button
                onClick={() => {
                  setActiveTab("commissions");
                  setPage(1);
                }}
                className={`flex items-center py-4 px-6 font-medium text-sm ${
                  activeTab === "commissions"
                    ? "border-b-2 border-primary-500 text-primary-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FaMoneyBillWave className="mr-2" />
                Commission History
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Filters */}
      <TransactionFilters onFilterChange={handleFilterChange} />

      {/* Transaction List */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {activeTab === "transactions" ? "Recent Transactions" : "Commission History"}
          </h2>
          <div className="text-sm text-gray-500">
            Showing {transactions.length} of {pagination.total} records
          </div>
        </div>

        <TransactionList
          transactions={transactions}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={setPage}
        />
      </div>

      {/* Export and Actions */}
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Page {pagination.page} of {pagination.pages} • {pagination.total} total records
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Export as CSV
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Print Statement
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
