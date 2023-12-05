import { FC } from "react";
import { Outlet } from "react-router-dom";

interface IProps {
  allowedRoles: string[];
}

const RequireAuth: FC<IProps> = ({ allowedRoles }) => {
  let content = <Outlet />;

  return content;
};

export default RequireAuth;
