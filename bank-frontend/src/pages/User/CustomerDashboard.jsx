import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import bankApi from "../../api/bankApi";

function CustomerDashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const username =
    localStorage.getItem("username") || "Customer";

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    setLoadingAccounts(true);
    setErrorMessage("");

    try {
      const response = await bankApi.get("/accounts/me");

      setAccounts(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(error);
      setAccounts([]);
      setErrorMessage(
        "Unable to load your account balances."
      );
    } finally {
      setLoadingAccounts(false);
    }
  }

  function formatMoney(amount) {
    return Number(amount || 0).toLocaleString(
      "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    );
  }

  function normalizeAccountType(accountType) {
    return String(accountType || "")
      .trim()
      .toUpperCase();
  }

  const accountSummary = useMemo(() => {
    return accounts.reduce(
      (summary, account) => {
        const balance = Number(
          account.balance || 0
        );

        const accountType =
          normalizeAccountType(
            account.accountType
          );

        summary.totalBalance += balance;

        if (
          accountType.includes("CHECKING")
        ) {
          summary.checkingBalance += balance;
          summary.checkingAccounts += 1;
        }

        if (
          accountType.includes("SAVINGS")
        ) {
          summary.savingsBalance += balance;
          summary.savingsAccounts += 1;
        }

        return summary;
      },
      {
        totalBalance: 0,
        checkingBalance: 0,
        savingsBalance: 0,
        checkingAccounts: 0,
        savingsAccounts: 0,
      }
    );
  }, [accounts]);

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

          <h2>
            {loadingAccounts
              ? "Loading..."
              : formatMoney(
                  accountSummary.totalBalance
                )}
          </h2>

          <p>
            {accounts.length === 1
              ? "1 linked account"
              : `${accounts.length} linked accounts`}
          </p>
        </div>
      </section>

      {errorMessage && (
        <div className="alert error-alert">
          {errorMessage}
        </div>
      )}

      <section className="dashboard-stats">
        <div className="stat-card">
          <h3>Checking</h3>

          <strong>
            {loadingAccounts
              ? "Loading..."
              : formatMoney(
                  accountSummary.checkingBalance
                )}
          </strong>

          <span>
            {accountSummary.checkingAccounts === 1
              ? "1 Checking Account"
              : `${accountSummary.checkingAccounts} Checking Accounts`}
          </span>
        </div>

        <div className="stat-card">
          <h3>Savings</h3>

          <strong>
            {loadingAccounts
              ? "Loading..."
              : formatMoney(
                  accountSummary.savingsBalance
                )}
          </strong>

          <span>
            {accountSummary.savingsAccounts === 1
              ? "1 Savings Account"
              : `${accountSummary.savingsAccounts} Savings Accounts`}
          </span>
        </div>

        <div className="stat-card">
          <h3>Security</h3>

          <strong>Protected</strong>

          <span>Account Secure</span>
        </div>
      </section>

      <section className="quick-actions">
        <div className="section-heading">
          <div>
            <h2>Quick Actions</h2>

            <p>
              Access your most frequently used
              banking tools.
            </p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={loadAccounts}
            disabled={loadingAccounts}
          >
            {loadingAccounts
              ? "Refreshing..."
              : "Refresh Balances"}
          </button>
        </div>

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
              withdrawals, and transfers.
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

          <button
            type="button"
            className="primary-button"
          >
            Contact Support
          </button>
        </div>
      </section>
    </main>
  );
}

export default CustomerDashboard;