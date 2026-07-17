import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { logout } from "../utils/auth";

function CustomerNavbar() {
  const navigate = useNavigate();

  const username =
    localStorage.getItem("username");

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <h2>Citibank Training</h2>

      <div className="nav-links">
        <span>
          Welcome, {username || "Customer"}
        </span>

        <NavLink to="/customer">
          Dashboard
        </NavLink>

        <NavLink to="/customer/accounts">
          My Accounts
        </NavLink>

        <NavLink to="/customer/transactions">
          Banking
        </NavLink>

        <NavLink to="/customer/history">
          History
        </NavLink>

        <button
          type="button"
          className="nav-logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default CustomerNavbar;