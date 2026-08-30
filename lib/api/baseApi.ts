import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://206.162.244.134:5711/api/v1",
  prepareHeaders: (headers) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (token) {
      headers.set("authorization", token);
    }

    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  tagTypes: ["User", "ADMIN", "Visa", "Subscription", "TransitRule", "CountryPolicy", "AiHistory"],
  endpoints: () => ({}),
});

export default baseApi;
