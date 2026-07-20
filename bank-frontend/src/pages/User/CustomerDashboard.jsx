import { Link } from "react-router-dom";

function CustomerDashboard() {
  const username =
    localStorage.getItem("username") || "Customer";

  return (
    <main className="page customer-dashboard">

      <section className="dashboard-hero">

        <div>

          <p className="dashboard-greeting">
            Welcome Back
          </p>

          <h1>{username}</h1>

          <p className="dashboard-subtitle">
            Manage your accounts, transfer money,
            and monitor your finances from one place.
          </p>

        </div>

        <div className="dashboard-balance-card">

          <span>Total Relationship</span>

          <h2>$152,480.22</h2>

          <p>All linked accounts</p>

        </div>

      </section>

      <section className="dashboard-stats">

        <div className="stat-card">

          <h3>Checking</h3>

          <strong>$8,425.19</strong>

          <span>Available Balance</span>

        </div>

        <div className="stat-card">

          <h3>Savings</h3>

          <strong>$144,055.03</strong>

          <span>Total Savings</span>

        </div>

        <div className="stat-card">

          <h3>Security</h3>

          <strong>Protected</strong>

          <span>Account Secure</span>

        </div>

      </section>

      <section className="quick-actions">

        <h2>Quick Actions</h2>

        <div className="dashboard-grid">

          <Link
            to="/customer/accounts"
            className="card dashboard-action"
          >

            <div className="action-icon">💳</div>

            <h2>My Accounts</h2>

            <p>
              View balances, account information,
              and account details.
            </p>

          </Link>

          <Link
            to="/customer/transactions"
            className="card dashboard-action"
          >

            <div className="action-icon">💸</div>

            <h2>Transfer Money</h2>

            <p>
              Deposit, withdraw, and transfer funds
              between accounts.
            </p>

          </Link>

          <Link
            to="/customer/history"
            className="card dashboard-action"
          >

            <div className="action-icon">📄</div>

            <h2>Transaction History</h2>

            <p>
              Review all recent deposits,
              withdrawals and transfers.
            </p>

          </Link>

        </div>

      </section>

      <section className="customer-info-panels">

        <div className="panel">

          <h2>Banking Benefits</h2>

          <ul className="benefits-list">
            <li>✔ FDIC Insured Deposits</li>
            <li>✔ Secure Online Banking</li>
            <li>✔ Instant Internal Transfers</li>
            <li>✔ 24/7 Account Access</li>
          </ul>

        </div>

        <div className="panel">

          <h2>Need Assistance?</h2>

          <p>
            Our customer support specialists are
            available 24 hours a day to assist
            with your banking needs.
          </p>

          <button className="primary-button">
            Contact Support
          </button>

        </div>

      </section>

    </main>
  );
}

export default CustomerDashboard;