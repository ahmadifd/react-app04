import { Link, Outlet } from "react-router-dom";
import usePersist from "../../hooks/usePersist";
import { useAppSelector } from "../../app/store";
import { selectCurrentToken } from "./authSlice";
import { useEffect, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useAppSelector(selectCurrentToken);
  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      await refresh(null);
    };

    if (!token && persist) verifyRefreshToken();
  }, []);

  let content;
  if (!persist) {
    content = <Outlet />;
  } else if (isLoading) {
    content = <h1>...isLoading</h1>;
  } else if (isError) {
    content = (
      <div className="container">
        <div className="alert alert-danger">
          {`${(error as { data: { message: number } }).data.message} - `}
          <Link to="/login">Please login again</Link>.
        </div>
      </div>
    );
  } else if (isSuccess) {
    content = <Outlet />;
  } else if (token && isUninitialized) {
    content = <Outlet />;
  }

  return content;
};
export default PersistLogin;
