import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { User } from "../../models/User";

//const usersAdapter = createEntityAdapter({});
//const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDataGridUsers: builder.mutation({
      query: ({ pagenumber, filter, sort, quickserarch }) => ({
        url: "/users",
        method: "POST",
        body: {
          pagenumber,
          filter,
          sort,
          quickserarch,
        },
      }),
      transformResponse: (responseData: {
        data: {
          totalCount: number;
          next: number;
          users: User[];
        };
      }) => {
        const loadedUsers = responseData.data?.users?.map((user) => {
          user.id = user._id;
          return user;
        });
        responseData.data.users = loadedUsers;
        //console.log(responseData);
        return responseData;
        //usersAdapter.setAll(initialState, loadedUsers!);
      },
    }),
  }),
});

export const { useGetDataGridUsersMutation } = usersApiSlice;

//const selectDataGridUsersResult = usersApiSlice.endpoints.getDataGridUsers.
