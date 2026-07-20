import { useEffect, useMemo, useState } from "react";
import bankApi from "../../api/bankApi";

function CustomerTransactionsPage() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [selectedAccount, setSelectedAccount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const [transfer, setTransfer] = useState({
    fromAccountId: "",
    toAccountId: "",
    amount: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [depositing, setDepositing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [transferring, setTransferring] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    setLoading(true);
    setError("");

    try {
      const response = await bankApi.get("/accounts/me");

      setAccounts(response.data);

      if (response.data.length > 0) {
        const firstAccount = response.data[0];

        const accountId =
          selectedAccount || firstAccount.id;

        setSelectedAccount(accountId);

        await loadTransactions(accountId);
      } else {
        setSelectedAccount("");
        setTransactions([]);
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  async function loadTransactions(accountId) {
    if (!accountId) {
      setTransactions([]);
      return;
    }

    try {
      const response = await bankApi.get(
        `/accounts/${accountId}/transactions`
      );

      setTransactions(response.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function deposit() {
    if (!selectedAccount || !depositAmount) {
      setError("Select an account and enter an amount.");
      return;
    }

    if (Number(depositAmount) <= 0) {
      setError("Deposit amount must be greater than zero.");
      return;
    }

    setMessage("");
    setError("");
    setDepositing(true);

    try {
      await bankApi.post(
        `/accounts/${selectedAccount}/deposit`,
        {
          amount: Number(depositAmount),
        }
      );

      setDepositAmount("");
      setMessage("Deposit completed successfully.");

      await loadAccounts();
      await loadTransactions(selectedAccount);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setDepositing(false);
    }
  }

  async function withdraw() {
    if (!selectedAccount || !withdrawAmount) {
      setError("Select an account and enter an amount.");
      return;
    }

    if (Number(withdrawAmount) <= 0) {
      setError("Withdrawal amount must be greater than zero.");
      return;
    }

    setMessage("");
    setError("");
    setWithdrawing(true);

    try {
      await bankApi.post(
        `/accounts/${selectedAccount}/withdraw`,
        {
          amount: Number(withdrawAmount),
        }
      );

      setWithdrawAmount("");
      setMessage("Withdrawal completed successfully.");

      await loadAccounts();
      await loadTransactions(selectedAccount);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setWithdrawing(false);
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

    if (
      transfer.fromAccountId ===
      transfer.toAccountId
    ) {
      setError(
        "The source and destination accounts must be different."
      );
      return;
    }

    if (Number(transfer.amount) <= 0) {
      setError("Transfer amount must be greater than zero.");
      return;
    }

    setMessage("");
    setError("");
    setTransferring(true);

    try {
      await bankApi.post("/accounts/transfer", {
        fromAccountId: transfer.fromAccountId,
        toAccountId: transfer.toAccountId,
        amount: Number(transfer.amount),
      });

      const sourceAccount =
        transfer.fromAccountId;

      setTransfer({
        fromAccountId: "",
        toAccountId: "",
        amount: "",
      });

      setMessage("Transfer completed successfully.");

      await loadAccounts();

      if (selectedAccount === sourceAccount) {
        await loadTransactions(selectedAccount);
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setTransferring(false);
    }
  }

  function handleAccountChange(event) {
    const accountId = event.target.value;

    setSelectedAccount(accountId);
    setMessage("");
    setError("");

    loadTransactions(accountId);
  }

  function getErrorMessage(requestError) {
    const responseData =
      requestError.response?.data;

    if (responseData?.message) {
      return responseData.message;
    }

    if (
      responseData &&
      typeof responseData === "object"
    ) {
      return Object.values(responseData).join(" ");
    }

    return "Unable to communicate with the backend.";
  }

  function formatMoney(amount) {
    return Number(amount ?? 0).toLocaleString(
      "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    );
  }

  function formatDate(transaction) {
    const value =
      transaction.createdAt ||
      transaction.timestamp ||
      transaction.date;

    if (!value) {
      return "Not available";
    }

    return new Date(value).toLocaleString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }

  function formatAccountNumber(accountId) {
    const value = String(accountId ?? "");

    return `•••• ${value
      .slice(-4)
      .padStart(4, "0")}`;
  }

  function getTransactionDetails(transaction) {
    const type = String(
      transaction.type || "Transaction"
    ).toLowerCase();

    if (
      type.includes("deposit") ||
      type.includes("credit")
    ) {
      return {
        icon: "↓",
        className: "transaction-positive",
        sign: "+",
        label: transaction.type || "Deposit",
      };
    }

    if (type.includes("withdraw")) {
      return {
        icon: "↑",
        className: "transaction-negative",
        sign: "−",
        label: transaction.type || "Withdrawal",
      };
    }

    if (type.includes("transfer")) {
      return {
        icon: "↔",
        className: "transaction-transfer",
        sign: "",
        label: transaction.type || "Transfer",
      };
    }

    return {
      icon: "$",
      className: "transaction-neutral",
      sign: "",
      label: transaction.type || "Transaction",
    };
  }

  const selectedAccountDetails = useMemo(
    () =>
      accounts.find(
        (account) =>
          String(account.id) ===
          String(selectedAccount)
      ),
    [accounts, selectedAccount]
  );

  const totalBalance = useMemo(
    () =>
      accounts.reduce(
        (total, account) =>
          total +
          Number(account.balance ?? 0),
        0
      ),
    [accounts]
  );

  return (
    <main className="page banking-center-page">
      <section className="banking-center-hero">
        <div className="banking-hero-content">
          <p className="page-eyebrow">
            Secure online banking
          </p>

          <h1>Banking Center</h1>

          <p>
            Deposit funds, make withdrawals,
            transfer money, and monitor your
            recent account activity.
          </p>
        </div>

        <button
          type="button"
          className="banking-refresh-button"
          onClick={loadAccounts}
          disabled={loading}
        >
          <span>↻</span>
          {loading
            ? "Refreshing..."
            : "Refresh Accounts"}
        </button>
      </section>

      {message && (
        <div className="alert success-alert banking-alert">
          <span className="alert-status-icon">
            ✓
          </span>

          <div>
            <strong>Transaction successful</strong>
            <p>{message}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="alert error-alert banking-alert">
          <span className="alert-status-icon">
            !
          </span>

          <div>
            <strong>
              We could not complete that request
            </strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <section className="banking-loading-state">
          <div className="loading-spinner" />

          <h2>Loading your banking center</h2>

          <p>
            Please wait while we retrieve your
            accounts and recent activity.
          </p>
        </section>
      ) : accounts.length === 0 ? (
        <section className="panel banking-empty-state">
          <div className="banking-empty-icon">
            🏦
          </div>

          <h2>No banking accounts found</h2>

          <p>
            You need an active account before
            performing banking operations.
          </p>
        </section>
      ) : (
        <>
          <section className="banking-account-overview">
            <div className="banking-balance-summary">
              <span>Total relationship balance</span>

              <strong>
                {formatMoney(totalBalance)}
              </strong>

              <p>
                Across {accounts.length}{" "}
                {accounts.length === 1
                  ? "active account"
                  : "active accounts"}
              </p>
            </div>

            <div className="selected-account-summary">
              <div className="selected-account-heading">
                <div>
                  <span>Currently viewing</span>

                  <h2>
                    {selectedAccountDetails
                      ?.accountType ||
                      "Bank Account"}
                  </h2>
                </div>

                <div className="account-status-pill">
                  <span />
                  Active
                </div>
              </div>

              <div className="selected-account-details">
                <div>
                  <span>Available balance</span>

                  <strong>
                    {formatMoney(
                      selectedAccountDetails
                        ?.balance
                    )}
                  </strong>
                </div>

                <div>
                  <span>Account number</span>

                  <strong>
                    {formatAccountNumber(
                      selectedAccountDetails?.id
                    )}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          <section className="banking-actions-section">
            <div className="section-heading-row">
              <div>
                <p className="page-eyebrow">
                  Money management
                </p>

                <h2>Banking Actions</h2>

                <p>
                  Choose an action to manage your
                  money securely.
                </p>
              </div>
            </div>

            <div className="banking-action-grid">
              <article className="banking-action-card deposit-action-card">
                <div className="banking-action-header">
                  <div className="banking-action-icon">
                    ↓
                  </div>

                  <div>
                    <h2>Deposit Funds</h2>

                    <p>
                      Add money to one of your
                      accounts.
                    </p>
                  </div>
                </div>

                <div className="banking-form">
                  <div className="form-group">
                    <label htmlFor="depositAccount">
                      Deposit into
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
                            {account.accountType}{" "}
                            {formatAccountNumber(
                              account.id
                            )}{" "}
                            —{" "}
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
                      Deposit amount
                    </label>

                    <div className="money-input-wrapper">
                      <span>$</span>

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
                  </div>

                  <button
                    type="button"
                    className="banking-action-button deposit-button"
                    onClick={deposit}
                    disabled={depositing}
                  >
                    {depositing
                      ? "Processing Deposit..."
                      : "Complete Deposit"}
                  </button>
                </div>
              </article>

              <article className="banking-action-card withdraw-action-card">
                <div className="banking-action-header">
                  <div className="banking-action-icon">
                    ↑
                  </div>

                  <div>
                    <h2>Withdraw Funds</h2>

                    <p>
                      Remove money from an
                      available account.
                    </p>
                  </div>
                </div>

                <div className="banking-form">
                  <div className="form-group">
                    <label htmlFor="withdrawAccount">
                      Withdraw from
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
                            {account.accountType}{" "}
                            {formatAccountNumber(
                              account.id
                            )}{" "}
                            —{" "}
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
                      Withdrawal amount
                    </label>

                    <div className="money-input-wrapper">
                      <span>$</span>

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
                  </div>

                  <button
                    type="button"
                    className="banking-action-button withdraw-button"
                    onClick={withdraw}
                    disabled={withdrawing}
                  >
                    {withdrawing
                      ? "Processing Withdrawal..."
                      : "Complete Withdrawal"}
                  </button>
                </div>
              </article>

              <article className="banking-action-card transfer-action-card">
                <div className="banking-action-header">
                  <div className="banking-action-icon">
                    ↔
                  </div>

                  <div>
                    <h2>Transfer Money</h2>

                    <p>
                      Move funds between your
                      accounts.
                    </p>
                  </div>
                </div>

                <div className="banking-form">
                  <div className="transfer-account-row">
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
                            (
                              currentTransfer
                            ) => ({
                              ...currentTransfer,
                              fromAccountId:
                                event.target
                                  .value,
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
                              {formatAccountNumber(
                                account.id
                              )}{" "}
                              —{" "}
                              {formatMoney(
                                account.balance
                              )}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="transfer-direction-icon">
                      →
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
                            (
                              currentTransfer
                            ) => ({
                              ...currentTransfer,
                              toAccountId:
                                event.target
                                  .value,
                            })
                          )
                        }
                      >
                        <option value="">
                          Select destination
                          account
                        </option>

                        {accounts.map(
                          (account) => (
                            <option
                              key={account.id}
                              value={account.id}
                              disabled={
                                String(
                                  account.id
                                ) ===
                                String(
                                  transfer.fromAccountId
                                )
                              }
                            >
                              {
                                account.accountType
                              }{" "}
                              {formatAccountNumber(
                                account.id
                              )}{" "}
                              —{" "}
                              {formatMoney(
                                account.balance
                              )}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="form-group transfer-amount-group">
                    <label htmlFor="transferAmount">
                      Transfer amount
                    </label>

                    <div className="money-input-wrapper">
                      <span>$</span>

                      <input
                        id="transferAmount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={transfer.amount}
                        onChange={(event) =>
                          setTransfer(
                            (
                              currentTransfer
                            ) => ({
                              ...currentTransfer,
                              amount:
                                event.target.value,
                            })
                          )
                        }
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="banking-action-button transfer-button"
                    onClick={transferMoney}
                    disabled={transferring}
                  >
                    {transferring
                      ? "Processing Transfer..."
                      : "Complete Transfer"}
                  </button>
                </div>
              </article>
            </div>
          </section>

          <section className="transaction-activity-panel">
            <div className="transaction-panel-heading">
              <div>
                <p className="page-eyebrow">
                  Account activity
                </p>

                <h2>Recent Transactions</h2>

                <p>
                  Activity for{" "}
                  <strong>
                    {selectedAccountDetails
                      ?.accountType ||
                      "your selected account"}
                  </strong>
                  .
                </p>
              </div>

              <select
                className="history-account-select"
                value={selectedAccount}
                onChange={handleAccountChange}
                aria-label="Select transaction account"
              >
                {accounts.map((account) => (
                  <option
                    key={account.id}
                    value={account.id}
                  >
                    {account.accountType}{" "}
                    {formatAccountNumber(
                      account.id
                    )}
                  </option>
                ))}
              </select>
            </div>

            {transactions.length === 0 ? (
              <div className="transaction-empty-state">
                <div className="transaction-empty-icon">
                  ↔
                </div>

                <h3>No transactions yet</h3>

                <p>
                  Activity for this account will
                  appear here after a transaction
                  is completed.
                </p>
              </div>
            ) : (
              <div className="modern-transaction-list">
                {transactions.map(
                  (transaction, index) => {
                    const details =
                      getTransactionDetails(
                        transaction
                      );

                    return (
                      <article
                        className="modern-transaction-row"
                        key={
                          transaction.id ||
                          `${transaction.type}-${index}`
                        }
                      >
                        <div
                          className={`transaction-type-icon ${details.className}`}
                        >
                          {details.icon}
                        </div>

                        <div className="transaction-main-info">
                          <strong>
                            {details.label}
                          </strong>

                          <span>
                            {formatDate(transaction)}
                          </span>
                        </div>

                        <div
                          className={`transaction-row-amount ${details.className}`}
                        >
                          {details.sign}
                          {formatMoney(
                            transaction.amount
                          )}
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            )}
          </section>

          <section className="banking-security-footer">
            <div className="banking-security-icon">
              ✓
            </div>

            <div>
              <h2>Secure transaction processing</h2>

              <p>
                Your banking activity is protected
                through authenticated access and
                secure API communication.
              </p>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default CustomerTransactionsPage;