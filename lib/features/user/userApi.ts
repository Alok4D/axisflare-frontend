/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "@/lib/api/baseApi";
import { GetMeResponse, GetUsersResponse } from "@/lib/types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<GetMeResponse, void>({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    getUsers: builder.query<GetUsersResponse, { page?: number; limit?: number; searchTerm?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit) queryParams.append("limit", params.limit.toString());
          if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
        }
        return {
          url: `/users?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
    }),
    updateProfile: builder.mutation<any, FormData>({
      query: (data) => ({
        url: "/users/update-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useCreateUserMutation,
  useGetUsersQuery,
  useUpdateProfileMutation,
  useDeleteUserMutation,
} = userApi;


