import { useState } from "react";
import { useFormik } from "formik";
import { topUpSchema } from "@/utils/walletValidation";
import PaymentModal from "@/components/payment/PaymentModal";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";

interface TopUpFormProps {
  onSuccess?: () => void;
}

const TopUpForm = ({ onSuccess }: TopUpFormProps) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);

  const formik = useFormik({
    initialValues: {
      amount: "",
    },
    validationSchema: topUpSchema,
    onSubmit: (values) => {
      const amount = parseFloat(values.amount);
      setSelectedAmount(amount);
      setShowPaymentModal(true);
    },
  });

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    formik.resetForm();
    if (onSuccess) onSuccess();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <FaCreditCard className="h-6 w-6 text-purple-600 mr-3" />
          <h2 className="text-xl font-bold text-gray-900">Top Up Wallet</h2>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaMoneyBillWave className="inline mr-2" />
              Amount (৳)
            </label>
            <input
              type="number"
              name="amount"
              placeholder="0.00"
              step="0.01"
              min="10"
              max="50000"
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.amount && formik.errors.amount && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.amount}</p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Select:</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    formik.setFieldValue("amount", amount.toString());
                    formik.setFieldTouched("amount", true);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  ৳{amount}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">Payment Methods</h4>
            <div className="text-sm text-green-700 space-y-1">
              <p>• Credit/Debit Card (Visa, MasterCard)</p>
              <p>• Mobile Banking (bKash, Nagad, Rocket)</p>
              <p>• Internet Banking</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!formik.isValid || !formik.dirty}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-md font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaCreditCard className="inline mr-2" />
              Proceed to Payment
            </button>
          </div>
        </form>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={selectedAmount}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default TopUpForm;
