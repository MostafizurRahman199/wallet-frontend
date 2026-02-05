// src/types/user.types.ts
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "agent" | "admin";
  isActive: boolean;
  isVerified: boolean;
  wallet?: {
    _id: string;
    balance: number;
    isBlocked: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}
