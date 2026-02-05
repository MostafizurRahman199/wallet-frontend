import { apiSlice } from "@/api/apiSlice";

export const walletApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWalletBalance: builder.query({
      query: () => "/wallet/balance",
      providesTags: ["Wallet"],
    }),
    
    sendMoney: builder.mutation({
      query: (data) => ({
        url: "/wallet/send-money",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Wallet", "Transaction"],
    }),
    
    cashOut: builder.mutation({
      query: (data) => ({
        url: "/wallet/cash-out",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Wallet", "Transaction"],
    }),
    
    topUp: builder.mutation({
      query: (data) => ({
        url: "/wallet/top-up",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Wallet", "Transaction"],
    }),
    
    cashIn: builder.mutation({
      query: (data) => ({
        url: "/wallet/cash-in",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Wallet", "Transaction"],
    }),
  }),
});

export const {
  useGetWalletBalanceQuery,
  useSendMoneyMutation,
  useCashOutMutation,
  useTopUpMutation,
  useCashInMutation,
} = walletApi;