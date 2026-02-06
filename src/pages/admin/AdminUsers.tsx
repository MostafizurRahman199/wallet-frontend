import React, { useState, useEffect, useMemo } from "react";
import { useGetAllUsersQuery, useBlockUserMutation, useUnblockUserMutation } from "@/api/adminApi";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaBan,
  FaCheck,
  FaUser,
  FaUserTie,
  FaUserShield,
  FaWallet,
  FaExclamationTriangle,
  FaSync,
  FaEllipsisV,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

// Define User type based on your backend response
interface UserType {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "agent" | "admin";
  isActive: boolean;
  wallet?: {
    _id: string;
    balance: number;
    isBlocked: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

type SortField = "name" | "role" | "status" | "date" | "balance";
type SortDirection = "asc" | "desc";

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const limit = 12;

  // API Queries
  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useGetAllUsersQuery({
    page,
    limit,
    search: searchTerm,
  });

  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
  const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();

  // Extract users and pagination
  const users = usersData?.data?.users || [];
  const pagination = usersData?.data?.pagination || {
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
  };

  // Sort and filter users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter((user: UserType) => {
      // Role filter
      if (roleFilter !== "all" && user.role !== roleFilter) return false;
      // Status filter
      if (statusFilter === "active" && !user.isActive) return false;
      if (statusFilter === "inactive" && user.isActive) return false;
      return true;
    });

    // Sort users
    filtered.sort((a: UserType, b: UserType) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "role":
          aValue = a.role;
          bValue = b.role;
          break;
        case "status":
          aValue = a.isActive;
          bValue = b.isActive;
          break;
        case "date":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "balance":
          aValue = a.wallet?.balance || 0;
          bValue = b.wallet?.balance || 0;
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
  }, [users, roleFilter, statusFilter, sortField, sortDirection]);

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

  // Handle block user with SweetAlert2
  const handleBlockUser = async (userId: string, userName: string) => {
    const confirmed = await showConfirmationDialog(
      "Block User",
      `Are you sure you want to block ${userName}? This action will also block their wallet.`,
      "Yes, Block User",
      "warning",
    );

    if (confirmed) {
      try {
        Swal.fire({
          title: "Blocking User...",
          text: "Please wait while we process your request",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await blockUser(userId).unwrap();

        Swal.fire({
          title: "Blocked!",
          text: `User ${userName} has been blocked successfully`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        refetch();
      } catch (error: any) {
        Swal.fire({
          title: "Error!",
          text: error?.data?.message || "Failed to block user",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  // Handle unblock user with SweetAlert2
  const handleUnblockUser = async (userId: string, userName: string) => {
    const confirmed = await showConfirmationDialog(
      "Unblock User",
      `Are you sure you want to unblock ${userName}? This action will also unblock their wallet.`,
      "Yes, Unblock User",
      "question",
    );

    if (confirmed) {
      try {
        Swal.fire({
          title: "Unblocking User...",
          text: "Please wait while we process your request",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await unblockUser(userId).unwrap();

        Swal.fire({
          title: "Unblocked!",
          text: `User ${userName} has been unblocked successfully`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        refetch();
      } catch (error: any) {
        Swal.fire({
          title: "Error!",
          text: error?.data?.message || "Failed to unblock user",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  // Show user details modal with SweetAlert2
  const showUserDetails = (user: UserType) => {
    Swal.fire({
      title: `<strong>${user.name}</strong>`,
      html: `
        <div class="text-left">
          <div class="flex items-center mb-4">
            <div class="p-3 rounded-xl ${getRoleColor(user.role)} text-white mr-4">
              ${
                user.role === "admin"
                  ? '<i class="fas fa-user-shield"></i>'
                  : user.role === "agent"
                    ? '<i class="fas fa-user-tie"></i>'
                    : '<i class="fas fa-user"></i>'
              }
            </div>
            <div>
              <p class="text-lg font-semibold">${user.email}</p>
              <p class="text-gray-600">${user.phone}</p>
            </div>
          </div>
          
          <div class="space-y-3">
            <div class="flex items-center">
              <i class="fas fa-wallet text-gray-400 mr-3 w-5"></i>
              <span class="text-gray-700">Balance: ৳${user.wallet?.balance.toFixed(2) || "0.00"}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-calendar-alt text-gray-400 mr-3 w-5"></i>
              <span class="text-gray-700">Joined: ${formatDate(user.createdAt)}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-user-circle text-gray-400 mr-3 w-5"></i>
              <span class="text-gray-700">Role: <span class="font-semibold">${user.role.toUpperCase()}</span></span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-power-off text-gray-400 mr-3 w-5"></i>
              <span class="text-gray-700">Status: 
                <span class="ml-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.isActive)} text-white">
                  ${user.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </span>
            </div>
          </div>
        </div>
      `,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: user.isActive ? "Block User" : "Unblock User",
      confirmButtonColor: user.isActive ? "#ef4444" : "#10b981",
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
        if (user.isActive) {
          handleBlockUser(user._id, user.name);
        } else {
          handleUnblockUser(user._id, user.name);
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
      <div className="min-h-screen  p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className=" border border-red-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-100 rounded-xl mr-4">
                <FaExclamationTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-800 mb-1">Error Loading Users</h2>
                <p className="text-red-600">Failed to load users. Please try again.</p>
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

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <FaUserShield className="h-5 w-5" />;
      case "agent":
        return <FaUserTie className="h-5 w-5" />;
      default:
        return <FaUser className="h-5 w-5" />;
    }
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

  // Get status color
  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gradient-to-r from-red-500 to-red-600";
  };

  return (
    <div className="min-h-screen ">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center mb-2">
                <div className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl mr-3">
                  <HiOutlineUserGroup className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              </div>
              <p className="text-gray-600">Manage all registered users on the platform</p>
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
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-black pl-10 block w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-black pl-10 block w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="agent">Agents</option>
                <option value="admin">Admins</option>
              </select>
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
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-medium text-blue-600 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-blue-800">{pagination.total}</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
              <p className="text-sm font-medium text-green-600 mb-1">Active Users</p>
              <p className="text-2xl font-bold text-green-800">
                {users.filter((user: UserType) => user.isActive).length}
              </p>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-medium text-red-600 mb-1">Inactive Users</p>
              <p className="text-2xl font-bold text-red-800">
                {users.filter((user: UserType) => !user.isActive).length}
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
              <p className="text-sm font-medium text-purple-600 mb-1">Showing</p>
              <p className="text-md md:text-xl font-bold text-purple-800">{filteredAndSortedUsers.length} users</p>
            </div>
          </div>
        </div>

        {/* Users Grid/Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Sort Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Users</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Name{" "}
                  {sortField === "name" &&
                    (sortDirection === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />)}
                </button>
                <button
                  onClick={() => handleSort("date")}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Date{" "}
                  {sortField === "date" &&
                    (sortDirection === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />)}
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
            </div>
          ) : filteredAndSortedUsers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl inline-flex mb-4">
                <FaExclamationTriangle className="h-12 w-12 text-yellow-500" />
              </div>
              <p className="text-gray-700 font-medium mb-2">No users found</p>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("all");
                  setStatusFilter("all");
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
                {filteredAndSortedUsers.map((user: UserType) => (
                  <div
                    key={user._id}
                    className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`p-3 rounded-xl ${getRoleColor(user.role)} text-white mr-4`}>
                          {getRoleIcon(user.role)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <button onClick={() => showUserDetails(user)} className="text-gray-400 hover:text-gray-600">
                        <FaEllipsisV />
                      </button>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm">
                        <FaPhone className="h-3 w-3 text-gray-400 mr-2" />
                        <span className="text-black">{user.phone}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <FaWallet className="h-3 w-3 text-gray-400 mr-2" />
                        <span className="text-black">৳{user.wallet?.balance.toFixed(2) || "0.00"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.isActive)} text-white`}
                      >
                        {user.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                      <div className="flex space-x-2">
                        {user.isActive ? (
                          <button
                            onClick={() => handleBlockUser(user._id, user.name)}
                            disabled={isBlocking}
                            className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            Block
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnblockUser(user._id, user.name)}
                            disabled={isUnblocking}
                            className="px-3 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                          >
                            Unblock
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
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Wallet Balance
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedUsers.map((user: UserType) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${getRoleColor(user.role)} text-white mr-3`}>
                              {getRoleIcon(user.role)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <FaEnvelope className="h-3 w-3 mr-1" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)} text-white`}
                          >
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <FaWallet className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium text-black">৳{user.wallet?.balance.toFixed(2) || "0.00"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.isActive)} text-white`}
                          >
                            {user.isActive ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <FaCalendarAlt className="h-3 w-3 mr-2" />
                            {formatDate(user.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => showUserDetails(user)}
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            {user.isActive ? (
                              <button
                                onClick={() => handleBlockUser(user._id, user.name)}
                                disabled={isBlocking}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Block User"
                              >
                                <FaBan />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUnblockUser(user._id, user.name)}
                                disabled={isUnblocking}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Unblock User"
                              >
                                <FaCheck />
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
                    <span className="font-semibold">{pagination.total}</span> users
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
              <FaExclamationTriangle className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Important Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-blue-700">
                  <div className="font-medium mb-1">Blocking Users</div>
                  <p className="text-sm">Blocking a user will also block their wallet automatically</p>
                </div>
                <div className="text-blue-700">
                  <div className="font-medium mb-1">Unblocking Users</div>
                  <p className="text-sm">Unblocking will restore both user and wallet access</p>
                </div>
                <div className="text-blue-700">
                  <div className="font-medium mb-1">Agent Approval</div>
                  <p className="text-sm">Agents require manual approval before they can operate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
