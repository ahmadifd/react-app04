import { useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";

const Home = () => {
  const navigate = useNavigate();

  const [sendLogout] = useSendLogoutMutation();

  const signOut = async () => {
    await sendLogout(null);
    navigate("/");
  };

  return (
    <>
      <div className="container">
        <h1>Home</h1>
        <br />
        <p>You are logged in!</p>
        <br />
        <button className="btn btn-danger" onClick={signOut}>
          Sign Out
        </button>
      </div>
    </>
  );
};

export default Home;
