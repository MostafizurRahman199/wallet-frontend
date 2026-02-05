import { useState } from "react";
import { useGetPaymentHistoryQuery } from "@/api/paymentApi";
import { PAYMENT_STATUS } from "@/types";
import { FaHistory, FaCheckCircle, FaTimesCircle, FaClock, FaBan } from "react-icons/fa";

const PaymentHistory = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useGetPaymentHistoryQuery({ page, limit });

  const payments = data?.data?.payments || [];
  const pagination = data?.data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  };

  const getStatusIcon = (status: PAYMENT_STATUS) => {
    switch (status) {
      case PAYMENT_STATUS.PAID:
        return <FaCheckCircle className="text-green-600" />;
      case PAYMENT_STATUS.FAILED:
        return <FaTimesCircle className="text-red-600" />;
      case PAYMENT_STATUS.PENDING:
        return <FaClock className="text-yellow-600" />;
      case PAYMENT_STATUS.CANCELLED:
        return <FaBan className="text-gray-600" />;
      default:
        return <FaHistory className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: PAYMENT_STATUS) => {
    switch (status) {
      case PAYMENT_STATUS.PAID:
        return "text-green-800 bg-green-100";
      case PAYMENT_STATUS.FAILED:
        return "text-red-800 bg-red-100";
      case PAYMENT_STATUS.PENDING:
        return "text-yellow-800 bg-yellow-100";
      case PAYMENT_STATUS.CANCELLED:
        return "text-gray-800 bg-gray-100";
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Failed to load payment history</div>;
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <FaHistory className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No payment history found</p>
        <p className="text-gray-400 text-sm mt-2">Your payment history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div key={payment._id} className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-gray-100">{getStatusIcon(payment.status)}</div>
              <div>
                <h3 className="font-medium text-gray-900">Payment #{payment.transactionId}</h3>
                <p className="text-sm text-gray-500">{formatDate(payment.createdAt)}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Amount: <span className="font-semibold">৳{payment.amount.toFixed(2)}</span>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
              >
                {payment.status}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Transaction ID:</p>
                <p className="font-mono text-gray-900 text-xs">{payment.transactionId}</p>
              </div>
              <div>
                <p className="text-gray-600">Payment ID:</p>
                <p className="font-mono text-gray-900 text-xs">{payment._id.slice(-8)}</p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => setPage(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm text-gray-700">
            Page {pagination.page} of {pagination.pages}
          </span>

          <button
            onClick={() => setPage(pagination.page + 1)}
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

export default PaymentHistory;
