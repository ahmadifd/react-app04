import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const { isManager, isAdmin } = useAuth();

  return (
    <>
      <div className="container">
        {isManager || isAdmin ? (
          <Navigate to="/dash" />
        ) : (
          <Navigate to="/shopping" />
        )}
      </div>
    </>
  );
};

export default Home;
