import baseApi from "@/lib/api/baseApi";
import { GetSingleVisaResponse, GetVisaResponse, TVisaType } from "@/lib/types";

export const visaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVisas: builder.query<GetVisaResponse, { destinationCountry?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.destinationCountry) queryParams.append("destinationCountry", params.destinationCountry);
        return `/visa?${queryParams.toString()}`;
      },
      providesTags: ["Visa"],
    }),
    getSingleVisa: builder.query<GetSingleVisaResponse, string>({
      query: (id) => `/visa/${id}`,
      providesTags: (result, error, id) => [{ type: "Visa", id }],
    }),
    createVisa: builder.mutation<any, Partial<TVisaType>>({
      query: (data) => ({
        url: "/visa/create-visa",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Visa"],
    }),
    updateVisa: builder.mutation<any, { id: string; data: Partial<TVisaType> }>({
      query: ({ id, data }) => ({
        url: `/visa/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Visa"],
    }),
    deleteVisa: builder.mutation<any, string>({
      query: (id) => ({
        url: `/visa/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Visa"],
    }),
  }),
});

export const {
  useGetVisasQuery,
  useGetSingleVisaQuery,
  useCreateVisaMutation,
  useUpdateVisaMutation,
  useDeleteVisaMutation,
} = visaApi;
