import { apiSlice } from "@/api/apiSlice";
import { setCredentials, setUser, logout } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.success && data?.data) {
            dispatch(
              setCredentials({
                user: data.data.user,
                token: data.data.token,
              }),
            );
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),

    getProfile: builder.query({
      query: () => "/auth/profile",
      providesTags: ["User"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.success && data?.data) {
            console.log("Profile fetch successful:", data.data.name);
            dispatch(setUser(data.data));
          }
        } catch (error: any) {
          console.log("Profile fetch failed:", error?.error?.data || "Token invalid");
          // Only logout if it's a 401 error
          if (error?.error?.status === 401) {
            dispatch(logout());
          }
        }
      },
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useGetProfileQuery, useRegisterMutation } = authApi;
