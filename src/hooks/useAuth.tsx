import { jwtDecode } from "jwt-decode";
import { useAppSelector } from "../app/store";
import { selectCurrentToken } from "../features/auth/authSlice";

const useAuth = () => {
  const token = useAppSelector(selectCurrentToken);
  let isManager = false;
  let isAdmin = false;
  let status = "User";

  if (token) {
    const decoded = jwtDecode(token);
    const { username, roles } = (
      decoded as { UserInfo: { username: string; roles: string[] } }
    ).UserInfo;

    isManager = roles.includes("Manager");
    isAdmin = roles.includes("Admin");

    if (isManager) status = "Manager";
    if (isAdmin) status = "Admin";

    return { username, roles, status, isManager, isAdmin };
  }

  return { username: "", roles: [], isManager, isAdmin, status };
};

export default useAuth;
