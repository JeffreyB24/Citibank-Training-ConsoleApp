import {
  useEffect,
  useState,
} from "react";

import bankApi from "../../api/bankApi";

function MyAccountsPage() {
  const [accounts, setAccounts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    setLoading(true);
    setError("");

    try {
      const response =
        await bankApi.get(
          "/accounts/me"
        );

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
    return Number(
      amount ?? 0
    ).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <h1>My Accounts</h1>

          <p>
            View your checking and savings
            accounts.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={loadAccounts}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading accounts...</p>
      ) : accounts.length === 0 ? (
        <section className="panel">
          <p>
            You do not currently have any
            accounts.
          </p>
        </section>
      ) : (
        <div className="dashboard-grid">
          {accounts.map((account) => (
            <div
              className="card"
              key={account.id}
            >
              <h2>
                {account.accountType}
              </h2>

              <h3>
                {formatMoney(
                  account.balance
                )}
              </h3>

              <p className="id-cell">
                Account ID: {account.id}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyAccountsPage;