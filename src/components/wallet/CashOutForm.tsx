import { useState } from "react";
import { useFormik } from "formik";
import { useCashOutMutation } from "@/api/walletApi";
import { useGetWalletBalanceQuery } from "@/api/walletApi";
import { cashOutSchema } from "@/utils/walletValidation";
import toast from "react-hot-toast";
import { FaExchangeAlt, FaUserTie, FaMoneyBillWave } from "react-icons/fa";

interface CashOutFormProps {
  onSuccess?: () => void;
}

const CashOutForm = ({ onSuccess }: CashOutFormProps) => {
  const [cashOut, { isLoading }] = useCashOutMutation();
  const { data: balanceData } = useGetWalletBalanceQuery();
  const [preview, setPreview] = useState<{
    amount: number;
    commission: number;
    netReceived: number;
  } | null>(null);

  const walletBalance = balanceData?.data?.balance || 0;
  const commissionRate = 0.015; // 1.5%

  const formik = useFormik({
    initialValues: {
      agentPhone: "",
      amount: "",
    },
    validationSchema: cashOutSchema,
    onSubmit: async (values) => {
      try {
        const amount = parseFloat(values.amount);
        const result = await cashOut({
          agentPhone: values.agentPhone,
          amount,
        }).unwrap();

        if (result.success) {
          toast.success("Cash-out request successful!");
          formik.resetForm();
          setPreview(null);
          if (onSuccess) onSuccess();
        }
      } catch (error: any) {
        toast.error(error.data?.message || "Failed to process cash-out");
      }
    },
  });

  const calculatePreview = () => {
    const amount = parseFloat(formik.values.amount) || 0;
    if (amount > 0) {
      const commission = amount * commissionRate;
      const netReceived = amount - commission;
      setPreview({ amount, commission, netReceived });
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <FaExchangeAlt className="h-6 w-6 text-orange-600 mr-3" />
        <h2 className="text-xl font-bold text-gray-900">Cash Out to Agent</h2>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaUserTie className="inline mr-2" />
            Agent Phone Number
          </label>
          <input
            type="tel"
            name="agentPhone"
            placeholder="01XXXXXXXXX"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={formik.values.agentPhone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.agentPhone && formik.errors.agentPhone && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.agentPhone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaMoneyBillWave className="inline mr-2" />
            Amount to Cash Out (৳)
          </label>
          <input
            type="number"
            name="amount"
            placeholder="0.00"
            step="0.01"
            min="10"
            max="50000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={formik.values.amount}
            onChange={(e) => {
              formik.handleChange(e);
              setTimeout(calculatePreview, 100);
            }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.amount && formik.errors.amount && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.amount}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">Available balance: ৳{walletBalance.toFixed(2)}</p>
        </div>

        {preview && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Cash Out Preview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount to cash out:</span>
                <span className="font-medium">৳{preview.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Agent commission (1.5%):</span>
                <span className="font-medium">৳{preview.commission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-yellow-200 pt-2">
                <span className="font-medium text-gray-700">You will receive in cash:</span>
                <span className="font-bold text-green-700">৳{preview.netReceived.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Total deduction from wallet:</span>
                <span className="font-bold text-red-700">৳{preview.amount.toFixed(2)}</span>
              </div>
              {preview.amount > walletBalance && (
                <div className="mt-2 p-2 bg-red-100 rounded">
                  <p className="text-sm text-red-700">
                    Insufficient balance. You need ৳{(preview.amount - walletBalance).toFixed(2)} more.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">How it works</h4>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Enter agent's phone number</li>
            <li>Specify amount to cash out</li>
            <li>1.5% commission will be deducted</li>
            <li>Meet the agent to receive cash</li>
            <li>Show transaction ID to agent</li>
          </ol>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading || !formik.isValid || (preview?.amount || 0) > walletBalance}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-md font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Request Cash Out"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CashOutForm;
