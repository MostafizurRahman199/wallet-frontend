import { useState } from "react";
import { Transaction, TransactionType, TransactionStatus } from "@/types";
import { FaArrowUp, FaArrowDown, FaExchangeAlt, FaUserFriends, FaMoneyBillWave, FaHistory } from "react-icons/fa";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  onPageChange: (page: number) => void;
}

const TransactionList = ({ transactions, isLoading, pagination, onPageChange }: TransactionListProps) => {
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case "DEPOSIT":
      case "CASH_IN":
        return <FaArrowDown className="text-green-600" />;
      case "WITHDRAW":
      case "CASH_OUT":
        return <FaArrowUp className="text-red-600" />;
      case "SEND_MONEY":
        return <FaExchangeAlt className="text-blue-600" />;
      case "COMMISSION":
        return <FaMoneyBillWave className="text-yellow-600" />;
      default:
        return <FaHistory className="text-gray-600" />;
    }
  };

  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case "DEPOSIT":
      case "CASH_IN":
        return "text-green-700 bg-green-100";
      case "WITHDRAW":
      case "CASH_OUT":
        return "text-red-700 bg-red-100";
      case "SEND_MONEY":
        return "text-blue-700 bg-blue-100";
      case "COMMISSION":
        return "text-yellow-700 bg-yellow-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-800 bg-green-100";
      case "PENDING":
        return "text-yellow-800 bg-yellow-100";
      case "FAILED":
        return "text-red-800 bg-red-100";
      case "REVERSED":
        return "text-purple-800 bg-purple-100";
      default:
        return "text-gray-800 bg-gray-100";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <FaHistory className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No transactions found</p>
        <p className="text-gray-400 text-sm mt-2">Your transaction history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction._id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          {/* Transaction Header */}
          <div
            className="p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => setExpandedTransaction(expandedTransaction === transaction._id ? null : transaction._id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getTransactionColor(transaction.type)}`}>
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{transaction.type.replace("_", " ")}</h3>
                  <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`text-lg font-semibold ${
                    transaction.type === "DEPOSIT" ||
                    transaction.type === "CASH_IN" ||
                    transaction.type === "COMMISSION"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "DEPOSIT" || transaction.type === "CASH_IN" || transaction.type === "COMMISSION"
                    ? "+"
                    : "-"}
                  {formatAmount(transaction.amount)}
                </p>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                >
                  {transaction.status}
                </span>
              </div>
            </div>
          </div>

          {/* Expanded Details */}
          {expandedTransaction === transaction._id && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Transaction Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono text-gray-900">{transaction._id.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{transaction.type.replace("_", " ")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Description:</span>
                      <span className="text-gray-900">{transaction.description || "No description"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Amount Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">{formatAmount(transaction.amount)}</span>
                    </div>
                    {transaction.fee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fee:</span>
                        <span className="text-red-600">-{formatAmount(transaction.fee)}</span>
                      </div>
                    )}
                    {transaction.commission && transaction.commission > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Commission:</span>
                        <span className="text-yellow-600">+{formatAmount(transaction.commission)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-300 pt-2">
                      <span className="font-medium text-gray-700">Balance After:</span>
                      <span className="font-bold">{formatAmount(transaction.balanceAfter)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Parties Involved</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">From:</span>
                      <span className="text-gray-900">
                        {transaction.from.name} ({transaction.from.phone})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">To:</span>
                      <span className="text-gray-900">
                        {transaction.to.name} ({transaction.to.phone})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Initiated By:</span>
                      <span className="text-gray-900">{transaction.initiatedBy.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm text-gray-700">
            Page {pagination.page} of {pagination.pages}
          </span>

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
