import { Outlet, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";

const DashLayout = () => {
  const navigate = useNavigate();

  const [sendLogout] = useSendLogoutMutation();

  const signOut = async () => {
    await sendLogout(null);
    navigate("/");
  };

  return (
    <>
      <div>
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
export default DashLayout;
