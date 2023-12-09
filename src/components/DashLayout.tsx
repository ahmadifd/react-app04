import { Outlet } from "react-router-dom";

const DashLayout = () => {
  return (
    <>
      <div className="container">
        <Outlet />
      </div>
    </>
  );
};
export default DashLayout;
