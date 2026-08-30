import baseApi from "@/lib/api/baseApi";
import {
  GetSingleSubscriptionPlanResponse,
  GetSubscriptionPlansResponse,
  TSubscriptionPlan,
} from "@/lib/types";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionPlans: builder.query<GetSubscriptionPlansResponse, void>({
      query: () => "/subscription-plans",
      providesTags: ["Subscription"],
    }),
    deleteSubscriptionPlan: builder.mutation<any, string>({
      query: (id) => ({
        url: `/subscription-plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscription"],
    }),
    createSubscriptionPlan: builder.mutation<any, Partial<TSubscriptionPlan>>({
      query: (data) => ({
        url: "/subscription-plans",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),
    getSingleSubscriptionPlan: builder.query<GetSingleSubscriptionPlanResponse, string>({
      query: (id) => `/subscription-plans/${id}`,
      providesTags: (result, error, id) => [{ type: "Subscription", id }],
    }),
    updateSubscriptionPlan: builder.mutation<
      any,
      { id: string; data: Partial<TSubscriptionPlan> }
    >({
      query: ({ id, data }) => ({
        url: `/subscription-plans/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),
    createCheckoutSession: builder.mutation<any, { planId: string }>({
      query: (data) => ({
        url: "/subscription-plans/subscribe",
        method: "POST",
        body: data,
      }),
    }),
    confirmPayment: builder.query<any, string>({
      query: (sessionId) => `/subscription-plans/payment-success?session_id=${sessionId}`,
      providesTags: ["User"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.invalidateTags(["User", "Subscription"]));
        } catch (err) {}
      },
    }),
    getMySubscription: builder.query<any, void>({
      query: () => "/subscription-plans/my",
      providesTags: ["Subscription", "User"],
    }),
    cancelSubscription: builder.mutation<any, void>({
      query: () => ({
        url: "/subscription-plans/my/cancel",
        method: "PATCH",
      }),
      invalidatesTags: ["Subscription", "User"],
    }),
  }),
});

export const {
  useGetSubscriptionPlansQuery,
  useDeleteSubscriptionPlanMutation,
  useCreateSubscriptionPlanMutation,
  useGetSingleSubscriptionPlanQuery,
  useUpdateSubscriptionPlanMutation,
  useCreateCheckoutSessionMutation,
  useConfirmPaymentQuery,
  useGetMySubscriptionQuery,
  useCancelSubscriptionMutation,
} = subscriptionApi;
