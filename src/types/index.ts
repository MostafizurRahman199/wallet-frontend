export type UserRole = "admin" | "user" | "agent";

export interface User {
  _id: string;
  name: string;
  phone: string;
  role: UserRole;
  wallet?: string;
  isActive: boolean;
  isApproved: boolean;
  commissionRate?: number;
  walletBalance?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Agent extends User {
  commissionRate: number;
  totalCommission: number;
  isApproved: boolean;
}

// Transaction Types based on your backend
export type TransactionType = "DEPOSIT" | "WITHDRAW" | "SEND_MONEY" | "CASH_IN" | "CASH_OUT" | "COMMISSION";

export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED" | "REVERSED";

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
  type: TransactionType;
  status: TransactionStatus;
  description?: string;
  balanceBefore: number;
  balanceAfter: number;
  initiatedBy: TransactionUser;
  createdAt: string;
  updatedAt: string;
}

// For backward compatibility - you can remove these old types once you update all components
export interface OldTransaction {
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

// New types for wallet and transactions
export interface WalletBalance {
  balance: number;
  isBlocked: boolean;
  user: string;
}

export interface PaginatedTransactions {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CommissionResponse {
  commissions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form request types
export interface SendMoneyRequest {
  receiverPhone: string;
  amount: number;
}

export interface CashOutRequest {
  agentPhone: string;
  amount: number;
}

export interface TopUpRequest {
  amount: number;
}

export interface AgentCashInRequest {
  userPhone: string;
  amount: number;
}


// Add these to your existing types

export enum PAYMENT_STATUS {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED"
}

export interface Payment {
  _id: string;
  user: string;
  transactionId: string;
  amount: number;
  paymentGatewayData?: any;
  status: PAYMENT_STATUS;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInitResponse {
  success: boolean;
  message: string;
  data: {
    paymentId: string;
    transactionId: string;
    paymentUrl: string;
  };
}

export interface PaymentHistoryResponse {
  success: boolean;
  message: string;
  data: {
    payments: Payment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}