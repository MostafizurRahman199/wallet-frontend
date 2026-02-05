import { apiSlice } from "./apiSlice";
import { PaymentInitResponse, PaymentHistoryResponse, Payment, PAYMENT_STATUS } from "@/types";

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Initiate payment (top-up)
    initiatePayment: builder.mutation<PaymentInitResponse, { amount: number }>({
      query: (data) => ({
        url: "/payments/initiate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payment", "Wallet"],
    }),

    // Get payment history
    getPaymentHistory: builder.query<PaymentHistoryResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/payments/history",
        params: { page, limit },
      }),
      providesTags: ["Payment"],
    }),

    // Get payment by ID
    getPaymentById: builder.query<{ success: boolean; message: string; data: Payment }, string>({
      query: (id) => `/payments/${id}`,
      providesTags: (result, error, id) => [{ type: "Payment", id }],
    }),

    // Validate payment (for success callback)
    validatePayment: builder.mutation<
      { success: boolean; message: string; data?: any },
      { transactionId: string; status: string }
    >({
      query: (data) => ({
        url: "/payments/validate",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useInitiatePaymentMutation,
  useGetPaymentHistoryQuery,
  useLazyGetPaymentHistoryQuery,
  useGetPaymentByIdQuery,
  useValidatePaymentMutation,
} = paymentApi;
