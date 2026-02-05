export type UserRole = "admin" | "user" | "agent";

export interface User {
  _id: string;
  name: string;
  phone: string;
  role: UserRole;
  wallet?: string;
  isActive: boolean;
  isApproved: boolean;
  commissionRate: number;
  walletBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Agent extends User {
  commissionRate: number;
  totalCommission: number;
  isApproved: boolean;
}

export interface Transaction {
  _id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  type: "deposit" | "withdraw" | "send" | "receive" | "cash_in" | "cash_out";
  status: "pending" | "completed" | "failed";
  fee: number;
  description?: string;
  agentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
