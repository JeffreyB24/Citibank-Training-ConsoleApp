import { useEffect, useMemo, useState } from "react";
import bankApi from "../../api/bankApi";

const emptyTransferForm = {
  fromAccountId: "",
  toAccountId: "",
  amount: "",
};

function TransactionsPage() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [selectedAccount, setSelectedAccount] = useState("");

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const [transfer, setTransfer] = useState(emptyTransferForm);

  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const [depositing, setDepositing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [transferring, setTransferring] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    setLoadingAccounts(true);

    try {
      const response = await bankApi.get("/accounts");
      setAccounts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      showMessage(getErrorMessage(error, "Unable to load accounts."), "error");
    } finally {
      setLoadingAccounts(false);
    }
  }

  async function loadTransactions(accountId) {
    if (!accountId) {
      setTransactions([]);
      return;
    }

    setLoadingTransactions(true);

    try {
      const response = await bankApi.get(
        `/accounts/${accountId}/transactions`
      );

      setTransactions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      setTransactions([]);
      showMessage(
        getErrorMessage(error, "Unable to load transaction history."),
        "error"
      );
    } finally {
      setLoadingTransactions(false);
    }
  }

  function handleSelectedAccountChange(event) {
    const accountId = event.target.value;

    setSelectedAccount(accountId);
    setMessage("");
    setMessageType("");
    loadTransactions(accountId);
  }

  async function deposit() {
    const amount = Number(depositAmount);

    if (!selectedAccount) {
      showMessage("Select an account before making a deposit.", "error");
      return;
    }

    if (!depositAmount || Number.isNaN(amount) || amount <= 0) {
      showMessage("Enter a valid deposit amount greater than zero.", "error");
      return;
    }

    setDepositing(true);
    setMessage("");
    setMessageType("");

    try {
      await bankApi.post(`/accounts/${selectedAccount}/deposit`, {
        amount,
      });

      setDepositAmount("");
      showMessage("Deposit completed successfully.", "success");

      await Promise.all([
        loadAccounts(),
        loadTransactions(selectedAccount),
      ]);
    } catch (error) {
      console.error(error);
      showMessage(getErrorMessage(error, "Deposit failed."), "error");
    } finally {
      setDepositing(false);
    }
  }

  async function withdraw() {
    const amount = Number(withdrawAmount);

    if (!selectedAccount) {
      showMessage("Select an account before making a withdrawal.", "error");
      return;
    }

    if (!withdrawAmount || Number.isNaN(amount) || amount <= 0) {
      showMessage("Enter a valid withdrawal amount greater than zero.", "error");
      return;
    }

    setWithdrawing(true);
    setMessage("");
    setMessageType("");

    try {
      await bankApi.post(`/accounts/${selectedAccount}/withdraw`, {
        amount,
      });

      setWithdrawAmount("");
      showMessage("Withdrawal completed successfully.", "success");

      await Promise.all([
        loadAccounts(),
        loadTransactions(selectedAccount),
      ]);
    } catch (error) {
      console.error(error);
      showMessage(getErrorMessage(error, "Withdrawal failed."), "error");
    } finally {
      setWithdrawing(false);
    }
  }

  async function transferMoney() {
    const amount = Number(transfer.amount);

    if (!transfer.fromAccountId || !transfer.toAccountId) {
      showMessage("Select both a source and destination account.", "error");
      return;
    }

    if (transfer.fromAccountId === transfer.toAccountId) {
      showMessage(
        "The source and destination accounts must be different.",
        "error"
      );
      return;
    }

    if (!transfer.amount || Number.isNaN(amount) || amount <= 0) {
      showMessage("Enter a valid transfer amount greater than zero.", "error");
      return;
    }

    setTransferring(true);
    setMessage("");
    setMessageType("");

    const sourceAccountId = transfer.fromAccountId;
    const destinationAccountId = transfer.toAccountId;

    try {
      await bankApi.post("/accounts/transfer", {
        fromAccountId: sourceAccountId,
        toAccountId: destinationAccountId,
        amount,
      });

      setTransfer(emptyTransferForm);
      showMessage("Transfer completed successfully.", "success");

      await loadAccounts();

      if (
        selectedAccount === sourceAccountId ||
        selectedAccount === destinationAccountId
      ) {
        await loadTransactions(selectedAccount);
      }
    } catch (error) {
      console.error(error);
      showMessage(getErrorMessage(error, "Transfer failed."), "error");
    } finally {
      setTransferring(false);
    }
  }

  function showMessage(text, type) {
    setMessage(text);
    setMessageType(type);
  }

  function getErrorMessage(error, fallbackMessage) {
    const responseData = error.response?.data;

    if (typeof responseData === "string" && responseData.trim()) {
      return responseData;
    }

    if (responseData?.message) {
      return responseData.message;
    }

    if (responseData?.error) {
      return responseData.error;
    }

    if (responseData && typeof responseData === "object") {
      const values = Object.values(responseData)
        .filter((value) => typeof value === "string")
        .join(" ");

      if (values) {
        return values;
      }
    }

    return fallbackMessage;
  }

  function formatMoney(amount) {
    return Number(amount ?? 0).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  function formatDate(timestamp) {
    if (!timestamp) {
      return "Date unavailable";
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return timestamp;
    }

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function formatAccountLabel(account) {
    const accountId = String(account.id ?? "");
    const shortenedId =
      accountId.length > 8 ? accountId.slice(-8) : accountId;

    return `${formatAccountType(account.accountType)} • ${shortenedId} • ${formatMoney(
      account.balance
    )}`;
  }

  function formatAccountType(type) {
    if (!type) {
      return "Account";
    }

    return type
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());
  }

  function getTransactionTypeClass(type) {
    const normalizedType = String(type ?? "").toUpperCase();

    if (normalizedType.includes("DEPOSIT")) {
      return "transaction-type-deposit";
    }

    if (normalizedType.includes("WITHDRAW")) {
      return "transaction-type-withdrawal";
    }

    if (normalizedType.includes("TRANSFER")) {
      return "transaction-type-transfer";
    }

    return "transaction-type-default";
  }

  function getTransactionSymbol(type) {
    const normalizedType = String(type ?? "").toUpperCase();

    if (normalizedType.includes("DEPOSIT")) {
      return "+";
    }

    if (normalizedType.includes("WITHDRAW")) {
      return "−";
    }

    if (normalizedType.includes("TRANSFER")) {
      return "↔";
    }

    return "•";
  }

  const selectedAccountData = useMemo(
    () =>
      accounts.find(
        (account) => String(account.id) === String(selectedAccount)
      ),
    [accounts, selectedAccount]
  );

  const transactionSummary = useMemo(() => {
    return transactions.reduce(
      (summary, transaction) => {
        const type = String(transaction.type ?? "").toUpperCase();
        const amount = Number(transaction.amount ?? 0);

        summary.totalTransactions += 1;

        if (type.includes("DEPOSIT")) {
          summary.totalDeposits += amount;
        } else if (type.includes("WITHDRAW")) {
          summary.totalWithdrawals += amount;
        } else if (type.includes("TRANSFER")) {
          summary.totalTransfers += amount;
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
    <main className="page admin-transactions-page">
      <section className="admin-transactions-hero">
        <div className="admin-transactions-hero-content">
          <p className="page-eyebrow">Banking Operations</p>

          <h1>Transaction Management</h1>

          <p>
            Process deposits, withdrawals, and account transfers while
            reviewing account activity from one secure administrative
            workspace.
          </p>
        </div>

        <div className="admin-transactions-hero-actions">
          <div className="transaction-system-status">
            <span className="transaction-system-status-dot" />
            Transaction services online
          </div>

          <button
            type="button"
            className="transactions-refresh-button"
            onClick={loadAccounts}
            disabled={loadingAccounts}
          >
            {loadingAccounts ? "Refreshing..." : "↻ Refresh Accounts"}
          </button>
        </div>
      </section>

      {message && (
        <div
          className={`alert ${
            messageType === "success" ? "success-alert" : "error-alert"
          }`}
          role="status"
        >
          <span>{messageType === "success" ? "✓" : "!"}</span>
          <p>{message}</p>
        </div>
      )}

      <section className="transactions-overview-grid">
        <article className="transaction-overview-card">
          <div className="transaction-overview-icon">◎</div>

          <div>
            <span>Available Accounts</span>
            <strong>{accounts.length}</strong>
          </div>
        </article>

        <article className="transaction-overview-card">
          <div className="transaction-overview-icon">▣</div>

          <div>
            <span>Selected Balance</span>
            <strong>
              {selectedAccountData
                ? formatMoney(selectedAccountData.balance)
                : "$0.00"}
            </strong>
          </div>
        </article>

        <article className="transaction-overview-card">
          <div className="transaction-overview-icon">↕</div>

          <div>
            <span>Loaded Transactions</span>
            <strong>{transactionSummary.totalTransactions}</strong>
          </div>
        </article>

        <article className="transaction-overview-card">
          <div className="transaction-overview-icon">$</div>

          <div>
            <span>Total Bank Funds</span>
            <strong>
              {formatMoney(
                accounts.reduce(
                  (total, account) => total + Number(account.balance ?? 0),
                  0
                )
              )}
            </strong>
          </div>
        </article>
      </section>

      <section className="transaction-account-panel">
        <div className="transaction-account-panel-copy">
          <p className="transaction-section-label">Active Account</p>
          <h2>Select an account to manage</h2>
          <p>
            The selected account will be used for deposits, withdrawals, and
            transaction history.
          </p>
        </div>

        <div className="transaction-account-selector">
          <label htmlFor="transaction-account">
            Account
          </label>

          <select
            id="transaction-account"
            value={selectedAccount}
            onChange={handleSelectedAccountChange}
            disabled={loadingAccounts || accounts.length === 0}
          >
            <option value="">
              {loadingAccounts
                ? "Loading accounts..."
                : accounts.length === 0
                  ? "No accounts available"
                  : "Choose an account"}
            </option>

            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {formatAccountLabel(account)}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="transaction-actions-grid">
        <article className="transaction-action-card deposit-card">
          <div className="transaction-action-card-header">
            <div className="transaction-action-icon">+</div>

            <div>
              <p className="transaction-section-label">Credit Account</p>
              <h2>Deposit Money</h2>
            </div>
          </div>

          <p className="transaction-action-description">
            Add funds to the currently selected customer account.
          </p>

          <div className="transaction-form-group">
            <label htmlFor="deposit-amount">Deposit amount</label>

            <div className="transaction-money-input">
              <span>$</span>

              <input
                id="deposit-amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={depositAmount}
                onChange={(event) => setDepositAmount(event.target.value)}
              />
            </div>
          </div>

          <button
            type="button"
            className="transaction-action-button deposit-button"
            onClick={deposit}
            disabled={depositing || !selectedAccount}
          >
            {depositing ? "Processing Deposit..." : "Complete Deposit"}
          </button>
        </article>

        <article className="transaction-action-card withdrawal-card">
          <div className="transaction-action-card-header">
            <div className="transaction-action-icon">−</div>

            <div>
              <p className="transaction-section-label">Debit Account</p>
              <h2>Withdraw Money</h2>
            </div>
          </div>

          <p className="transaction-action-description">
            Remove funds from the currently selected customer account.
          </p>

          <div className="transaction-form-group">
            <label htmlFor="withdraw-amount">Withdrawal amount</label>

            <div className="transaction-money-input">
              <span>$</span>

              <input
                id="withdraw-amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(event) => setWithdrawAmount(event.target.value)}
              />
            </div>
          </div>

          <button
            type="button"
            className="transaction-action-button withdrawal-button"
            onClick={withdraw}
            disabled={withdrawing || !selectedAccount}
          >
            {withdrawing ? "Processing Withdrawal..." : "Complete Withdrawal"}
          </button>
        </article>
      </section>

      <section className="transaction-transfer-panel">
        <div className="transaction-transfer-heading">
          <div className="transaction-transfer-icon">↔</div>

          <div>
            <p className="transaction-section-label">Account-to-Account</p>
            <h2>Transfer Money</h2>
            <p>
              Move funds securely between two different banking accounts.
            </p>
          </div>
        </div>

        <div className="transaction-transfer-form">
          <div className="transaction-form-group">
            <label htmlFor="transfer-from-account">
              From account
            </label>

            <select
              id="transfer-from-account"
              value={transfer.fromAccountId}
              onChange={(event) =>
                setTransfer((currentTransfer) => ({
                  ...currentTransfer,
                  fromAccountId: event.target.value,
                }))
              }
              disabled={loadingAccounts || accounts.length === 0}
            >
              <option value="">Select source account</option>

              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {formatAccountLabel(account)}
                </option>
              ))}
            </select>
          </div>

          <div className="transaction-transfer-arrow" aria-hidden="true">
            →
          </div>

          <div className="transaction-form-group">
            <label htmlFor="transfer-to-account">
              To account
            </label>

            <select
              id="transfer-to-account"
              value={transfer.toAccountId}
              onChange={(event) =>
                setTransfer((currentTransfer) => ({
                  ...currentTransfer,
                  toAccountId: event.target.value,
                }))
              }
              disabled={loadingAccounts || accounts.length === 0}
            >
              <option value="">Select destination account</option>

              {accounts.map((account) => (
                <option
                  key={account.id}
                  value={account.id}
                  disabled={
                    String(account.id) === String(transfer.fromAccountId)
                  }
                >
                  {formatAccountLabel(account)}
                </option>
              ))}
            </select>
          </div>

          <div className="transaction-form-group transaction-transfer-amount">
            <label htmlFor="transfer-amount">
              Transfer amount
            </label>

            <div className="transaction-money-input">
              <span>$</span>

              <input
                id="transfer-amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={transfer.amount}
                onChange={(event) =>
                  setTransfer((currentTransfer) => ({
                    ...currentTransfer,
                    amount: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <button
            type="button"
            className="transaction-action-button transfer-button"
            onClick={transferMoney}
            disabled={transferring}
          >
            {transferring ? "Processing Transfer..." : "Transfer Funds"}
          </button>
        </div>
      </section>

      <section className="transaction-history-panel">
        <div className="transaction-history-heading">
          <div>
            <p className="transaction-section-label">Account Activity</p>
            <h2>Transaction History</h2>

            <p>
              {selectedAccountData
                ? `Showing activity for ${formatAccountType(
                    selectedAccountData.accountType
                  )} account ending in ${String(
                    selectedAccountData.id
                  ).slice(-8)}.`
                : "Select an account to review its transaction activity."}
            </p>
          </div>

          {selectedAccount && (
            <button
              type="button"
              className="transaction-history-refresh"
              onClick={() => loadTransactions(selectedAccount)}
              disabled={loadingTransactions}
            >
              {loadingTransactions ? "Loading..." : "↻ Refresh History"}
            </button>
          )}
        </div>

        {selectedAccount && transactions.length > 0 && (
          <div className="transaction-history-summary">
            <article>
              <span>Total Transactions</span>
              <strong>{transactionSummary.totalTransactions}</strong>
            </article>

            <article>
              <span>Deposits</span>
              <strong>{formatMoney(transactionSummary.totalDeposits)}</strong>
            </article>

            <article>
              <span>Withdrawals</span>
              <strong>
                {formatMoney(transactionSummary.totalWithdrawals)}
              </strong>
            </article>

            <article>
              <span>Transfers</span>
              <strong>{formatMoney(transactionSummary.totalTransfers)}</strong>
            </article>
          </div>
        )}

        {loadingTransactions ? (
          <div className="transaction-history-state">
            <div className="transaction-loading-spinner" />
            <h3>Loading transaction history</h3>
            <p>Please wait while the latest account activity is retrieved.</p>
          </div>
        ) : !selectedAccount ? (
          <div className="transaction-history-state">
            <div className="transaction-history-state-icon">▤</div>
            <h3>No account selected</h3>
            <p>
              Choose an account above to view deposits, withdrawals, and
              transfers.
            </p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="transaction-history-state">
            <div className="transaction-history-state-icon">◎</div>
            <h3>No transactions found</h3>
            <p>This account does not have any recorded activity yet.</p>
          </div>
        ) : (
          <div className="transaction-list">
            {transactions.map((transaction) => (
              <article
                key={transaction.id}
                className="transaction-list-item"
              >
                <div
                  className={`transaction-list-icon ${getTransactionTypeClass(
                    transaction.type
                  )}`}
                >
                  {getTransactionSymbol(transaction.type)}
                </div>

                <div className="transaction-list-details">
                  <div className="transaction-list-title-row">
                    <h3>{formatAccountType(transaction.type)}</h3>

                    <strong
                      className={getTransactionTypeClass(transaction.type)}
                    >
                      {formatMoney(transaction.amount)}
                    </strong>
                  </div>

                  <div className="transaction-list-meta">
                    <span>{formatDate(transaction.timestamp)}</span>

                    {transaction.id && (
                      <span>
                        Reference: {String(transaction.id).slice(-10)}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="admin-transaction-security-panel">
        <div className="admin-transaction-security-icon">✓</div>

        <div>
          <h2>Protected Administrative Transactions</h2>
          <p>
            All transaction requests are sent through the authenticated banking
            API and recorded in the selected account’s activity history.
          </p>
        </div>
      </section>
    </main>
  );
}

export default TransactionsPage;