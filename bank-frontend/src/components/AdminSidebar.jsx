import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { logout } from "../utils/auth";

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    {
      name: "Dashboard",
      path: "/admin",
    },
    {
      name: "Customers",
      path: "/admin/customers",
    },
    {
      name: "Accounts",
      path: "/admin/accounts",
    },
    {
      name: "Transactions",
      path: "/admin/transactions",
    },
  ];

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <aside className="sidebar">
      <h2>Citibank</h2>

      <p className="sidebar-role">
        Administrator
      </p>

      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={
            location.pathname === link.path
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          {link.name}
        </Link>
      ))}

      <button
        type="button"
        className="sidebar-link logout logout-button"
        onClick={handleLogout}
      >
        Logout
      </button>
    </aside>
  );
}

export default AdminSidebar;