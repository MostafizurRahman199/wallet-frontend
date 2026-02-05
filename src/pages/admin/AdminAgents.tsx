import React, { useState, useEffect, useMemo } from "react";
import { useGetAllAgentsQuery, useApproveAgentMutation, useSuspendAgentMutation } from "@/api/adminApi";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaCheck,
  FaTimes,
  FaUserTie,
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
  FaHourglassHalf,
  FaShieldAlt,
} from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

// Define Agent type based on your backend response
interface AgentType {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "agent";
  isActive: boolean;
  isApproved?: boolean;
  wallet?: {
    _id: string;
    balance: number;
    isBlocked: boolean;
  };
  totalCustomers?: number;
  totalTransactions?: number;
  commissionRate?: number;
  createdAt: string;
  updatedAt: string;
}

type SortField = "name" | "status" | "approval" | "date" | "balance" | "customers";
type SortDirection = "asc" | "desc";

const AdminAgents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const limit = 12;

  // API Queries
  const {
    data: agentsData,
    isLoading,
    error,
    refetch,
  } = useGetAllAgentsQuery({
    page,
    limit,
    search: searchTerm,
  });

  const [approveAgent, { isLoading: isApproving }] = useApproveAgentMutation();
  const [suspendAgent, { isLoading: isSuspending }] = useSuspendAgentMutation();

  // Extract agents and pagination
  const agents = agentsData?.data?.agents || [];
  const pagination = agentsData?.data?.pagination || {
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
  };

  // Sort and filter agents
  const filteredAndSortedAgents = useMemo(() => {
    let filtered = agents.filter((agent: AgentType) => {
      // Status filter
      if (statusFilter === "active" && !agent.isActive) return false;
      if (statusFilter === "inactive" && agent.isActive) return false;

      // Approval filter
      if (approvalFilter === "pending" && agent.isApproved !== false) return false;
      if (approvalFilter === "approved" && !agent.isApproved) return false;
      if (approvalFilter === "suspended" && agent.isActive) return false;

      return true;
    });

    // Sort agents
    filtered.sort((a: AgentType, b: AgentType) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "status":
          aValue = a.isActive;
          bValue = b.isActive;
          break;
        case "approval":
          aValue = a.isApproved;
          bValue = b.isApproved;
          break;
        case "date":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "balance":
          aValue = a.wallet?.balance || 0;
          bValue = b.wallet?.balance || 0;
          break;
        case "customers":
          aValue = a.totalCustomers || 0;
          bValue = b.totalCustomers || 0;
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
  }, [agents, statusFilter, approvalFilter, sortField, sortDirection]);

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

  // Handle approve agent
  const handleApproveAgent = async (agentId: string, agentName: string) => {
    const confirmed = await showConfirmationDialog(
      "Approve Agent",
      `Are you sure you want to approve ${agentName}? They will be able to start operating.`,
      "Yes, Approve Agent",
      "question",
    );

    if (confirmed) {
      try {
        Swal.fire({
          title: "Approving Agent...",
          text: "Please wait while we process your request",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await approveAgent(agentId).unwrap();

        Swal.fire({
          title: "Approved!",
          text: `Agent ${agentName} has been approved successfully`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        refetch();
      } catch (error: any) {
        Swal.fire({
          title: "Error!",
          text: error?.data?.message || "Failed to approve agent",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  // Handle suspend agent
  const handleSuspendAgent = async (agentId: string, agentName: string) => {
    const confirmed = await showConfirmationDialog(
      "Suspend Agent",
      `Are you sure you want to suspend ${agentName}? They will no longer be able to operate.`,
      "Yes, Suspend Agent",
      "warning",
    );

    if (confirmed) {
      try {
        Swal.fire({
          title: "Suspending Agent...",
          text: "Please wait while we process your request",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await suspendAgent(agentId).unwrap();

        Swal.fire({
          title: "Suspended!",
          text: `Agent ${agentName} has been suspended successfully`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        refetch();
      } catch (error: any) {
        Swal.fire({
          title: "Error!",
          text: error?.data?.message || "Failed to suspend agent",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  // Show agent details modal
  const showAgentDetails = (agent: AgentType) => {
    Swal.fire({
      title: `<strong>${agent.name}</strong>`,
      html: `
        <div class="text-left">
          <div class="flex items-center mb-4">
            <div class="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white mr-4">
              <i class="fas fa-user-tie"></i>
            </div>
            <div>
              <p class="text-lg font-semibold">${agent.email}</p>
              <p class="text-gray-600">${agent.phone}</p>
            </div>
          </div>
          
          <div class="space-y-3">
            <div class="flex items-center">
              <i class="fas fa-wallet text-gray-400 mr-3 w-5"></i>
              <span class="text-gray-700">Balance: ৳${agent.wallet?.balance.toFixed(2) || "0.00"}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-calendar-alt text-gray-400 mr-3 w-5"></i>
              <span class="text-gray-700">Joined: ${formatDate(agent.createdAt)}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-users text-gray-400 mr-3 w-5"></i>
              <span class="text-gray-700">Customers: ${agent.totalCustomers || 0}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-exchange-alt text-gray-400 mr-3 w-5"></i>
              <span class="text-gray-700">Transactions: ${agent.totalTransactions || 0}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-percentage text-gray-400 mr-3 w-5"></i>
              <span class="text-gray-700">Commission: ${agent.commissionRate || 0}%</span>
            </div>
          </div>
          
          <div class="mt-6 pt-6 border-t border-gray-200">
            <div class="flex justify-between items-center">
              <div>
                <span class="text-sm font-medium text-gray-500">Status</span>
                <div class="mt-1">
                  <span class="px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(agent.isActive)} text-white">
                    ${agent.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">Approval</span>
                <div class="mt-1">
                  <span class="px-3 py-1 rounded-full text-xs font-semibold ${getApprovalColor(agent.isApproved)} text-white">
                    ${getApprovalStatus(agent.isApproved)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: agent.isApproved ? "Suspend Agent" : "Approve Agent",
      confirmButtonColor: agent.isApproved ? "#ef4444" : "#10b981",
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
        if (agent.isApproved) {
          handleSuspendAgent(agent._id, agent.name);
        } else {
          handleApproveAgent(agent._id, agent.name);
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
          <div className=" border-red-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-100 rounded-xl mr-4">
                <FaExclamationTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-800 mb-1">Error Loading Agents</h2>
                <p className="text-red-600">Failed to load agents. Please try again.</p>
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

  // Get status color
  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-gradient-to-r from-green-500 to-green-600" : "bg-gradient-to-r from-red-500 to-red-600";
  };

  // Get approval color
  const getApprovalColor = (isApproved: boolean | undefined) => {
    if (isApproved === true) return "bg-gradient-to-r from-green-500 to-green-600";
    if (isApproved === false) return "bg-gradient-to-r from-yellow-500 to-yellow-600";
    return "bg-gradient-to-r from-gray-500 to-gray-600";
  };

  // Get approval status text
  const getApprovalStatus = (isApproved: boolean | undefined) => {
    if (isApproved === true) return "APPROVED";
    if (isApproved === false) return "PENDING";
    return "NOT APPLIED";
  };

  // Get approval icon
  const getApprovalIcon = (isApproved: boolean | undefined) => {
    if (isApproved === true) return <FaShieldAlt className="h-4 w-4" />;
    if (isApproved === false) return <FaHourglassHalf className="h-4 w-4" />;
    return <FaTimes className="h-4 w-4" />;
  };

  // Calculate stats
  const stats = useMemo(() => {
    const totalAgents = agents.length;
    const activeAgents = agents.filter((agent: AgentType) => agent.isActive).length;
    const pendingAgents = agents.filter((agent: AgentType) => agent.isApproved === false).length;
    const approvedAgents = agents.filter((agent: AgentType) => agent.isApproved === true).length;

    return {
      totalAgents,
      activeAgents,
      pendingAgents,
      approvedAgents,
    };
  }, [agents]);

  return (
    <div className="min-h-screen ">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mr-3">
                  <FaUserTie className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Agent Management</h1>
              </div>
              <p className="text-gray-600">Manage and approve agents on the platform</p>
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
                  placeholder="Search agents by name, email, or phone..."
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
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Approval Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={approvalFilter}
                onChange={(e) => setApprovalFilter(e.target.value)}
                className="text-black pl-10 block w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Approval Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-medium text-blue-600 mb-1">Total Agents</p>
              <p className="text-2xl font-bold text-blue-800">{stats.totalAgents}</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
              <p className="text-sm font-medium text-green-600 mb-1">Active Agents</p>
              <p className="text-2xl font-bold text-green-800">{stats.activeAgents}</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm font-medium text-yellow-600 mb-1">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-800">{stats.pendingAgents}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
              <p className="text-sm font-medium text-purple-600 mb-1">Approved</p>
              <p className="text-2xl font-bold text-purple-800">{stats.approvedAgents}</p>
            </div>
          </div>
        </div>

        {/* Agents Grid/Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Sort Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Agents</h3>
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
                  onClick={() => handleSort("approval")}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Approval{" "}
                  {sortField === "approval" &&
                    (sortDirection === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />)}
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading agents...</p>
            </div>
          ) : filteredAndSortedAgents.length === 0 ? (
            <div className="p-12 text-center">
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl inline-flex mb-4">
                <FaExclamationTriangle className="h-12 w-12 text-yellow-500" />
              </div>
              <p className="text-gray-700 font-medium mb-2">No agents found</p>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setApprovalFilter("all");
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
                {filteredAndSortedAgents.map((agent: AgentType) => (
                  <div
                    key={agent._id}
                    className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white mr-4">
                          <FaUserTie className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{agent.name}</h3>
                          <p className="text-sm text-gray-600">{agent.email}</p>
                        </div>
                      </div>
                      <button onClick={() => showAgentDetails(agent)} className="text-gray-400 hover:text-gray-600">
                        <FaEllipsisV />
                      </button>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm">
                        <FaPhone className="h-3 w-3 text-gray-400 mr-2" />
                        <span className="text-gray-700">{agent.phone}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <FaWallet className="h-3 w-3 text-gray-400 mr-2" />
                        <span className="text-gray-700">৳{agent.wallet?.balance.toFixed(2) || "0.00"}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <FaUserTie className="h-3 w-3 text-gray-400 mr-2" />
                        <span className="text-gray-700">Customers: {agent.totalCustomers || 0}</span>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(agent.isActive)} text-white`}
                        >
                          {agent.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getApprovalColor(agent.isApproved)} text-white flex items-center`}
                        >
                          {getApprovalIcon(agent.isApproved)}
                          <span className="ml-1">{getApprovalStatus(agent.isApproved)}</span>
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        {agent.isApproved ? (
                          <button
                            onClick={() => handleSuspendAgent(agent._id, agent.name)}
                            disabled={isSuspending}
                            className="w-full px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            Suspend Agent
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApproveAgent(agent._id, agent.name)}
                            disabled={isApproving}
                            className="w-full px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                          >
                            Approve Agent
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
                        Agent
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Wallet
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Approval
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
                    {filteredAndSortedAgents.map((agent: AgentType) => (
                      <tr key={agent._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white mr-3">
                              <FaUserTie className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{agent.name}</div>
                              <div className="text-sm text-gray-500">ID: {agent._id.slice(-8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-900">
                              <FaEnvelope className="h-3 w-3 mr-2 text-gray-400" />
                              {agent.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <FaPhone className="h-3 w-3 mr-2 text-gray-400" />
                              {agent.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <FaWallet className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium">৳{agent.wallet?.balance.toFixed(2) || "0.00"}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {agent.wallet?.isBlocked ? "Wallet Blocked" : "Wallet Active"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(agent.isActive)} text-white`}
                          >
                            {agent.isActive ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {getApprovalIcon(agent.isApproved)}
                            <span
                              className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${getApprovalColor(agent.isApproved)} text-white`}
                            >
                              {getApprovalStatus(agent.isApproved)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <FaCalendarAlt className="h-3 w-3 mr-2" />
                            {formatDate(agent.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => showAgentDetails(agent)}
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            {agent.isApproved ? (
                              <button
                                onClick={() => handleSuspendAgent(agent._id, agent.name)}
                                disabled={isSuspending}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Suspend Agent"
                              >
                                <FaTimes />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleApproveAgent(agent._id, agent.name)}
                                disabled={isApproving}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Approve Agent"
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
                    <span className="font-semibold">{pagination.total}</span> agents
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
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Agent Management Guide</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-blue-700">
                  <div className="font-medium mb-1">Approval Process</div>
                  <p className="text-sm">Agents must be approved before they can perform transactions</p>
                </div>
                <div className="text-blue-700">
                  <div className="font-medium mb-1">Suspension</div>
                  <p className="text-sm">Suspended agents cannot operate until reactivated</p>
                </div>
                <div className="text-blue-700">
                  <div className="font-medium mb-1">Commission</div>
                  <p className="text-sm">Agents earn commission on transactions they facilitate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAgents;
