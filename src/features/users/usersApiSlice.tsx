import { apiSlice } from "../../app/api/apiSlice";
import { User } from "../../models/User";

//const usersAdapter = createEntityAdapter({});
//const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDataGridUsers: builder.mutation({
      query: ({ pageNumber, filter, sort, quickSearch, pageSize }) => ({
        url: "/users",
        method: "POST",
        body: {
          pageNumber,
          filter,
          sort,
          quickSearch,
          pageSize,
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
    addNewUser: builder.mutation({
      query: (user) => ({
        url: "/users/addUser",
        method: "POST",
        body: {
          ...user,
        },
      }),
    }),
  }),
});

export const { useGetDataGridUsersMutation, useAddNewUserMutation } =
  usersApiSlice;

//const selectDataGridUsersResult = usersApiSlice.endpoints.getDataGridUsers.
