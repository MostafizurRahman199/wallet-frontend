import { apiSlice } from "./apiSlice";
import { Transaction } from "@/types";

interface WalletBalance {
  balance: number;
  isBlocked: boolean;
  user: string;
}

interface SendMoneyRequest {
  receiverPhone: string;
  amount: number;
}

interface CashOutRequest {
  agentPhone: string;
  amount: number;
}

interface TopUpRequest {
  amount: number;
}

interface AgentCashInRequest {
  userPhone: string;
  amount: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const walletApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get wallet balance
    getWalletBalance: builder.query<ApiResponse<WalletBalance>, void>({
      query: () => "/wallet/balance",
      providesTags: ["Wallet"],
    }),

    // Send money to another user
    sendMoney: builder.mutation<
      ApiResponse<{
        senderBalance: number;
        receiverBalance: number;
        amountSent: number;
        fee: number;
      }>,
      SendMoneyRequest
    >({
      query: (data) => ({
        url: "/wallet/send",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Wallet", "Transaction"],
    }),

    // Cash out to agent
    cashOut: builder.mutation<
      ApiResponse<{
        userBalance: number;
        amount: number;
        commission: number;
        netReceived: number;
        agent: string;
        transactionId: string;
      }>,
      CashOutRequest
    >({
      query: (data) => ({
        url: "/wallet/withdraw",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Wallet", "Transaction"],
    }),

    // Top up wallet (initiate payment)
    topUp: builder.mutation<ApiResponse<any>, TopUpRequest>({
      query: (data) => ({
        url: "/wallet/top-up",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Wallet"],
    }),

    // Agent cash in (for agent users)
    agentCashIn: builder.mutation<
      ApiResponse<{
        userBalance: number;
        agentBalance: number;
        amount: number;
        commission: number;
      }>,
      AgentCashInRequest
    >({
      query: (data) => ({
        url: "/wallet/agent/cash-in",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Wallet", "Transaction"],
    }),

    // Get wallet transactions
    getWalletTransactions: builder.query<ApiResponse<Transaction[]>, void>({
      query: () => "/wallet/transactions",
      providesTags: ["Transaction"],
    }),
  }),
});

export const {
  useGetWalletBalanceQuery,
  useSendMoneyMutation,
  useCashOutMutation,
  useTopUpMutation,
  useAgentCashInMutation,
  useGetWalletTransactionsQuery,
} = walletApi;
