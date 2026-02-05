import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/app/store";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token || localStorage.getItem("token");

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");

    return headers;
  },
  credentials: "include",
});

// Define the return type for our base query
type BaseQueryResult =
  | { error: FetchBaseQueryError; data?: undefined; meta?: FetchBaseQueryMeta }
  | { error?: undefined; data: unknown; meta?: FetchBaseQueryMeta };

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
): Promise<BaseQueryResult> => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 errors
  if (result.error && result.error.status === 401) {
    const url = typeof args === "string" ? args : (args as FetchArgs).url || "";

    // Don't logout for profile endpoint - let authSlice handle it
    if (!url.toString().includes("/profile")) {
      localStorage.removeItem("token");
      // Dispatch logout action dynamically to avoid circular dependency
      api.dispatch({ type: "auth/logout" });
    }
  }

  // Handle network errors
  if (result.error && result.error.status === "FETCH_ERROR") {
    console.error("Network error - could be CORS or backend down");

    // Return a custom error object
    return {
      error: {
        status: "CUSTOM_ERROR",
        data: "Network error. Please check your connection.",
      } as FetchBaseQueryError,
    };
  }

  // Handle backend error format
  if (result.data && typeof result.data === "object" && "success" in result.data) {
    const data = result.data as any;
    if (data.success === false) {
      return {
        error: {
          status: "CUSTOM_ERROR",
          data: data.message || "Request failed",
        } as FetchBaseQueryError,
      };
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Agent", "Admin", "Transaction", "Wallet"],
  endpoints: () => ({}),
});
