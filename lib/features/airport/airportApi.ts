import baseApi from "@/lib/api/baseApi";
import { GetAirportRoutesResponse, GetAirportsResponse } from "@/lib/types";

export const airportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAirports: builder.query<GetAirportsResponse, string>({
      query: (searchTerm) => ({
        url: `/airport?q=${searchTerm}`,
        method: "GET",
      }),
    }),
    getAirportRoutes: builder.query<GetAirportRoutesResponse, { origin: string; destination: string; name?: string }>({
      query: ({ origin, destination, name }) => ({
        url: `/airport-routes?origin=${origin}&destination=${destination}${name ? `&name=${name}` : ""}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAirportsQuery, useLazyGetAirportsQuery, useGetAirportRoutesQuery } = airportApi;
