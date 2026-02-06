import { useState } from "react";
import { useFormik } from "formik";
import { useAgentCashInMutation } from "@/api/walletApi";
import { useGetWalletBalanceQuery } from "@/api/walletApi";
import { agentCashInSchema } from "@/utils/walletValidation";
import toast from "react-hot-toast";
import { FaUserFriends, FaUser, FaMoneyBillWave } from "react-icons/fa";

const AgentCashInForm = () => {
  const [agentCashIn, { isLoading }] = useAgentCashInMutation();
  const { data: balanceData } = useGetWalletBalanceQuery();
  const [preview, setPreview] = useState<{
    amount: number;
    commission: number;
  } | null>(null);

  const agentBalance = balanceData?.data?.balance || 0;
  const commissionRate = 0.015; // 1.5%

  const formik = useFormik({
    initialValues: {
      userPhone: "",
      amount: "",
    },
    validationSchema: agentCashInSchema,
    onSubmit: async (values) => {
      try {
        const amount = parseFloat(values.amount);
        const result = await agentCashIn({
          userPhone: values.userPhone,
          amount,
        }).unwrap();

        if (result.success) {
          toast.success("Cash-in successful!");
          formik.resetForm();
          setPreview(null);
        }
      } catch (error: any) {
        toast.error(error.data?.message || "Failed to process cash-in");
      }
    },
  });

  const calculatePreview = () => {
    const amount = parseFloat(formik.values.amount) || 0;
    if (amount > 0) {
      const commission = amount * commissionRate;
      setPreview({ amount, commission });
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <FaUserFriends className="h-6 w-6 text-blue-600 mr-3" />
        <h2 className="text-xl font-bold text-gray-900">Agent Cash In</h2>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaUser className="inline mr-2" />
            User Phone Number
          </label>
          <input
            type="tel"
            name="userPhone"
            placeholder="01XXXXXXXXX"
            className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={formik.values.userPhone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.userPhone && formik.errors.userPhone && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.userPhone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaMoneyBillWave className="inline mr-2" />
            Amount to Add (৳)
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
            onChange={(e) => {
              formik.handleChange(e);
              setTimeout(calculatePreview, 100);
            }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.amount && formik.errors.amount && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.amount}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">Your agent balance: ৳{agentBalance.toFixed(2)}</p>
        </div>

        {preview && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Transaction Preview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount to add to user:</span>
                <span className="font-medium">৳{preview.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Your commission (1.5%):</span>
                <span className="font-medium text-green-700">+৳{preview.commission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-blue-200 pt-2">
                <span className="font-medium text-gray-700">Net cost to you:</span>
                <span className="font-bold text-red-700">৳{(preview.amount - preview.commission).toFixed(2)}</span>
              </div>
              {preview.amount > agentBalance && (
                <div className="mt-2 p-2 bg-red-100 rounded">
                  <p className="text-sm text-red-700">
                    Insufficient balance. You need ৳{(preview.amount - agentBalance).toFixed(2)} more.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">Instructions</h4>
          <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
            <li>Collect cash from user</li>
            <li>Enter user's phone number</li>
            <li>Enter the amount received</li>
            <li>Confirm the transaction</li>
            <li>User's wallet will be credited instantly</li>
            <li>You earn 1.5% commission automatically</li>
          </ol>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading || !formik.isValid || (preview?.amount || 0) > agentBalance}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Complete Cash In"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgentCashInForm;
