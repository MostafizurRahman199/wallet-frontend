import React, { useState, useEffect, useMemo } from "react";
import { useGetAllWalletsQuery, useBlockWalletMutation, useUnblockWalletMutation } from "@/api/adminApi";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaBan,
  FaCheck,
  FaWallet,
  FaUser,
  FaUserTie,
  FaUserShield,
  FaExclamationTriangle,
  FaSync,
  FaEllipsisV,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaCreditCard,
  FaExchangeAlt,
  
} from "react-icons/fa";
import { HiOutlineCurrencyBangladeshi } from "react-icons/hi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

// Define Wallet type based on your backend response
interface WalletType {
  _id: string;
  balance: number;
  isBlocked: boolean;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: "user" | "agent" | "admin";
    isActive: boolean;
  };
  transactionCount?: number;
  lastTransaction?: string;
  createdAt: string;
  updatedAt: string;
}

type SortField = "balance" | "status" | "owner" | "date" | "transactions";
type SortDirection = "asc" | "desc";

const AdminWallets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [balanceRange, setBalanceRange] = useState("all");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("balance");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const limit = 12;

  // API Queries
  const {
    data: walletsData,
    isLoading,
    error,
    refetch,
  } = useGetAllWalletsQuery({
    page,
    limit,
    search: searchTerm,
  });

  const [blockWallet, { isLoading: isBlocking }] = useBlockWalletMutation();
  const [unblockWallet, { isLoading: isUnblocking }] = useUnblockWalletMutation();

  // Extract wallets and pagination
  const wallets = walletsData?.data?.wallets || [];
  const pagination = walletsData?.data?.pagination || {
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
  };

  // Sort and filter wallets
  const filteredAndSortedWallets = useMemo(() => {
    let filtered = wallets.filter((wallet: WalletType) => {
      // Status filter
      if (statusFilter === "active" && wallet.isBlocked) return false;
      if (statusFilter === "blocked" && !wallet.isBlocked) return false;

      // Owner role filter
      if (ownerFilter !== "all" && wallet.user.role !== ownerFilter) return false;

      // Balance range filter
      if (balanceRange !== "all") {
        const balance = wallet.balance;
        switch (balanceRange) {
          case "low":
            if (balance >= 100) return false;
            break;
          case "medium":
            if (balance < 100 || balance >= 1000) return false;
            break;
          case "high":
            if (balance < 1000) return false;
            break;
        }
      }

      return true;
    });

    // Sort wallets
    filtered.sort((a: WalletType, b: WalletType) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case "balance":
          aValue = a.balance;
          bValue = b.balance;
          break;
        case "status":
          aValue = a.isBlocked;
          bValue = b.isBlocked;
          break;
        case "owner":
          aValue = a.user.name.toLowerCase();
          bValue = b.user.name.toLowerCase();
          break;
        case "date":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "transactions":
          aValue = a.transactionCount || 0;
          bValue = b.transactionCount || 0;
          break;
        default:
          return 0;
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [wallets, statusFilter, ownerFilter, balanceRange, sortField, sortDirection]);

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Show confirmation dialog
  const showConfirmationDialog = async (
    title: string,
    text: string,
    confirmButtonText: string,
    icon: "warning" | "success" | "error" | "info" | "question",
  ) => {
    const result = await Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonColor: icon === "warning" ? "#ef4444" : "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText,
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        confirmButton: "px-4 py-2 rounded-lg",
        cancelButton: "px-4 py-2 rounded-lg",
      },
    });

    return result.isConfirmed;
  };

  // Handle block wallet
  const handleBlockWallet = async (walletId: string, userName: string) => {
    const confirmed = await showConfirmationDialog(
      "Block Wallet",
      `Are you sure you want to block ${userName}'s wallet? This will prevent all transactions.`,
      "Yes, Block Wallet",
      "warning",
    );

    if (confirmed) {
      try {
        Swal.fire({
          title: "Blocking Wallet...",
          text: "Please wait while we process your request",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await blockWallet(walletId).unwrap();

        Swal.fire({
          title: "Blocked!",
          text: `Wallet has been blocked successfully`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        refetch();
      } catch (error: any) {
        Swal.fire({
          title: "Error!",
          text: error?.data?.message || "Failed to block wallet",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  // Handle unblock wallet
  const handleUnblockWallet = async (walletId: string, userName: string) => {
    const confirmed = await showConfirmationDialog(
      "Unblock Wallet",
      `Are you sure you want to unblock ${userName}'s wallet? This will restore transaction capabilities.`,
      "Yes, Unblock Wallet",
      "question",
    );

    if (confirmed) {
      try {
        Swal.fire({
          title: "Unblocking Wallet...",
          text: "Please wait while we process your request",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await unblockWallet(walletId).unwrap();

        Swal.fire({
          title: "Unblocked!",
          text: `Wallet has been unblocked successfully`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        refetch();
      } catch (error: any) {
        Swal.fire({
          title: "Error!",
          text: error?.data?.message || "Failed to unblock wallet",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  // Show wallet details modal
  const showWalletDetails = (wallet: WalletType) => {
    Swal.fire({
      title: `<strong>Wallet Details</strong>`,
      html: `
        <div class="text-left">
          <div class="flex items-center mb-6">
            <div class="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white mr-4">
              <i class="fas fa-wallet"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">৳${wallet.balance.toFixed(2)}</p>
              <p class="text-gray-600">Wallet Balance</p>
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-xl p-4 mb-6">
            <div class="flex items-center mb-3">
              <div class="p-2 rounded-lg ${getRoleColor(wallet.user.role)} text-white mr-3">
                ${
                  wallet.user.role === "admin"
                    ? '<i class="fas fa-user-shield"></i>'
                    : wallet.user.role === "agent"
                      ? '<i class="fas fa-user-tie"></i>'
                      : '<i class="fas fa-user"></i>'
                }
              </div>
              <div>
                <p class="font-semibold text-gray-900">${wallet.user.name}</p>
                <p class="text-sm text-gray-600">${wallet.user.role.toUpperCase()}</p>
              </div>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center text-sm">
                <i class="fas fa-envelope text-gray-400 mr-3 w-5"></i>
                <span class="text-gray-700">${wallet.user.email}</span>
              </div>
              <div class="flex items-center text-sm">
                <i class="fas fa-phone text-gray-400 mr-3 w-5"></i>
                <span class="text-gray-700">${wallet.user.phone}</span>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
              <div class="flex items-center mb-2">
                <i class="fas fa-exchange-alt text-blue-500 mr-2"></i>
                <span class="text-sm font-medium text-blue-700">Transactions</span>
              </div>
              <p class="text-2xl font-bold text-blue-900">${wallet.transactionCount || 0}</p>
            </div>
            
            <div class="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
              <div class="flex items-center mb-2">
                <i class="fas fa-calendar-alt text-purple-500 mr-2"></i>
                <span class="text-sm font-medium text-purple-700">Created</span>
              </div>
              <p class="text-sm font-bold text-purple-900">${formatDate(wallet.createdAt)}</p>
            </div>
          </div>
          
          <div class="flex justify-between items-center pt-6 border-t border-gray-200">
            <div>
              <span class="text-sm font-medium text-gray-500">Wallet Status</span>
              <div class="mt-1">
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${getWalletStatusColor(wallet.isBlocked)} text-white">
                  ${wallet.isBlocked ? "BLOCKED" : "ACTIVE"}
                </span>
              </div>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">User Status</span>
              <div class="mt-1">
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${getUserStatusColor(wallet.user.isActive)} text-white">
                  ${wallet.user.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
            </div>
          </div>
        </div>
      `,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: wallet.isBlocked ? "Unblock Wallet" : "Block Wallet",
      confirmButtonColor: wallet.isBlocked ? "#10b981" : "#ef4444",
      cancelButtonText: "Close",
      showDenyButton: false,
      reverseButtons: true,
      customClass: {
        confirmButton: "px-4 py-2 rounded-lg",
        cancelButton: "px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300",
        popup: "rounded-2xl",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (wallet.isBlocked) {
          handleUnblockWallet(wallet._id, wallet.user.name);
        } else {
          handleBlockWallet(wallet._id, wallet.user.name);
        }
      }
    });
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, refetch]);

  // Handle error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-100 rounded-xl mr-4">
                <FaExclamationTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-800 mb-1">Error Loading Wallets</h2>
                <p className="text-red-600">Failed to load wallets. Please try again.</p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              Retry Loading
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-purple-500 to-purple-600";
      case "agent":
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <FaUserShield className="h-4 w-4" />;
      case "agent":
        return <FaUserTie className="h-4 w-4" />;
      default:
        return <FaUser className="h-4 w-4" />;
    }
  };

  // Get wallet status color
  const getWalletStatusColor = (isBlocked: boolean) => {
    return isBlocked ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-green-500 to-green-600";
  };

  // Get user status color
  const getUserStatusColor = (isActive: boolean) => {
    return isActive ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gradient-to-r from-red-500 to-red-600";
  };

  // Calculate stats
  const stats = useMemo(() => {
    const totalWallets = wallets.length;
    const activeWallets = wallets.filter((wallet: WalletType) => !wallet.isBlocked).length;
    const blockedWallets = wallets.filter((wallet: WalletType) => wallet.isBlocked).length;
    const totalBalance = wallets.reduce((sum: number, wallet: WalletType) => sum + wallet.balance, 0);
    const averageBalance = totalWallets > 0 ? totalBalance / totalWallets : 0;

    return {
      totalWallets,
      activeWallets,
      blockedWallets,
      totalBalance,
      averageBalance,
    };
  }, [wallets]);

  return (
    <div className="min-h-screen ">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center mb-2">
                <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mr-3">
                  <FaWallet className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Wallet Management</h1>
              </div>
              <p className="text-gray-600">Manage all wallets and monitor balances on the platform</p>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:transform-none"
            >
              <FaSync className={`mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search and Filter Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by owner name, email, or wallet ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-black pl-10 block w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-black pl-10 block w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            {/* Owner Role Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={ownerFilter}
                onChange={(e) => setOwnerFilter(e.target.value)}
                className="text-black pl-10 block w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Owners</option>
                <option value="user">Users</option>
                <option value="agent">Agents</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          {/* Balance Range Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Balance Range</label>
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => setBalanceRange("all")}
                className={`py-2 rounded-xl text-sm font-medium transition-all ${balanceRange === "all" ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                All
              </button>
              <button
                onClick={() => setBalanceRange("low")}
                className={`py-2 rounded-xl text-sm font-medium transition-all ${balanceRange === "low" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Low (&lt; ৳100)
              </button>
              <button
                onClick={() => setBalanceRange("medium")}
                className={`py-2 rounded-xl text-sm font-medium transition-all ${balanceRange === "medium" ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Medium (৳100-৳999)
              </button>
              <button
                onClick={() => setBalanceRange("high")}
                className={`py-2 rounded-xl text-sm font-medium transition-all ${balanceRange === "high" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                High (&gt;= ৳1,000)
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
              <p className="text-sm font-medium text-green-600 mb-1">Total Balance</p>
              <p className="text-2xl font-bold text-green-800">{formatCurrency(stats.totalBalance)}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-medium text-blue-600 mb-1">Total Wallets</p>
              <p className="text-2xl font-bold text-blue-800">{stats.totalWallets}</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
              <p className="text-sm font-medium text-green-600 mb-1">Active Wallets</p>
              <p className="text-2xl font-bold text-green-800">{stats.activeWallets}</p>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-medium text-red-600 mb-1">Blocked Wallets</p>
              <p className="text-2xl font-bold text-red-800">{stats.blockedWallets}</p>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
              <p className="text-sm font-medium text-purple-600 mb-1">Average Balance</p>
              <p className="text-2xl font-bold text-purple-800">{formatCurrency(stats.averageBalance)}</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm font-medium text-yellow-600 mb-1">Showing</p>
              <p className="text-2xl font-bold text-yellow-800">{filteredAndSortedWallets.length} wallets</p>
            </div>
          </div>
        </div>

        {/* Wallets Grid/Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Sort Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Wallets</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleSort("balance")}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Balance{" "}
                  {sortField === "balance" &&
                    (sortDirection === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />)}
                </button>
                <button
                  onClick={() => handleSort("owner")}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Owner{" "}
                  {sortField === "owner" &&
                    (sortDirection === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />)}
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading wallets...</p>
            </div>
          ) : filteredAndSortedWallets.length === 0 ? (
            <div className="p-12 text-center">
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl inline-flex mb-4">
                <FaExclamationTriangle className="h-12 w-12 text-yellow-500" />
              </div>
              <p className="text-gray-700 font-medium mb-2">No wallets found</p>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setOwnerFilter("all");
                  setBalanceRange("all");
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Mobile Grid View */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:hidden">
                {filteredAndSortedWallets.map((wallet: WalletType) => (
                  <div
                    key={wallet._id}
                    className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white mr-4">
                          <FaWallet className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{formatCurrency(wallet.balance)}</h3>
                          <p className="text-sm text-gray-600">ID: {wallet._id.slice(-8)}</p>
                        </div>
                      </div>
                      <button onClick={() => showWalletDetails(wallet)} className="text-gray-400 hover:text-gray-600">
                        <FaEllipsisV />
                      </button>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm">
                        <div className={`p-1 rounded ${getRoleColor(wallet.user.role)} text-white mr-2`}>
                          {getRoleIcon(wallet.user.role)}
                        </div>
                        <span className="text-gray-900 font-medium">{wallet.user.name}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <FaEnvelope className="h-3 w-3 text-gray-400 mr-2" />
                        <span className="text-gray-700">{wallet.user.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <FaExchangeAlt className="h-3 w-3 text-gray-400 mr-2" />
                        <span className="text-gray-700">Transactions: {wallet.transactionCount || 0}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex flex-col">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getWalletStatusColor(wallet.isBlocked)} text-white mb-1`}
                        >
                          {wallet.isBlocked ? "BLOCKED" : "ACTIVE"}
                        </span>
                        <span className="text-xs text-gray-500">{formatDate(wallet.createdAt)}</span>
                      </div>
                      <div className="flex space-x-2">
                        {wallet.isBlocked ? (
                          <button
                            onClick={() => handleUnblockWallet(wallet._id, wallet.user.name)}
                            disabled={isUnblocking}
                            className="px-3 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlockWallet(wallet._id, wallet.user.name)}
                            disabled={isBlocking}
                            className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            Block
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Wallet
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Wallet Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        User Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedWallets.map((wallet: WalletType) => (
                      <tr key={wallet._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white mr-3">
                              <FaWallet className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">ID: {wallet._id.slice(-8)}</div>
                              <div className="text-sm text-gray-500">Tx: {wallet.transactionCount || 0}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${getRoleColor(wallet.user.role)} text-white mr-3`}>
                              {getRoleIcon(wallet.user.role)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{wallet.user.name}</div>
                              <div className="text-sm text-gray-500">{wallet.user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <HiOutlineCurrencyBangladeshi className="h-5 w-5 text-green-500 mr-2" />
                            <div>
                              <div className="font-bold text-gray-900 text-lg">{formatCurrency(wallet.balance)}</div>
                              <div className="text-xs text-gray-500">{wallet.user.role.toUpperCase()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getWalletStatusColor(wallet.isBlocked)} text-white`}
                          >
                            {wallet.isBlocked ? "BLOCKED" : "ACTIVE"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getUserStatusColor(wallet.user.isActive)} text-white`}
                          >
                            {wallet.user.isActive ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <FaCalendarAlt className="h-3 w-3 mr-2" />
                            {formatDate(wallet.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => showWalletDetails(wallet)}
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            {wallet.isBlocked ? (
                              <button
                                onClick={() => handleUnblockWallet(wallet._id, wallet.user.name)}
                                disabled={isUnblocking}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Unblock Wallet"
                              >
                                <FaCheck />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBlockWallet(wallet._id, wallet.user.name)}
                                disabled={isBlocking}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Block Wallet"
                              >
                                <FaBan />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-semibold">{(page - 1) * limit + 1}</span> to{" "}
                    <span className="font-semibold">{Math.min(page * limit, pagination.total)}</span> of{" "}
                    <span className="font-semibold">{pagination.total}</span> wallets
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        let pageNum = i + 1;
                        if (page > 3 && pagination.pages > 5) {
                          pageNum = page - 2 + i;
                          if (pageNum > pagination.pages) pageNum = pagination.pages - 4 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                              page === pageNum
                                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                      disabled={page === pagination.pages}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Information Card */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
          <div className="flex">
            <div className="p-3 bg-blue-100 rounded-xl mr-4 flex-shrink-0">
              {/* <FaShield className="h-6 w-6 text-blue-500" /> */}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Wallet Management Guide</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-blue-700">
                  <div className="font-medium mb-1">Blocking Wallets</div>
                  <p className="text-sm">Blocked wallets cannot send or receive funds</p>
                </div>
                <div className="text-blue-700">
                  <div className="font-medium mb-1">Balance Monitoring</div>
                  <p className="text-sm">Monitor wallet balances for suspicious activity</p>
                </div>
                <div className="text-blue-700">
                  <div className="font-medium mb-1">User Status</div>
                  <p className="text-sm">Inactive users' wallets are automatically restricted</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Platform Balance Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-green-700">Total Platform Balance</span>
                <span className="text-xl font-bold text-green-900">{formatCurrency(stats.totalBalance)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-700">Average Wallet Balance</span>
                <span className="text-xl font-bold text-green-900">{formatCurrency(stats.averageBalance)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-700">Active Wallet Ratio</span>
                <span className="text-xl font-bold text-green-900">
                  {stats.totalWallets > 0 ? Math.round((stats.activeWallets / stats.totalWallets) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  // Export functionality can be added here
                  toast.success("Export feature coming soon!");
                }}
                className="w-full flex items-center justify-center px-4 py-3 bg-white border border-purple-300 text-purple-700 rounded-xl hover:bg-purple-50 transition-colors"
              >
                <FaCreditCard className="mr-2" />
                Export Wallet Report
              </button>
              <button
                onClick={() => {
                  // Bulk action functionality
                  toast.success("Bulk actions coming soon!");
                }}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <FaExchangeAlt className="mr-2" />
                Bulk Wallet Actions
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminWallets;
