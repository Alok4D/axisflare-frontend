import baseApi from "@/lib/api/baseApi";
import {
  CreateCountryPolicyResponse,
  GetCountryPoliciesResponse,
  GetSingleCountryPolicyResponse,
  TCountryPolicy,
  UpdateCountryPolicyResponse,
} from "@/lib/types";

export const countryPolicyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCountryPolicies: builder.query<
      GetCountryPoliciesResponse,
      Record<string, any> | void
    >({
      query: (params) => ({
        url: "/country-policies",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["CountryPolicy"],
    }),
    getSingleCountryPolicy: builder.query<GetSingleCountryPolicyResponse, string>({
      query: (id) => ({
        url: `/country-policies/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "CountryPolicy", id }],
    }),
    deleteCountryPolicy: builder.mutation<any, string>({
      query: (id) => ({
        url: `/country-policies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CountryPolicy"],
    }),
    createCountryPolicy: builder.mutation<
      CreateCountryPolicyResponse,
      Partial<TCountryPolicy>
    >({
      query: (data) => ({
        url: "/country-policies",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CountryPolicy"],
    }),
    updateCountryPolicy: builder.mutation<
      UpdateCountryPolicyResponse,
      { id: string; data: Partial<TCountryPolicy> }
    >({
      query: ({ id, data }) => ({
        url: `/country-policies/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "CountryPolicy",
        { type: "CountryPolicy", id },
      ],
    }),
  }),
});

export const {
  useGetCountryPoliciesQuery,
  useGetSingleCountryPolicyQuery,
  useDeleteCountryPolicyMutation,
  useCreateCountryPolicyMutation,
  useUpdateCountryPolicyMutation,
} = countryPolicyApi;
