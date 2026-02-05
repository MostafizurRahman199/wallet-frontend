import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaWallet, FaReceipt } from "react-icons/fa";
import { useAppSelector } from "@/app/hooks";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAppSelector((state) => state.auth);

  const transactionId = searchParams.get("transactionId");
  const amount = searchParams.get("amount");
  const status = searchParams.get("status");
  const message = searchParams.get("message");

  useEffect(() => {
    // Optional: You can verify the payment with backend here
    // useVerifyPaymentMutation({ transactionId });
  }, [transactionId]);

  const handleGoToDashboard = () => {
    if (user) {
      navigate(`/${user.role}/dashboard`);
    } else {
      navigate("/login");
    }
  };

  const handleViewTransactions = () => {
    if (user) {
      navigate(`/${user.role}/transactions`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <FaCheckCircle className="h-12 w-12 text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">{message || "Your payment has been processed successfully"}</p>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <span className="text-gray-600">Amount Paid</span>
                <span className="text-2xl font-bold text-green-600">৳{amount}</span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <span className="text-gray-600">Transaction ID</span>
                <span className="text-sm font-mono text-gray-900">{transactionId}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <FaWallet className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-left">
                <h3 className="text-sm font-medium text-green-800">Wallet Updated</h3>
                <p className="text-sm text-green-700 mt-1">
                  ৳{amount} has been successfully added to your wallet balance.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoToDashboard}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <FaWallet className="inline mr-2" />
              Go to Dashboard
            </button>

            <button
              onClick={handleViewTransactions}
              className="w-full bg-white text-green-600 py-3 px-4 rounded-lg font-medium border-2 border-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <FaReceipt className="inline mr-2" />
              View Transactions
            </button>
          </div>

          {/* Additional Info */}
          <p className="text-xs text-gray-500 mt-6">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
