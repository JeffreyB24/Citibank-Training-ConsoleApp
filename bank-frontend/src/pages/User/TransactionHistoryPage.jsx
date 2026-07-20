import {
  useEffect,
  useMemo,
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

  const [transactionsLoading, setTransactionsLoading] =
    useState(false);

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

    setTransactionsLoading(true);

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
    } finally {
      setTransactionsLoading(false);
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
    ).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function formatAccountNumber(
    accountId
  ) {
    const value = String(
      accountId ?? ""
    );

    return `•••• ${value
      .slice(-4)
      .padStart(4, "0")}`;
  }

  function getTransactionDetails(
    transaction
  ) {
    const type = String(
      transaction.type || "Transaction"
    ).toLowerCase();

    if (
      type.includes("deposit") ||
      type.includes("credit")
    ) {
      return {
        icon: "↓",
        label:
          transaction.type || "Deposit",
        sign: "+",
        className:
          "history-positive",
      };
    }

    if (
      type.includes("withdraw")
    ) {
      return {
        icon: "↑",
        label:
          transaction.type ||
          "Withdrawal",
        sign: "−",
        className:
          "history-negative",
      };
    }

    if (
      type.includes("transfer")
    ) {
      return {
        icon: "↔",
        label:
          transaction.type ||
          "Transfer",
        sign: "",
        className:
          "history-transfer",
      };
    }

    return {
      icon: "$",
      label:
        transaction.type ||
        "Transaction",
      sign: "",
      className:
        "history-neutral",
    };
  }

  const selectedAccountDetails =
    useMemo(
      () =>
        accounts.find(
          (account) =>
            String(account.id) ===
            String(selectedAccount)
        ),
      [accounts, selectedAccount]
    );

  const transactionSummary =
    useMemo(() => {
      return transactions.reduce(
        (summary, transaction) => {
          const amount = Number(
            transaction.amount ?? 0
          );

          const type = String(
            transaction.type || ""
          ).toLowerCase();

          summary.totalTransactions += 1;

          if (
            type.includes("deposit") ||
            type.includes("credit")
          ) {
            summary.totalDeposits +=
              amount;
          } else if (
            type.includes("withdraw")
          ) {
            summary.totalWithdrawals +=
              amount;
          } else if (
            type.includes("transfer")
          ) {
            summary.totalTransfers +=
              amount;
          }

          return summary;
        },
        {
          totalTransactions: 0,
          totalDeposits: 0,
          totalWithdrawals: 0,
          totalTransfers: 0,
        }
      );
    }, [transactions]);

  return (
    <main className="page transaction-history-page">
      <section className="history-hero">
        <div>
          <p className="page-eyebrow">
            Account activity
          </p>

          <h1>
            Transaction History
          </h1>

          <p>
            Review deposits,
            withdrawals, transfers, and
            recent activity from your bank
            accounts.
          </p>
        </div>

        <button
          type="button"
          className="history-refresh-button"
          onClick={loadAccounts}
          disabled={loading}
        >
          <span>↻</span>

          {loading
            ? "Refreshing..."
            : "Refresh History"}
        </button>
      </section>

      {error && (
        <div className="alert error-alert history-alert">
          <span className="history-alert-icon">
            !
          </span>

          <div>
            <strong>
              Unable to load history
            </strong>

            <p>{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <section className="history-loading-state">
          <div className="loading-spinner" />

          <h2>
            Loading transaction history
          </h2>

          <p>
            Please wait while we retrieve
            your accounts and recent
            activity.
          </p>
        </section>
      ) : accounts.length === 0 ? (
        <section className="history-empty-account-state">
          <div className="history-empty-icon">
            🏦
          </div>

          <h2>No accounts found</h2>

          <p>
            You do not currently have any
            accounts with transaction
            history.
          </p>
        </section>
      ) : (
        <>
          <section className="history-account-panel">
            <div className="history-account-info">
              <div>
                <span>
                  Viewing activity for
                </span>

                <h2>
                  {selectedAccountDetails
                    ?.accountType ||
                    "Bank Account"}
                </h2>

                <p>
                  Account{" "}
                  {formatAccountNumber(
                    selectedAccountDetails?.id
                  )}
                </p>
              </div>

              <div className="history-account-balance">
                <span>
                  Current balance
                </span>

                <strong>
                  {formatMoney(
                    selectedAccountDetails
                      ?.balance
                  )}
                </strong>
              </div>
            </div>

            <div className="history-account-control">
              <label htmlFor="historyAccount">
                Select account
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
          </section>

          <section className="history-summary-grid">
            <article className="history-summary-card">
              <div className="history-summary-icon history-count-icon">
                #
              </div>

              <div>
                <span>
                  Total transactions
                </span>

                <strong>
                  {
                    transactionSummary.totalTransactions
                  }
                </strong>

                <p>
                  Recorded activity
                </p>
              </div>
            </article>

            <article className="history-summary-card">
              <div className="history-summary-icon history-deposit-icon">
                ↓
              </div>

              <div>
                <span>
                  Total deposits
                </span>

                <strong>
                  {formatMoney(
                    transactionSummary.totalDeposits
                  )}
                </strong>

                <p>
                  Funds added
                </p>
              </div>
            </article>

            <article className="history-summary-card">
              <div className="history-summary-icon history-withdraw-icon">
                ↑
              </div>

              <div>
                <span>
                  Total withdrawals
                </span>

                <strong>
                  {formatMoney(
                    transactionSummary.totalWithdrawals
                  )}
                </strong>

                <p>
                  Funds withdrawn
                </p>
              </div>
            </article>

            <article className="history-summary-card">
              <div className="history-summary-icon history-transfer-icon">
                ↔
              </div>

              <div>
                <span>
                  Total transfers
                </span>

                <strong>
                  {formatMoney(
                    transactionSummary.totalTransfers
                  )}
                </strong>

                <p>
                  Funds transferred
                </p>
              </div>
            </article>
          </section>

          <section className="history-activity-panel">
            <div className="history-panel-heading">
              <div>
                <p className="page-eyebrow">
                  Recent activity
                </p>

                <h2>
                  Account Transactions
                </h2>

                <p>
                  All available transactions
                  for your selected account.
                </p>
              </div>

              <div className="history-status-pill">
                <span />

                Account active
              </div>
            </div>

            {transactionsLoading ? (
              <div className="history-inline-loading">
                <div className="loading-spinner" />

                <p>
                  Loading transactions...
                </p>
              </div>
            ) : transactions.length ===
              0 ? (
              <div className="history-no-transactions">
                <div className="history-no-transaction-icon">
                  ↔
                </div>

                <h3>
                  No transactions found
                </h3>

                <p>
                  Activity will appear here
                  after a deposit,
                  withdrawal, or transfer is
                  completed.
                </p>
              </div>
            ) : (
              <div className="history-transaction-list">
                {transactions.map(
                  (
                    transaction,
                    index
                  ) => {
                    const details =
                      getTransactionDetails(
                        transaction
                      );

                    return (
                      <article
                        className="history-transaction-row"
                        key={
                          transaction.id ||
                          `${transaction.type}-${index}`
                        }
                      >
                        <div
                          className={`history-transaction-icon ${details.className}`}
                        >
                          {details.icon}
                        </div>

                        <div className="history-transaction-info">
                          <strong>
                            {details.label}
                          </strong>

                          <span>
                            {formatDate(
                              transaction
                            )}
                          </span>
                        </div>

                        <div className="history-transaction-account">
                          <span>
                            Account
                          </span>

                          <strong>
                            {formatAccountNumber(
                              selectedAccount
                            )}
                          </strong>
                        </div>

                        <div
                          className={`history-transaction-amount ${details.className}`}
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

          <section className="history-security-note">
            <div className="history-security-icon">
              ✓
            </div>

            <div>
              <h2>
                Secure account records
              </h2>

              <p>
                Your transaction history is
                only available after secure
                authentication.
              </p>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default TransactionHistoryPage;