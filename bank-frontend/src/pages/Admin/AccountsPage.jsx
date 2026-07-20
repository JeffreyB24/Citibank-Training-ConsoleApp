import {
  useEffect,
  useMemo,
  useState,
} from "react";

import bankApi from "../../api/bankApi";

const emptyForm = {
  customerId: "",
  accountType: "CHECKING",
  startingBalance: "",
};

function AccountsPage() {
  const [accounts, setAccounts] =
    useState([]);

  const [customers, setCustomers] =
    useState([]);

  const [formData, setFormData] =
    useState(emptyForm);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadPageData();
  }, []);

  async function loadPageData() {
    setLoading(true);
    setError("");

    try {
      const [
        accountsResponse,
        customersResponse,
      ] = await Promise.all([
        bankApi.get("/accounts"),
        bankApi.get("/customers"),
      ]);

      setAccounts(
        accountsResponse.data
      );

      setCustomers(
        customersResponse.data
      );
    } catch (requestError) {
      setError(
        getErrorMessage(requestError)
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } =
      event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const response =
        await bankApi.post(
          "/accounts",
          {
            customerId:
              formData.customerId,
            accountType:
              formData.accountType,
            startingBalance:
              formData.startingBalance ===
              ""
                ? 0
                : Number(
                    formData.startingBalance
                  ),
          }
        );

      setAccounts((current) => [
        ...current,
        response.data,
      ]);

      setFormData(emptyForm);

      setMessage(
        "Account created successfully."
      );
    } catch (requestError) {
      setError(
        getErrorMessage(requestError)
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(
    accountId
  ) {
    const confirmed =
      window.confirm(
        "Delete this account?"
      );

    if (!confirmed) return;

    setDeletingId(accountId);

    try {
      await bankApi.delete(
        `/accounts/${accountId}`
      );

      setAccounts((current) =>
        current.filter(
          (account) =>
            account.id !== accountId
        )
      );

      setMessage(
        "Account deleted successfully."
      );
    } catch (requestError) {
      setError(
        getErrorMessage(requestError)
      );
    } finally {
      setDeletingId("");
    }
  }

  function getCustomerName(id) {
    const customer =
      customers.find(
        (item) => item.id === id
      );

    return customer
      ? `${customer.firstName} ${customer.lastName}`
      : "Unknown Customer";
  }

  function formatMoney(amount) {
    return Number(
      amount ?? 0
    ).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  function formatAccountId(id) {
    const value = String(id);

    if (value.length <= 12)
      return value;

    return `${value.slice(
      0,
      6
    )}...${value.slice(-5)}`;
  }

  function getErrorMessage(
    requestError
  ) {
    const responseData =
      requestError.response?.data;

    if (responseData?.message)
      return responseData.message;

    if (
      responseData &&
      typeof responseData ===
        "object"
    ) {
      return Object.values(
        responseData
      ).join(" ");
    }

    return "Unable to communicate with backend.";
  }

  const filteredAccounts =
    useMemo(() => {
      const search =
        searchTerm.toLowerCase();

      if (!search) return accounts;

      return accounts.filter(
        (account) => {
          const text = `${getCustomerName(
            account.customerId
          )} ${account.accountType} ${
            account.id
          }`
            .toLowerCase();

          return text.includes(
            search
          );
        }
      );
    }, [
      accounts,
      customers,
      searchTerm,
    ]);

  return (
    <main className="page admin-accounts-page">
      <section className="admin-accounts-hero">
        <div>
          <p className="page-eyebrow">
            Account Administration
          </p>

          <h1>
            Account Management
          </h1>

          <p>
            Create customer
            accounts, review
            balances, and manage
            all banking accounts.
          </p>
        </div>

        <button
          className="accounts-refresh-button"
          onClick={loadPageData}
        >
          ↻ Refresh
        </button>
      </section>

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

      <section className="accounts-summary-grid">
        <article className="summary-card">
          <h3>
            Total Accounts
          </h3>

          <strong>
            {accounts.length}
          </strong>
        </article>

        <article className="summary-card">
          <h3>
            Customers
          </h3>

          <strong>
            {customers.length}
          </strong>
        </article>

        <article className="summary-card">
          <h3>
            Total Funds
          </h3>

          <strong>
            {formatMoney(
              accounts.reduce(
                (
                  total,
                  account
                ) =>
                  total +
                  Number(
                    account.balance ??
                      0
                  ),
                0
              )
            )}
          </strong>
        </article>
      </section>

      <section className="panel modern-panel">
        <div className="section-heading">
          <div>
            <h2>
              Create Account
            </h2>

            <p>
              Open a new checking
              or savings account.
            </p>
          </div>
        </div>

        {customers.length ===
        0 ? (
          <p>
            No customers exist.
          </p>
        ) : (
          <form
            className="form-grid"
            onSubmit={
              handleSubmit
            }
          >
            <div className="form-group">
              <label>
                Customer
              </label>

              <select
                name="customerId"
                value={
                  formData.customerId
                }
                onChange={
                  handleChange
                }
                required
              >
                <option value="">
                  Select Customer
                </option>

                {customers.map(
                  (
                    customer
                  ) => (
                    <option
                      key={
                        customer.id
                      }
                      value={
                        customer.id
                      }
                    >
                      {
                        customer.firstName
                      }{" "}
                      {
                        customer.lastName
                      }
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="form-group">
              <label>
                Account Type
              </label>

              <select
                name="accountType"
                value={
                  formData.accountType
                }
                onChange={
                  handleChange
                }
              >
                <option value="CHECKING">
                  Checking
                </option>

                <option value="SAVINGS">
                  Savings
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Starting Balance
              </label>

              <input
                type="number"
                min="0"
                step=".01"
                name="startingBalance"
                value={
                  formData.startingBalance
                }
                onChange={
                  handleChange
                }
              />
            </div>

            <div className="form-actions">
              <button
                className="primary-button"
                disabled={
                  submitting
                }
              >
                {submitting
                  ? "Creating..."
                  : "Create Account"}
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="panel modern-panel">
        <div className="section-heading accounts-toolbar">
          <div>
            <h2>
              Bank Accounts
            </h2>

            <span>
              {
                filteredAccounts.length
              }{" "}
              Accounts
            </span>
          </div>

          <input
            className="account-search"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />
        </div>

        {loading ? (
          <p>
            Loading
            Accounts...
          </p>
        ) : filteredAccounts.length ===
          0 ? (
          <p>
            No accounts found.
          </p>
        ) : (
          <div className="accounts-card-grid">
            {filteredAccounts.map(
              (account) => (
                <article
                  key={
                    account.id
                  }
                  className="account-card"
                >
                  <div className="account-card-header">
                    <h3>
                      {
                        account.accountType
                      }
                    </h3>

                    <span>
                      {formatMoney(
                        account.balance
                      )}
                    </span>
                  </div>

                  <p>
                    <strong>
                      Customer:
                    </strong>{" "}
                    {getCustomerName(
                      account.customerId
                    )}
                  </p>

                  <p>
                    <strong>
                      ID:
                    </strong>{" "}
                    {formatAccountId(
                      account.id
                    )}
                  </p>

                  <button
                    className="danger-button"
                    onClick={() =>
                      handleDelete(
                        account.id
                      )
                    }
                    disabled={
                      deletingId ===
                      account.id
                    }
                  >
                    {deletingId ===
                    account.id
                      ? "Deleting..."
                      : "Delete Account"}
                  </button>
                </article>
              )
            )}
          </div>
        )}
      </section>

      <section className="admin-security-panel">
        <div className="admin-security-icon">
          ✓
        </div>

        <div>
          <h2>
            Secure Account
            Records
          </h2>

          <p>
            Administrative
            account management
            requires secure
            authentication.
          </p>
        </div>
      </section>
    </main>
  );
}

export default AccountsPage;