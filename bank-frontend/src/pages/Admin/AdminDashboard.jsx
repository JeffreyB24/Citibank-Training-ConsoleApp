import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <main className="page admin-dashboard-page">
      <section className="admin-hero">
        <div className="admin-hero-content">
          <p className="page-eyebrow">
            Administrative Portal
          </p>

          <h1>Bank Administration</h1>

          <p>
            Manage customers, accounts,
            transactions, and monitor the
            banking platform from a single
            secure dashboard.
          </p>
        </div>

        <div className="admin-status-card">
          <span className="status-dot" />
          System Status

          <strong>Online</strong>

          <small>
            Administrative services are
            operating normally.
          </small>
        </div>
      </section>

      <section className="admin-summary-grid">
        <article className="admin-summary-card">
          <div className="summary-icon customers-icon">
            👥
          </div>

          <div>
            <span>Customers</span>

            <strong>Manage</strong>

            <p>
              View customer information and
              maintain banking records.
            </p>
          </div>
        </article>

        <article className="admin-summary-card">
          <div className="summary-icon accounts-icon">
            💳
          </div>

          <div>
            <span>Accounts</span>

            <strong>Manage</strong>

            <p>
              Review balances and account
              information.
            </p>
          </div>
        </article>

        <article className="admin-summary-card">
          <div className="summary-icon transactions-icon">
            💸
          </div>

          <div>
            <span>Transactions</span>

            <strong>Review</strong>

            <p>
              Monitor deposits,
              withdrawals and transfers.
            </p>
          </div>
        </article>
      </section>

      <section className="admin-actions">
        <div className="section-heading-row">
          <div>
            <p className="page-eyebrow">
              Administration
            </p>

            <h2>Management Center</h2>

            <p>
              Select an area below to begin
              managing your banking
              platform.
            </p>
          </div>
        </div>

        <div className="admin-card-grid">
          <Link
            to="/admin/customers"
            className="admin-action-card"
          >
            <div className="admin-card-icon">
              👥
            </div>

            <h2>Customer Management</h2>

            <p>
              Create customers, update
              information, and remove
              customer records.
            </p>

            <span>
              Open Customer Manager →
            </span>
          </Link>

          <Link
            to="/admin/accounts"
            className="admin-action-card"
          >
            <div className="admin-card-icon">
              💳
            </div>

            <h2>Account Management</h2>

            <p>
              View all accounts, balances,
              and banking relationships.
            </p>

            <span>
              Open Account Manager →
            </span>
          </Link>

          <Link
            to="/admin/transactions"
            className="admin-action-card"
          >
            <div className="admin-card-icon">
              📈
            </div>

            <h2>Transaction Management</h2>

            <p>
              Review deposits,
              withdrawals, transfers, and
              account activity.
            </p>

            <span>
              Open Transaction Manager →
            </span>
          </Link>
        </div>
      </section>

      <section className="admin-security-panel">
        <div className="admin-security-icon">
          ✓
        </div>

        <div>
          <h2>
            Secure Administrative Access
          </h2>

          <p>
            Administrative actions are
            protected through role-based
            authentication and secure API
            communication.
          </p>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;