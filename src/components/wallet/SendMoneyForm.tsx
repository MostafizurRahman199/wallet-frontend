import { useState } from "react";
import { useFormik } from "formik";
import { useSendMoneyMutation } from "@/api/walletApi";
import { useGetWalletBalanceQuery } from "@/api/walletApi";
import { sendMoneySchema } from "@/utils/walletValidation";
import toast from "react-hot-toast";
import { FaPaperPlane, FaUser, FaMoneyBillWave } from "react-icons/fa";

interface SendMoneyFormProps {
  onSuccess?: () => void;
}

const SendMoneyForm = ({ onSuccess }: SendMoneyFormProps) => {
  const [sendMoney, { isLoading }] = useSendMoneyMutation();
  const { data: balanceData } = useGetWalletBalanceQuery();
  const [preview, setPreview] = useState<{
    amount: number;
    fee: number;
    total: number;
  } | null>(null);

  const walletBalance = balanceData?.data?.balance || 0;

  const formik = useFormik({
    initialValues: {
      receiverPhone: "",
      amount: "",
    },
    validationSchema: sendMoneySchema,
    onSubmit: async (values) => {
      try {
        const amount = parseFloat(values.amount);
        const result = await sendMoney({
          receiverPhone: values.receiverPhone,
          amount,
        }).unwrap();

        if (result.success) {
          toast.success("Money sent successfully!");
          formik.resetForm();
          setPreview(null);
          if (onSuccess) onSuccess();
        }
      } catch (error: any) {
        toast.error(error.data?.message || "Failed to send money");
      }
    },
  });

  const calculatePreview = () => {
    const amount = parseFloat(formik.values.amount) || 0;
    if (amount > 0) {
      const fee = amount * 0.01; // 1% fee
      const total = amount + fee;
      setPreview({ amount, fee, total });
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <FaPaperPlane className="h-6 w-6 text-primary-600 mr-3" />
        <h2 className="text-xl font-bold text-gray-900">Send Money</h2>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaUser className="inline mr-2" />
            Receiver Phone Number
          </label>
          <input
            type="tel"
            name="receiverPhone"
            placeholder="01XXXXXXXXX"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={formik.values.receiverPhone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.receiverPhone && formik.errors.receiverPhone && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.receiverPhone}</p>
          )}
        </div>

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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Transaction Preview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount to send:</span>
                <span className="font-medium">৳{preview.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction fee (1%):</span>
                <span className="font-medium">৳{preview.fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-blue-200 pt-2">
                <span className="font-medium text-gray-700">Total deduction:</span>
                <span className="font-bold text-blue-700">৳{preview.total.toFixed(2)}</span>
              </div>
              {preview.total > walletBalance && (
                <div className="mt-2 p-2 bg-red-100 rounded">
                  <p className="text-sm text-red-700">
                    Insufficient balance. You need ৳{(preview.total - walletBalance).toFixed(2)} more.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading || !formik.isValid || (preview?.total || 0) > walletBalance}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send Money"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendMoneyForm;
