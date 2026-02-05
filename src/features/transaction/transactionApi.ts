import { apiSlice } from "@/api/apiSlice";

export const transactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyTransactions: builder.query({
      query: (params) => ({
        url: "/transactions/my-transactions",
        params,
      }),
      providesTags: ["Transaction"],
    }),
    
    getMyCommissions: builder.query({
      query: (params) => ({
        url: "/transactions/my-commissions",
        params,
      }),
      providesTags: ["Transaction"],
    }),
    
    getAllTransactions: builder.query({
      query: (params) => ({
        url: "/transactions",
        params,
      }),
      providesTags: ["Transaction"],
    }),
    
    getTransactionById: builder.query({
      query: (id) => `/transactions/${id}`,
      providesTags: ["Transaction"],
    }),
  }),
});

export const {
  useGetMyTransactionsQuery,
  useGetMyCommissionsQuery,
  useGetAllTransactionsQuery,
  useGetTransactionByIdQuery,
} = transactionApi;
