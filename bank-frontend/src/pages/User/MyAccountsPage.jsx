import { useEffect, useMemo, useState } from "react";
import bankApi from "../../api/bankApi";

function MyAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    setLoading(true);
    setError("");

    try {
      const response = await bankApi.get("/accounts/me");
      setAccounts(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load your accounts."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatMoney(amount) {
    return Number(amount ?? 0).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  function formatAccountNumber(accountId) {
    const value = String(accountId ?? "");
    const lastFour = value.slice(-4).padStart(4, "0");

    return `•••• ${lastFour}`;
  }

  const totalBalance = useMemo(() => {
    return accounts.reduce(
      (total, account) => total + Number(account.balance ?? 0),
      0
    );
  }, [accounts]);

  return (
    <main className="page accounts-page">
      <div className="page-heading accounts-heading">
        <div>
          <p className="page-eyebrow">Personal banking</p>
          <h1>My Accounts</h1>
          <p>
            Review balances and account information from one secure place.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button refresh-button"
          onClick={loadAccounts}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh Accounts"}
        </button>
      </div>

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      {!loading && accounts.length > 0 && (
        <section className="account-summary-banner">
          <div>
            <span>Total available balance</span>
            <strong>{formatMoney(totalBalance)}</strong>
          </div>

          <div className="account-summary-meta">
            <span>{accounts.length}</span>
            <p>
              {accounts.length === 1 ? "Active account" : "Active accounts"}
            </p>
          </div>
        </section>
      )}

      {loading ? (
        <section className="accounts-loading-state">
          <div className="loading-spinner" />
          <h2>Loading your accounts</h2>
          <p>Please wait while we retrieve your latest balances.</p>
        </section>
      ) : accounts.length === 0 ? (
        <section className="panel accounts-empty-state">
          <div className="empty-state-icon">🏦</div>
          <h2>No accounts found</h2>
          <p>
            You do not currently have any checking or savings accounts.
          </p>
        </section>
      ) : (
        <section className="accounts-grid">
          {accounts.map((account, index) => {
            const accountType =
              account.accountType || "Bank Account";

            const isSavings = accountType
              .toLowerCase()
              .includes("saving");

            return (
              <article
                className={`bank-account-card ${
                  isSavings ? "savings-account-card" : ""
                }`}
                key={account.id}
              >
                <div className="account-card-top">
                  <div>
                    <span className="account-type-label">
                      {accountType}
                    </span>

                    <h2>
                      {isSavings
                        ? "Savings Account"
                        : "Everyday Checking"}
                    </h2>
                  </div>

                  <div className="account-card-chip">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

                <div className="account-balance-block">
                  <span>Available balance</span>
                  <strong>{formatMoney(account.balance)}</strong>
                </div>

                <div className="account-card-bottom">
                  <div>
                    <span>Account number</span>
                    <strong>
                      {formatAccountNumber(account.id)}
                    </strong>
                  </div>

                  <div className="account-status">
                    <span className="status-dot" />
                    Active
                  </div>
                </div>

                <div className="account-card-watermark">
                  {index + 1}
                </div>
              </article>
            );
          })}
        </section>
      )}

      {!loading && accounts.length > 0 && (
        <section className="panel account-security-note">
          <div className="security-note-icon">✓</div>

          <div>
            <h2>Your accounts are protected</h2>
            <p>
              Account information is secured and only visible after
              authentication.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}

export default MyAccountsPage;