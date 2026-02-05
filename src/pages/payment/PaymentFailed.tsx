import { Link, useSearchParams } from "react-router-dom";
import { FaTimesCircle, FaHome, FaWallet, FaRedo } from "react-icons/fa";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <FaTimesCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Failed</h1>
            <p className="text-gray-600 mb-6">
              Your payment could not be processed. Please try again or use a different payment method.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-red-800 mb-2">Transaction Details</h3>
              <div className="text-sm text-red-700 space-y-1">
                {searchParams.get("tran_id") && <p>Transaction ID: {searchParams.get("tran_id")}</p>}
                {searchParams.get("error") && <p>Error: {searchParams.get("error")}</p>}
                <p>Status: Failed</p>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/wallet"
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700"
              >
                <FaRedo className="mr-2" />
                Try Again
              </Link>
              <Link
                to="/wallet"
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50"
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

export default PaymentFailed;
