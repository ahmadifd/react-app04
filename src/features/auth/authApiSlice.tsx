import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3500",
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => {
        return {
          url: "/auth",
          method: "POST",
          body: { ...credentials },
        };
      },
      // async onQueryStarted(arg, { dispatch, queryFulfilled }) {
      //   try {
      //     console.log("******************************************");
      //   } catch (err) {
      //     console.log(err);
      //   }
      // },
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;
