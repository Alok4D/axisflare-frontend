import baseApi from "@/lib/api/baseApi";
import { GetDashboardSummaryResponse, GetRecentActivitiesResponse } from "@/lib/types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<GetDashboardSummaryResponse, void>({
      query: () => "/dashboard/summary",
      providesTags: ["AiHistory"], // Reusing a tag or adding a new one if needed, but summary usually depends on multiple things.
    }),
    getRecentActivities: builder.query<GetRecentActivitiesResponse, void>({
      query: () => "/dashboard/recent-activities",
    }),
  }),
});

export const { useGetDashboardSummaryQuery, useGetRecentActivitiesQuery } = dashboardApi;
