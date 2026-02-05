import { apiSlice } from "./apiSlice";

export interface TransactionUser {
  _id: string;
  name: string;
  phone: string;
}

export interface Transaction {
  _id: string;
  from: TransactionUser;
  to: TransactionUser;
  amount: number;
  fee: number;
  commission?: number;
  type: "DEPOSIT" | "WITHDRAW" | "SEND_MONEY" | "CASH_IN" | "CASH_OUT" | "COMMISSION";
  status: "PENDING" | "COMPLETED" | "FAILED" | "REVERSED";
  description?: string;
  balanceBefore: number;
  balanceAfter: number;
  initiatedBy: TransactionUser;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    transactions: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface CommissionResponse {
  success: boolean;
  message: string;
  data: {
    commissions: Transaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export const transactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get user transactions
    getMyTransactions: builder.query<PaginatedResponse<Transaction>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/transaction/me`,
        params: { page, limit },
      }),
      providesTags: ["Transaction"],
    }),

    // Get agent commissions
    getMyCommissions: builder.query<CommissionResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/transaction/commissions`,
        params: { page, limit },
      }),
      providesTags: ["Transaction"],
    }),

    // Get all transactions (admin only)
    getAllTransactions: builder.query<PaginatedResponse<Transaction>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/transaction/admin/all`,
        params: { page, limit },
      }),
      providesTags: ["Transaction"],
    }),

    // Get transaction by ID
    getTransactionById: builder.query<{ success: boolean; message: string; data: Transaction }, string>({
      query: (id) => `/transaction/${id}`,
      providesTags: (result, error, id) => [{ type: "Transaction", id }],
    }),

    // Search transactions
    searchTransactions: builder.query<
      PaginatedResponse<Transaction>,
      {
        page?: number;
        limit?: number;
        type?: string;
        startDate?: string;
        endDate?: string;
        minAmount?: number;
        maxAmount?: number;
      }
    >({
      query: (params) => ({
        url: `/transaction/search`,
        params,
      }),
    }),
  }),
});

export const {
  useGetMyTransactionsQuery,
  useLazyGetMyTransactionsQuery,
  useGetMyCommissionsQuery,
  useLazyGetMyCommissionsQuery,
  useGetAllTransactionsQuery,
  useLazyGetAllTransactionsQuery,
  useGetTransactionByIdQuery,
  useLazySearchTransactionsQuery,
} = transactionApi;
