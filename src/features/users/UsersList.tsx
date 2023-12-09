import { useGetUsersQuery } from "./usersApiSlice";

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList");

  let content;
  if (isLoading) return <h1>...isLoading</h1>;
  else if (isError) {
    content = (
      <div className="container">
        <div className="alert alert-danger">
          {`${(error as { data: { message: string } })?.data?.message} - `}
        </div>
      </div>
    );
  } else if (isSuccess) {
    content = <div>{users.ids}</div>;
  }

  return content;
};

export default UsersList;
