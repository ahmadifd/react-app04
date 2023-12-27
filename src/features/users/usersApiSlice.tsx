import { apiSlice } from "../../app/api/apiSlice";
import { User } from "../../models/User";

//const usersAdapter = createEntityAdapter({});
//const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: ({ id }) => `/users/${id}`,
    }),
    getDataGridUsers: builder.mutation({
      query: ({ pageNumber, filter, sort, quickSearch, pageSize }) => ({
        url: "/users/getDataGridUsers",
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
        return responseData;
      },
    }),
    addNewUser: builder.mutation({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: {
          ...user,
        },
      }),
    }),
    editUser: builder.mutation({
      query: (user) => ({
        url: `/users`,
        method: "PATCH",
        body: {
          ...user,
        },
      }),
    }),
    changeActiveFieldForUser: builder.mutation({
      query: (user) => ({
        url: `/users/changeActiveFieldForUser`,
        method: "PATCH",
        body: {
          ...user,
        },
      }),
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users`,
        method: "DELETE",
        body: { id },
      }),
    }),
  }),
});

export const {
  useGetDataGridUsersMutation,
  useAddNewUserMutation,
  useGetUserQuery,
  useEditUserMutation,
  useDeleteUserMutation,
  useChangeActiveFieldForUserMutation,
} = usersApiSlice;

//const selectDataGridUsersResult = usersApiSlice.endpoints.getDataGridUsers.
