import { useState } from "react";
import { useGetAllTransactionsQuery } from "@/api/transactionApi";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import { FaUsers, FaChartBar } from "react-icons/fa";

const AdminTransactions = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const limit = 20;

  const {
    data: transactionsData,
    isLoading,
    refetch,
  } = useGetAllTransactionsQuery({
    page,
    limit,
    ...filters,
  });

  const transactions = transactionsData?.data?.transactions || [];
  const pagination = transactionsData?.data?.pagination || {
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center">
          <FaChartBar className="h-8 w-8 text-primary-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Transactions</h1>
            <p className="text-gray-600 mt-2">Monitor all system transactions</p>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Total Transactions</p>
              <p className="text-3xl font-bold mt-2">{pagination.total}</p>
            </div>
            <FaChartBar className="h-10 w-10 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">This Page</p>
              <p className="text-3xl font-bold mt-2">{transactions.length}</p>
            </div>
            <FaUsers className="h-10 w-10 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Total Pages</p>
              <p className="text-3xl font-bold mt-2">{pagination.pages}</p>
            </div>
            <div className="h-10 w-10 opacity-20 bg-white rounded-full"></div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Page Size</p>
              <p className="text-3xl font-bold mt-2">{limit}</p>
            </div>
            <div className="h-10 w-10 opacity-20 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <TransactionFilters onFilterChange={handleFilterChange} />

      {/* Transaction List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">All System Transactions</h2>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-800"
          >
            Refresh
          </button>
        </div>

        <TransactionList
          transactions={transactions}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default AdminTransactions;
