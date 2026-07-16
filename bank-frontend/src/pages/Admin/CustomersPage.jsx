import { useEffect, useState } from "react";
import bankApi from "../../api/bankApi";

const emptyForm = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
};

function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    setLoading(true);
    setError("");

    try {
      const response = await bankApi.get("/customers");
      setCustomers(response.data);
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
      const response = await bankApi.post(
        "/customers",
        formData
      );

      setCustomers((currentCustomers) => [
        ...currentCustomers,
        response.data,
      ]);

      setFormData(emptyForm);
      setMessage("Customer created successfully.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(customerId) {
    const confirmed = window.confirm(
      "Delete this customer and all associated accounts?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      await bankApi.delete(`/customers/${customerId}`);

      setCustomers((currentCustomers) =>
        currentCustomers.filter(
          (customer) => customer.id !== customerId
        )
      );

      setMessage("Customer deleted successfully.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
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
          <h1>Customers</h1>
          <p>Create and manage bank customers.</p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={loadCustomers}
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
        <h2>Create Customer</h2>

        <form
          className="form-grid"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="firstName">
              First name
            </label>

            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Jane"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">
              Last name
            </label>

            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="jdoe123"
              minLength="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              minLength="8"
              required
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
                : "Create Customer"}
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Customer List</h2>
          <span>{customers.length} customers</span>
        </div>

        {loading ? (
          <p>Loading customers...</p>
        ) : customers.length === 0 ? (
          <p>No customers have been created.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Customer ID</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      {customer.firstName}{" "}
                      {customer.lastName}
                    </td>

                    <td>{customer.username}</td>

                    <td className="id-cell">
                      {customer.id}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="danger-button"
                        onClick={() =>
                          handleDelete(customer.id)
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

export default CustomersPage;