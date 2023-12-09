import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { User } from "../../models/User";

const usersAdapter = createEntityAdapter({});
const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: "/users",
      }),
      transformResponse: (responseData: { data: User[] }) => {
        console.log(responseData);

        const loadedUsers = responseData.data.map((user) => {
          user.id = user._id;
          return user;
        });

        return usersAdapter.setAll(initialState, loadedUsers!);
      },
    }),
  }),
});

export const { useGetUsersQuery } = usersApiSlice;
