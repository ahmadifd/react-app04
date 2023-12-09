import { Outlet } from "react-router-dom";

const ShopLayout = () => {
  return (
    <>
      <div className="container">
        <Outlet />
      </div>
    </>
  );
};
export default ShopLayout;
