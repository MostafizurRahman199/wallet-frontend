import { apiSlice } from "./apiSlice";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboardStats: builder.query({
      query: () => "/admin/dashboard",
      providesTags: ["Admin"],
    }),

    getAllUsers: builder.query({
      query: (params) => ({
        url: "/admin/users",
        params,
      }),
      providesTags: ["Admin", "User"],
    }),

    blockUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}/block`,
        method: "PATCH",
      }),
      invalidatesTags: ["Admin", "User"],
    }),

    unblockUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}/unblock`,
        method: "PATCH",
      }),
      invalidatesTags: ["Admin", "User"],
    }),

    getAllAgents: builder.query({
      query: (params) => ({
        url: "/admin/agents",
        params,
      }),
      providesTags: ["Admin", "Agent"],
    }),

    approveAgent: builder.mutation({
      query: (agentId) => ({
        url: `/admin/agents/${agentId}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Admin", "Agent"],
    }),

    suspendAgent: builder.mutation({
      query: (agentId) => ({
        url: `/admin/agents/${agentId}/suspend`,
        method: "PATCH",
      }),
      invalidatesTags: ["Admin", "Agent"],
    }),

    getAllWallets: builder.query({
      query: (params) => ({
        url: "/admin/wallets",
        params,
      }),
      providesTags: ["Admin", "Wallet"],
    }),

    blockWallet: builder.mutation({
      query: (walletId) => ({
        url: `/admin/wallets/${walletId}/block`,
        method: "PATCH",
      }),
      invalidatesTags: ["Admin", "Wallet"],
    }),

    unblockWallet: builder.mutation({
      query: (walletId) => ({
        url: `/admin/wallets/${walletId}/unblock`,
        method: "PATCH",
      }),
      invalidatesTags: ["Admin", "Wallet"],
    }),
  }),
});

export const {
  useGetAdminDashboardStatsQuery,
  useGetAllUsersQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
  useGetAllAgentsQuery,
  useApproveAgentMutation,
  useSuspendAgentMutation,
  useGetAllWalletsQuery,
  useBlockWalletMutation,
  useUnblockWalletMutation,
} = adminApi;
