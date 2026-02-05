import { Link } from "react-router-dom";
import { FaBan, FaHome, FaWallet } from "react-icons/fa";

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
              <FaBan className="h-10 w-10 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Cancelled</h1>
            <p className="text-gray-600 mb-6">
              You have cancelled the payment process. No amount has been deducted from your account.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-yellow-800 mb-2">Note</h3>
              <div className="text-sm text-yellow-700 space-y-1">
                <p>• Your payment was cancelled voluntarily</p>
                <p>• No money has been transferred</p>
                <p>• You can try again anytime</p>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/wallet"
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700"
              >
                <FaWallet className="mr-2" />
                Go to Wallet
              </Link>
              <Link
                to="/"
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50"
              >
                <FaHome className="mr-2" />
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
