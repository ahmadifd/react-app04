import useAuth from "../../hooks/useAuth";

const Welcome = () => {
  const { username, isManager, isAdmin } = useAuth();
  const content = (
    <div className="container">
      <div>
        <h1>Welcome {username}!</h1>
      </div>
    </div>
  );
  return content;
};

export default Welcome;
