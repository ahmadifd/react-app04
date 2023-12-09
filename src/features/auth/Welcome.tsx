import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Welcome = () => {
  const { username } = useAuth();

  const content = (
    <div className="container">
      <div>
        <h1>Welcome {username}!</h1>
        <p>
          <Link to="/dash/users">View User Settings</Link>
        </p>
      </div>
    </div>
  );
  return content;
};

export default Welcome;
