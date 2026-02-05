import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useValidatePaymentMutation } from "@/api/paymentApi";
import { FaCheckCircle, FaSpinner, FaHome, FaWallet } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [validatePayment, { isLoading }] = useValidatePaymentMutation();
  const [validationStatus, setValidationStatus] = useState<"validating" | "success" | "failed">("validating");

  useEffect(() => {
    const validate = async () => {
      const transactionId = searchParams.get("tran_id");
      const status = searchParams.get("status");

      if (!transactionId || !status) {
        toast.error("Invalid payment callback");
        navigate("/wallet");
        return;
      }

      try {
        const result = await validatePayment({ transactionId, status }).unwrap();

        if (result.success) {
          setValidationStatus("success");
          toast.success("Payment successful! Your wallet has been credited.");

          // Redirect to wallet after 3 seconds
          setTimeout(() => {
            navigate("/wallet");
          }, 3000);
        } else {
          setValidationStatus("failed");
          toast.error("Payment validation failed");
        }
      } catch (error) {
        setValidationStatus("failed");
        toast.error("Payment validation error");
      }
    };

    validate();
  }, [searchParams, validatePayment, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          {validationStatus === "validating" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <FaSpinner className="h-10 w-10 text-green-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Validating Payment</h1>
              <p className="text-gray-600 mb-6">Please wait while we verify your payment...</p>
              <div className="animate-pulse">
                <div className="h-2 bg-gray-200 rounded-full max-w-md mx-auto mb-2"></div>
                <div className="h-2 bg-gray-200 rounded-full max-w-md mx-auto"></div>
              </div>
            </div>
          )}

          {validationStatus === "success" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <FaCheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">Your payment has been verified and your wallet has been credited.</p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-green-800 mb-2">Transaction Details</h3>
                <div className="text-sm text-green-700 space-y-1">
                  <p>Transaction ID: {searchParams.get("tran_id")?.slice(0, 15)}...</p>
                  <p>Status: {searchParams.get("status")}</p>
                  <p>Redirecting to wallet in 3 seconds...</p>
                </div>
              </div>
            </div>
          )}

          {validationStatus === "failed" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <FaCheckCircle className="h-10 w-10 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Verification Failed</h1>
              <p className="text-gray-600 mb-6">
                We couldn't verify your payment. Please check your wallet balance or contact support.
              </p>

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
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
