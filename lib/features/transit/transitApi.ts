import baseApi from "@/lib/api/baseApi";
import { GetTransitRulesResponse, TTransitRule } from "@/lib/types";

export const transitApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransitRules: builder.query<GetTransitRulesResponse, { page?: number; limit?: number; searchTerm?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit) queryParams.append("limit", params.limit.toString());
          if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
        }
        return {
          url: `/transit-rules?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["TransitRule"],
    }),
    createTransitRule: builder.mutation<any, Partial<TTransitRule>>({
      query: (data) => ({
        url: "/transit-rules",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TransitRule"],
    }),
    deleteTransitRule: builder.mutation<any, string>({
      query: (id) => ({
        url: `/transit-rules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TransitRule"],
    }),
  }),
});

export const { useGetTransitRulesQuery, useCreateTransitRuleMutation, useDeleteTransitRuleMutation } = transitApi;
