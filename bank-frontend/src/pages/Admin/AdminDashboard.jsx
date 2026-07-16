import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <main className="page">
      <h1>Admin Dashboard</h1>
      <p>Manage customers, accounts, and banking records.</p>

      <div className="dashboard-grid">
        <Link to="/admin/customers" className="card">
          <h2>Customers</h2>
          <p>Create, view, and delete customers.</p>
        </Link>

        <Link to="/admin/accounts" className="card">
          <h2>Accounts</h2>
          <p>View and manage all accounts.</p>
        </Link>

        <Link to="/admin/transactions" className="card">
          <h2>Transactions</h2>
          <p>Review banking activity.</p>
        </Link>
      </div>
    </main>
  );
}

export default AdminDashboard;