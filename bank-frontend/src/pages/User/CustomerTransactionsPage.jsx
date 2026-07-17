import {
  useEffect,
  useState,
} from "react";

import bankApi from "../../api/bankApi";

function CustomerTransactionsPage() {
  const [accounts, setAccounts] =
    useState([]);

  const [transactions, setTransactions] =
    useState([]);

  const [
    selectedAccount,
    setSelectedAccount,
  ] = useState("");

  const [
    depositAmount,
    setDepositAmount,
  ] = useState("");

  const [
    withdrawAmount,
    setWithdrawAmount,
  ] = useState("");

  const [transfer, setTransfer] =
    useState({
      fromAccountId: "",
      toAccountId: "",
      amount: "",
    });

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

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
        const firstAccount =
          response.data[0];

        setSelectedAccount(
          (currentAccount) =>
            currentAccount ||
            firstAccount.id
        );

        await loadTransactions(
          selectedAccount ||
            firstAccount.id
        );
      } else {
        setSelectedAccount("");
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

  async function deposit() {
    if (
      !selectedAccount ||
      !depositAmount
    ) {
      setError(
        "Select an account and enter an amount."
      );
      return;
    }

    setMessage("");
    setError("");

    try {
      await bankApi.post(
        `/accounts/${selectedAccount}/deposit`,
        {
          amount: Number(
            depositAmount
          ),
        }
      );

      setDepositAmount("");
      setMessage(
        "Deposit successful."
      );

      await loadAccounts();
      await loadTransactions(
        selectedAccount
      );
    } catch (requestError) {
      setError(
        getErrorMessage(requestError)
      );
    }
  }

  async function withdraw() {
    if (
      !selectedAccount ||
      !withdrawAmount
    ) {
      setError(
        "Select an account and enter an amount."
      );
      return;
    }

    setMessage("");
    setError("");

    try {
      await bankApi.post(
        `/accounts/${selectedAccount}/withdraw`,
        {
          amount: Number(
            withdrawAmount
          ),
        }
      );

      setWithdrawAmount("");
      setMessage(
        "Withdrawal successful."
      );

      await loadAccounts();
      await loadTransactions(
        selectedAccount
      );
    } catch (requestError) {
      setError(
        getErrorMessage(requestError)
      );
    }
  }

  async function transferMoney() {
    if (
      !transfer.fromAccountId ||
      !transfer.toAccountId ||
      !transfer.amount
    ) {
      setError(
        "Select both accounts and enter an amount."
      );
      return;
    }

    setMessage("");
    setError("");

    try {
      await bankApi.post(
        "/accounts/transfer",
        {
          fromAccountId:
            transfer.fromAccountId,

          toAccountId:
            transfer.toAccountId,

          amount: Number(
            transfer.amount
          ),
        }
      );

      const sourceAccount =
        transfer.fromAccountId;

      setTransfer({
        fromAccountId: "",
        toAccountId: "",
        amount: "",
      });

      setMessage(
        "Transfer successful."
      );

      await loadAccounts();

      if (
        selectedAccount ===
        sourceAccount
      ) {
        await loadTransactions(
          selectedAccount
        );
      }
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
    setMessage("");
    setError("");

    loadTransactions(accountId);
  }

  function getErrorMessage(
    requestError
  ) {
    const responseData =
      requestError.response?.data;

    if (responseData?.message) {
      return responseData.message;
    }

    if (
      responseData &&
      typeof responseData === "object"
    ) {
      return Object.values(
        responseData
      ).join(" ");
    }

    return "Unable to communicate with the backend.";
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
      <div className="page-heading">
        <div>
          <h1>My Banking</h1>

          <p>
            Deposit, withdraw, transfer,
            and review transactions.
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

      {message && (
        <div className="alert success-alert">
          {message}
        </div>
      )}

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
            You need an account before
            performing banking operations.
          </p>
        </section>
      ) : (
        <>
          <section className="panel">
            <h2>Deposit</h2>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="depositAccount">
                  Account
                </label>

                <select
                  id="depositAccount"
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

              <div className="form-group">
                <label htmlFor="depositAmount">
                  Amount
                </label>

                <input
                  id="depositAmount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={depositAmount}
                  onChange={(event) =>
                    setDepositAmount(
                      event.target.value
                    )
                  }
                  placeholder="0.00"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={deposit}
                >
                  Deposit
                </button>
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>Withdraw</h2>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="withdrawAccount">
                  Account
                </label>

                <select
                  id="withdrawAccount"
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

              <div className="form-group">
                <label htmlFor="withdrawAmount">
                  Amount
                </label>

                <input
                  id="withdrawAmount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={withdrawAmount}
                  onChange={(event) =>
                    setWithdrawAmount(
                      event.target.value
                    )
                  }
                  placeholder="0.00"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={withdraw}
                >
                  Withdraw
                </button>
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>
              Transfer Between My Accounts
            </h2>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fromAccount">
                  From account
                </label>

                <select
                  id="fromAccount"
                  value={
                    transfer.fromAccountId
                  }
                  onChange={(event) =>
                    setTransfer(
                      (currentTransfer) => ({
                        ...currentTransfer,
                        fromAccountId:
                          event.target.value,
                      })
                    )
                  }
                >
                  <option value="">
                    Select source account
                  </option>

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

              <div className="form-group">
                <label htmlFor="toAccount">
                  To account
                </label>

                <select
                  id="toAccount"
                  value={
                    transfer.toAccountId
                  }
                  onChange={(event) =>
                    setTransfer(
                      (currentTransfer) => ({
                        ...currentTransfer,
                        toAccountId:
                          event.target.value,
                      })
                    )
                  }
                >
                  <option value="">
                    Select destination account
                  </option>

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

              <div className="form-group">
                <label htmlFor="transferAmount">
                  Amount
                </label>

                <input
                  id="transferAmount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={transfer.amount}
                  onChange={(event) =>
                    setTransfer(
                      (currentTransfer) => ({
                        ...currentTransfer,
                        amount:
                          event.target.value,
                      })
                    )
                  }
                  placeholder="0.00"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={
                    transferMoney
                  }
                >
                  Transfer
                </button>
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>
              Transaction History
            </h2>

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
        </>
      )}
    </main>
  );
}

export default CustomerTransactionsPage;