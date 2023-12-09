import {  Outlet, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";

const ShoppingLayout = () => {
  const navigate = useNavigate();

  const [sendLogout] = useSendLogoutMutation();

  const signOut = async () => {
    await sendLogout(null);
    navigate("/");
  };

  return (
    <>
      <div className="container">
        <div>
          <Outlet />
        </div>
        <div>
          <button className="btn btn-danger" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};
export default ShoppingLayout;
