import {
  useEffect,
  useState,
} from "react";

import bankApi from "../../api/bankApi";

function TransactionHistoryPage() {
  const [accounts, setAccounts] =
    useState([]);

  const [
    selectedAccount,
    setSelectedAccount,
  ] = useState("");

  const [transactions, setTransactions] =
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

      if (response.data.length > 0) {
        const firstAccountId =
          response.data[0].id;

        setSelectedAccount(
          firstAccountId
        );

        await loadTransactions(
          firstAccountId
        );
      } else {
        setTransactions([]);
      }
    } catch (requestError) {
      setError(
        getErrorMessage(requestError)
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadTransactions(
    accountId
  ) {
    if (!accountId) {
      setTransactions([]);
      return;
    }

    try {
      const response =
        await bankApi.get(
          `/accounts/${accountId}/transactions`
        );

      setTransactions(response.data);
    } catch (requestError) {
      setError(
        getErrorMessage(requestError)
      );
    }
  }

  function handleAccountChange(
    event
  ) {
    const accountId =
      event.target.value;

    setSelectedAccount(accountId);
    setError("");

    loadTransactions(accountId);
  }

  function getErrorMessage(
    requestError
  ) {
    return (
      requestError.response?.data?.message ||
      "Unable to load transaction history."
    );
  }

  function formatMoney(amount) {
    return Number(
      amount ?? 0
    ).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  function formatDate(transaction) {
    const value =
      transaction.createdAt ||
      transaction.timestamp ||
      transaction.date;

    if (!value) {
      return "Not available";
    }

    return new Date(
      value
    ).toLocaleString();
  }

  return (
    <main className="page">
      <h1>Transaction History</h1>

      <p>
        Review activity from your bank
        accounts.
      </p>

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading transactions...</p>
      ) : accounts.length === 0 ? (
        <section className="panel">
          <p>
            You do not currently have any
            accounts.
          </p>
        </section>
      ) : (
        <section className="panel">
          <div className="form-group history-account-select">
            <label htmlFor="historyAccount">
              Account
            </label>

            <select
              id="historyAccount"
              value={selectedAccount}
              onChange={
                handleAccountChange
              }
            >
              {accounts.map(
                (account) => (
                  <option
                    key={account.id}
                    value={account.id}
                  >
                    {
                      account.accountType
                    }{" "}
                    -{" "}
                    {formatMoney(
                      account.balance
                    )}
                  </option>
                )
              )}
            </select>
          </div>

          {transactions.length === 0 ? (
            <p>
              No transactions are available
              for this account.
            </p>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map(
                    (transaction) => (
                      <tr
                        key={
                          transaction.id
                        }
                      >
                        <td>
                          {
                            transaction.type
                          }
                        </td>

                        <td>
                          {formatMoney(
                            transaction.amount
                          )}
                        </td>

                        <td>
                          {formatDate(
                            transaction
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default TransactionHistoryPage;