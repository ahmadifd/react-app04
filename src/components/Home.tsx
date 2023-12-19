import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const { isManager, isAdmin } = useAuth();

  return (
    <>
      {isManager || isAdmin ? (
        <Navigate to="/dash" />
      ) : (
        <Navigate to="/shopping" />
      )}
    </>
  );
};

export default Home;
