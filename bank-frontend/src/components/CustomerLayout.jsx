import { Outlet } from "react-router-dom";
import CustomerNavbar from "./CustomerNavbar";

function CustomerLayout() {
  return (
    <>
      <CustomerNavbar />
      <Outlet />
    </>
  );
}

export default CustomerLayout;