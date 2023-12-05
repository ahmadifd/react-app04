import { apiSlice } from "../../app/api/apiSlice";


export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => {
        return {
          url: "/auth/login",
          method: "POST",
          body: { ...credentials },
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          // setInterval(() => {
          //   console.log("Hello");
          // }, 5000);
          //console.log("******************************************");
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;
