import { Link } from "react-router-dom";

function CustomerDashboard() {
  return (
    <main className="page">
      <h1>Customer Dashboard</h1>
      <p>View and manage your banking accounts.</p>

      <div className="dashboard-grid">
        <Link to="/customer/accounts" className="card">
          <h2>My Accounts</h2>
          <p>View checking and savings accounts.</p>
        </Link>

        <Link to="/customer/transactions" className="card">
          <h2>Banking Actions</h2>
          <p>Deposit, withdraw, and transfer money.</p>
        </Link>

        <Link to="/customer/history" className="card">
          <h2>Transaction History</h2>
          <p>Review recent account activity.</p>
        </Link>
      </div>
    </main>
  );
}

export default CustomerDashboard;