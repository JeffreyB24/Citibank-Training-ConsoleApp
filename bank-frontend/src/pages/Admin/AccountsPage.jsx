import { useEffect, useState } from "react";
import bankApi from "../../api/bankApi";

const emptyForm = {
  customerId: "",
  accountType: "CHECKING",
  startingBalance: "",
};

function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadPageData();
  }, []);

  async function loadPageData() {
    setLoading(true);
    setError("");

    try {
      const [accountsResponse, customersResponse] =
        await Promise.all([
          bankApi.get("/accounts"),
          bankApi.get("/customers"),
        ]);

      setAccounts(accountsResponse.data);
      setCustomers(customersResponse.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const requestBody = {
        customerId: formData.customerId,
        accountType: formData.accountType,
        startingBalance:
          formData.startingBalance === ""
            ? 0
            : Number(formData.startingBalance),
      };

      const response = await bankApi.post(
        "/accounts",
        requestBody
      );

      setAccounts((currentAccounts) => [
        ...currentAccounts,
        response.data,
      ]);

      setFormData(emptyForm);
      setMessage("Account created successfully.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(accountId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this account?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      await bankApi.delete(`/accounts/${accountId}`);

      setAccounts((currentAccounts) =>
        currentAccounts.filter(
          (account) => account.id !== accountId
        )
      );

      setMessage("Account deleted successfully.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  function getCustomerName(customerId) {
    const customer = customers.find(
      (item) => item.id === customerId
    );

    if (!customer) {
      return "Unknown customer";
    }

    return `${customer.firstName} ${customer.lastName}`;
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

  function getErrorMessage(requestError) {
    const responseData = requestError.response?.data;

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

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <h1>Accounts</h1>
          <p>Create and manage customer accounts.</p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={loadPageData}
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

      <section className="panel">
        <h2>Create Account</h2>

        {customers.length === 0 ? (
          <p>
            Create a customer before creating an
            account.
          </p>
        ) : (
          <form
            className="form-grid"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="customerId">
                Customer
              </label>

              <select
                id="customerId"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select a customer
                </option>

                {customers.map((customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.firstName}{" "}
                    {customer.lastName} (
                    {customer.username})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="accountType">
                Account type
              </label>

              <select
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
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
              <label htmlFor="startingBalance">
                Starting balance
              </label>

              <input
                id="startingBalance"
                name="startingBalance"
                type="number"
                min="0"
                step="0.01"
                value={formData.startingBalance}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="primary-button"
                disabled={submitting}
              >
                {submitting
                  ? "Creating..."
                  : "Create Account"}
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Account List</h2>

          <span>{accounts.length} accounts</span>
        </div>

        {loading ? (
          <p>Loading accounts...</p>
        ) : accounts.length === 0 ? (
          <p>No accounts have been created.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Balance</th>
                  <th>Account ID</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td>
                      {getCustomerName(
                        account.customerId
                      )}
                    </td>

                    <td>{account.accountType}</td>

                    <td>
                      {formatMoney(account.balance)}
                    </td>

                    <td className="id-cell">
                      {account.id}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="danger-button"
                        onClick={() =>
                          handleDelete(account.id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default AccountsPage;