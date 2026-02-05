export const transformDashboardStats = (apiData: any) => {
  // Extract data based on backend response structure
  const responseData = apiData?.data || {};
  const stats = responseData.stats || responseData || {};

  // Map backend field names to frontend expected names
  return {
    // These come from backend
    totalUsers: stats.totalUsers || 0,
    totalAgents: stats.totalAgents || 0,
    totalTransactions: stats.totalTransactions || 0,
    totalBalance: stats.totalWalletBalance || 0, // Map totalWalletBalance to totalBalance

    // These are not in backend, set to 0
    totalWallets: 0,
    pendingAgents: 0,
    approvedAgents: 0,
    blockedUsers: 0,
    transactionVolume: 0,
  };
};
