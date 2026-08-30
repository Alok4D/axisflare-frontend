import baseApi from "@/lib/api/baseApi";
import { GetAiHistoryResponse, GetSingleAiHistoryResponse } from "@/lib/types";

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiHistory: builder.query<GetAiHistoryResponse, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/ai/history",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["AiHistory"],
    }),
    getSingleAiHistory: builder.query<GetSingleAiHistoryResponse, string>({
      query: (id) => ({
        url: `/ai/history/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "AiHistory", id }],
    }),
    deleteAiHistory: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/ai/history/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AiHistory"],
    }),
    createAiAnalysis: builder.mutation<any, any>({
      query: (data) => ({
        url: "/ai/travel-analysis",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AiHistory"],
    }),
  }),
});

export const { 
  useGetAiHistoryQuery, 
  useGetSingleAiHistoryQuery,
  useDeleteAiHistoryMutation,
  useCreateAiAnalysisMutation 
} = aiApi;
