import { apiSlice } from "./apiSlice";
import { User } from "@/types";

interface LoginRequest {
  phone: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  phone: string;
  password: string;
  role?: "user" | "agent";
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

interface UpdateProfileRequest {
  name?: string;
  phone?: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Register endpoint
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    // Login endpoint
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Get profile endpoint
    getProfile: builder.query<ProfileResponse, void>({
      query: () => "/auth/profile",
      providesTags: ["User"],
    }),

    // Update profile endpoint
    updateProfile: builder.mutation<ProfileResponse, UpdateProfileRequest>({
      query: (userData) => ({
        url: "/auth/profile",
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // Change password endpoint
    changePassword: builder.mutation<{ success: boolean; message: string }, ChangePasswordRequest>({
      query: (passwords) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body: passwords,
      }),
    }),

    // Logout endpoint
    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useLogoutMutation,
} = authApi;
