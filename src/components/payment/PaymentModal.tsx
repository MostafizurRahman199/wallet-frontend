import { useState } from "react";
import { useInitiatePaymentMutation } from "@/api/paymentApi";
import toast from "react-hot-toast";
import { FaCreditCard, FaSpinner, FaExternalLinkAlt, FaTimes } from "react-icons/fa";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess?: () => void;
}

const PaymentModal = ({ isOpen, onClose, amount, onSuccess }: PaymentModalProps) => {
  const [initiatePayment, { isLoading }] = useInitiatePaymentMutation();
  const [paymentStep, setPaymentStep] = useState<"confirmation" | "redirecting" | "processing">("confirmation");

  const handlePayment = async () => {
    try {
      setPaymentStep("processing");
      const result = await initiatePayment({ amount }).unwrap();

      if (result.success && result.data.paymentUrl) {
        setPaymentStep("redirecting");
        toast.success("Redirecting to payment gateway...");

        // Redirect to payment gateway
        setTimeout(() => {
          window.location.href = result.data.paymentUrl;
        }, 1000);

        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Payment initiation failed");
      setPaymentStep("confirmation");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center">
            <FaCreditCard className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" disabled={isLoading}>
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {paymentStep === "confirmation" && (
            <>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-primary-600 mb-2">৳{amount.toFixed(2)}</div>
                <p className="text-gray-600">Ready to proceed with payment</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-800 mb-2">Payment Instructions</h4>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>You will be redirected to SSL Commerz payment gateway</li>
                  <li>Complete payment using your preferred method</li>
                  <li>Your wallet will be credited immediately after successful payment</li>
                  <li>Keep this window open until payment is complete</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Accepted Payment Methods</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>Credit/Debit Cards</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span>bKash</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span>Nagad</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span>Rocket</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {paymentStep === "processing" && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                {isLoading ? (
                  <FaSpinner className="h-8 w-8 text-primary-600 animate-spin" />
                ) : (
                  <FaCreditCard className="h-8 w-8 text-primary-600" />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Payment</h3>
              <p className="text-gray-600">Please wait while we connect to payment gateway...</p>
            </div>
          )}

          {paymentStep === "redirecting" && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <FaExternalLinkAlt className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Redirecting to Payment Gateway</h3>
              <p className="text-gray-600 mb-4">You will be redirected to SSL Commerz shortly...</p>
              <div className="animate-pulse">
                <div className="h-2 bg-gray-200 rounded-full max-w-md mx-auto"></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-lg">
          <div className="flex justify-between">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isLoading || paymentStep !== "confirmation"}
              className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <FaCreditCard className="mr-2" />
                  Proceed to Pay ৳{amount.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
