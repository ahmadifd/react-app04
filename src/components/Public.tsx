import { Link } from "react-router-dom";

const Public = () => {
  const content = (
    <div className="container">
      <div>
        <div>Public-Header</div>
        <div>Public-Main</div>
        <div>
          <div>
            Public-Footer
            <Link to="/login"> Login</Link>
          </div>
        </div>
      </div>
    </div>
  );

  return content;
};

export default Public;
