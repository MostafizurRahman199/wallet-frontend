import { useNavigate, useSearchParams } from "react-router-dom";
import { FaTimesCircle, FaRedo, FaHome } from "react-icons/fa";
import { useAppSelector } from "@/app/hooks";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAppSelector((state) => state.auth);

  const message = searchParams.get("message") || "Payment failed";
  const transactionId = searchParams.get("transactionId");

  const handleRetry = () => {
    if (user) {
      navigate(`/${user.role}/wallet`);
    } else {
      navigate("/login");
    }
  };

  const handleGoHome = () => {
    if (user) {
      navigate(`/${user.role}/dashboard`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
            <FaTimesCircle className="h-12 w-12 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-8">{message}</p>

          {/* Error Details */}
          {transactionId && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transaction ID</span>
                <span className="text-sm font-mono text-gray-900">{transactionId}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">
              Your payment could not be processed. Please try again or contact support if the problem persists.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <FaRedo className="inline mr-2" />
              Try Again
            </button>

            <button
              onClick={handleGoHome}
              className="w-full bg-white text-red-600 py-3 px-4 rounded-lg font-medium border-2 border-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <FaHome className="inline mr-2" />
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
