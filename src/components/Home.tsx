import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/store";
import { logOut } from "../features/auth/authSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const signOut = async () => {
    dispatch(logOut());
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
