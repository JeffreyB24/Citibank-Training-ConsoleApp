import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>Citibank Training</h2>

      <div className="nav-links">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/customers">Customers</NavLink>
        <NavLink to="/accounts">Accounts</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;