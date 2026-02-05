import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@/types";
import { authApi } from "@/api/authApi";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Check if token exists and is valid
const token = localStorage.getItem("token");
const initialState: AuthState = {
  user: null,
  token: token,
  isAuthenticated: !!token, // Auto-set authenticated if token exists
  isLoading: false,
  error: null,
};

// Async thunk to fetch user profile on app load
export const fetchUserProfile = createAsyncThunk("auth/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    // This will use the getProfile query from authApi
    return null; // Will be handled by RTK Query
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    // NEW: Update user info (for profile updates)
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // NEW: Set user from API response
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },

  // Handle extra reducers from RTK Query
  extraReducers: (builder) => {
    builder
      // Handle login success
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
        if (payload.success && payload.data) {
          state.user = payload.data.user;
          state.token = payload.data.token;
          state.isAuthenticated = true;
          state.error = null;
          localStorage.setItem("token", payload.data.token);
        }
      })

      // Handle register success
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, { payload }) => {
        if (payload.success && payload.data) {
          state.user = payload.data.user;
          state.token = payload.data.token;
          state.isAuthenticated = true;
          state.error = null;
          localStorage.setItem("token", payload.data.token);
        }
      })

      // Handle getProfile success
      .addMatcher(authApi.endpoints.getProfile.matchFulfilled, (state, { payload }) => {
        if (payload.success && payload.data) {
          state.user = payload.data;
          state.isAuthenticated = true;
          state.error = null;
        }
      })

      // Handle updateProfile success
      .addMatcher(authApi.endpoints.updateProfile.matchFulfilled, (state, { payload }) => {
        if (payload.success && payload.data && state.user) {
          state.user = { ...state.user, ...payload.data };
        }
      })

      // Handle auth errors
      .addMatcher(authApi.endpoints.login.matchRejected, (state, { payload }: any) => {
        state.error = payload?.data?.message || "Login failed";
        state.isLoading = false;
      })
      .addMatcher(authApi.endpoints.register.matchRejected, (state, { payload }: any) => {
        state.error = payload?.data?.message || "Registration failed";
        state.isLoading = false;
      })

      // Handle pending states
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )

      // Handle fulfilled states
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.isLoading = false;
        },
      )

      // Handle rejected states
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, { payload }: any) => {
          state.isLoading = false;
          // Don't override error if it's already set from specific matchers
          if (!state.error) {
            state.error = payload?.data?.message || "Something went wrong";
          }
        },
      );
  },
});

export const { setCredentials, logout, setLoading, setError, clearError, updateUser, setUser } = authSlice.actions;
export default authSlice.reducer;
