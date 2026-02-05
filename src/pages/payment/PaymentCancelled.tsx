import { useNavigate } from "react-router-dom";
import { FaBan, FaRedo, FaHome } from "react-icons/fa";
import { useAppSelector } from "@/app/hooks";

const PaymentCancelled = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center">
          {/* Cancel Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-yellow-100 mb-6">
            <FaBan className="h-12 w-12 text-yellow-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-gray-600 mb-8">You have cancelled the payment process</p>

          {/* Info Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-700">
              No charges have been made to your account. You can try again whenever you're ready.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
            >
              <FaRedo className="inline mr-2" />
              Try Again
            </button>

            <button
              onClick={handleGoHome}
              className="w-full bg-white text-yellow-600 py-3 px-4 rounded-lg font-medium border-2 border-yellow-600 hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
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

export default PaymentCancelled;
