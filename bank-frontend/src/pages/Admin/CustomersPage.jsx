import {
  useEffect,
  useMemo,
  useState,
} from "react";

import bankApi from "../../api/bankApi";

const emptyForm = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
};

function CustomersPage() {
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

  const [deletingCustomerId, setDeletingCustomerId] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    setLoading(true);
    setError("");

    try {
      const response =
        await bankApi.get("/customers");

      setCustomers(
        Array.isArray(response.data)
          ? response.data
          : []
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
      const response =
        await bankApi.post(
          "/customers",
          formData
        );

      setCustomers(
        (currentCustomers) => [
          ...currentCustomers,
          response.data,
        ]
      );

      setFormData(emptyForm);

      setMessage(
        "Customer created successfully."
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
    customerId
  ) {
    const confirmed = window.confirm(
      "Delete this customer and all associated accounts?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingCustomerId(customerId);
    setMessage("");
    setError("");

    try {
      await bankApi.delete(
        `/customers/${customerId}`
      );

      setCustomers(
        (currentCustomers) =>
          currentCustomers.filter(
            (customer) =>
              customer.id !== customerId
          )
      );

      setMessage(
        "Customer deleted successfully."
      );
    } catch (requestError) {
      setError(
        getErrorMessage(requestError)
      );
    } finally {
      setDeletingCustomerId("");
    }
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

  function getInitials(customer) {
    const firstInitial =
      customer.firstName
        ?.charAt(0)
        .toUpperCase() || "";

    const lastInitial =
      customer.lastName
        ?.charAt(0)
        .toUpperCase() || "";

    return (
      `${firstInitial}${lastInitial}` ||
      "CU"
    );
  }

  function formatCustomerId(
    customerId
  ) {
    const value = String(
      customerId ?? ""
    );

    if (value.length <= 12) {
      return value;
    }

    return `${value.slice(
      0,
      6
    )}...${value.slice(-5)}`;
  }

  const filteredCustomers =
    useMemo(() => {
      const normalizedSearch =
        searchTerm
          .trim()
          .toLowerCase();

      if (!normalizedSearch) {
        return customers;
      }

      return customers.filter(
        (customer) => {
          const searchableValue = [
            customer.firstName,
            customer.lastName,
            customer.username,
            customer.id,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchableValue.includes(
            normalizedSearch
          );
        }
      );
    }, [customers, searchTerm]);

  return (
    <main className="page customers-admin-page">
      <section className="customers-admin-hero">
        <div>
          <p className="page-eyebrow">
            Customer administration
          </p>

          <h1>Customer Management</h1>

          <p>
            Create secure customer
            profiles, review registered
            users, and maintain customer
            records from one location.
          </p>
        </div>

        <button
          type="button"
          className="customers-refresh-button"
          onClick={loadCustomers}
          disabled={loading}
        >
          <span>↻</span>

          {loading
            ? "Refreshing..."
            : "Refresh Customers"}
        </button>
      </section>

      {message && (
        <div className="alert success-alert customers-alert">
          <span className="customers-alert-icon">
            ✓
          </span>

          <div>
            <strong>Success</strong>
            <p>{message}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="alert error-alert customers-alert">
          <span className="customers-alert-icon">
            !
          </span>

          <div>
            <strong>
              Action unsuccessful
            </strong>

            <p>{error}</p>
          </div>
        </div>
      )}

      <section className="customers-overview-grid">
        <article className="customers-overview-card">
          <div className="customers-overview-icon">
            👥
          </div>

          <div>
            <span>
              Registered customers
            </span>

            <strong>
              {customers.length}
            </strong>

            <p>
              Total customer profiles
            </p>
          </div>
        </article>

        <article className="customers-overview-card">
          <div className="customers-overview-icon customers-secure-icon">
            ✓
          </div>

          <div>
            <span>
              Access level
            </span>

            <strong>Admin</strong>

            <p>
              Authorized management
            </p>
          </div>
        </article>

        <article className="customers-overview-card">
          <div className="customers-overview-icon customers-system-icon">
            ●
          </div>

          <div>
            <span>Customer service</span>

            <strong>Online</strong>

            <p>
              Backend connection active
            </p>
          </div>
        </article>
      </section>

      <section className="customers-create-panel">
        <div className="customers-panel-heading">
          <div>
            <p className="page-eyebrow">
              New customer
            </p>

            <h2>Create Customer Profile</h2>

            <p>
              Enter the customer's
              information to create their
              secure banking profile.
            </p>
          </div>

          <div className="customers-form-badge">
            Secure registration
          </div>
        </div>

        <form
          className="customers-form"
          onSubmit={handleSubmit}
        >
          <div className="customers-form-grid">
            <div className="form-group">
              <label htmlFor="firstName">
                First name
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                value={
                  formData.firstName
                }
                onChange={handleChange}
                placeholder="Jane"
                autoComplete="given-name"
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
                value={
                  formData.lastName
                }
                onChange={handleChange}
                placeholder="Doe"
                autoComplete="family-name"
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
                value={
                  formData.username
                }
                onChange={handleChange}
                placeholder="jdoe123"
                autoComplete="username"
                minLength="4"
                required
              />

              <small>
                Must contain at least four
                characters.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Temporary password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={
                  formData.password
                }
                onChange={handleChange}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength="8"
                required
              />

              <small>
                Must contain at least eight
                characters.
              </small>
            </div>
          </div>

          <div className="customers-form-footer">
            <p>
              The customer will use this
              username and password to
              access their banking
              account.
            </p>

            <button
              type="submit"
              className="primary-button customers-create-button"
              disabled={submitting}
            >
              {submitting
                ? "Creating Customer..."
                : "Create Customer"}
            </button>
          </div>
        </form>
      </section>

      <section className="customers-list-panel">
        <div className="customers-list-header">
          <div>
            <p className="page-eyebrow">
              Customer directory
            </p>

            <h2>Registered Customers</h2>

            <p>
              Review and manage customer
              profiles currently stored in
              the banking system.
            </p>
          </div>

          <div className="customers-count-badge">
            {customers.length}{" "}
            {customers.length === 1
              ? "customer"
              : "customers"}
          </div>
        </div>

        <div className="customers-toolbar">
          <div className="customers-search">
            <span>⌕</span>

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search by name, username, or ID"
              aria-label="Search customers"
            />
          </div>

          {searchTerm && (
            <button
              type="button"
              className="customers-clear-search"
              onClick={() =>
                setSearchTerm("")
              }
            >
              Clear search
            </button>
          )}
        </div>

        {loading ? (
          <div className="customers-loading-state">
            <div className="loading-spinner" />

            <h3>Loading customers</h3>

            <p>
              Retrieving customer records
              from the banking system.
            </p>
          </div>
        ) : customers.length === 0 ? (
          <div className="customers-empty-state">
            <div className="customers-empty-icon">
              👤
            </div>

            <h3>No customers found</h3>

            <p>
              Create your first customer
              profile using the form above.
            </p>
          </div>
        ) : filteredCustomers.length ===
          0 ? (
          <div className="customers-empty-state">
            <div className="customers-empty-icon">
              ⌕
            </div>

            <h3>
              No matching customers
            </h3>

            <p>
              Try searching with another
              name, username, or customer
              ID.
            </p>
          </div>
        ) : (
          <div className="customers-card-list">
            {filteredCustomers.map(
              (customer) => (
                <article
                  className="customer-record-card"
                  key={customer.id}
                >
                  <div className="customer-record-main">
                    <div className="customer-avatar">
                      {getInitials(
                        customer
                      )}
                    </div>

                    <div className="customer-identity">
                      <h3>
                        {customer.firstName}{" "}
                        {customer.lastName}
                      </h3>

                      <p>
                        @{customer.username}
                      </p>
                    </div>
                  </div>

                  <div className="customer-record-detail">
                    <span>Customer ID</span>

                    <strong
                      title={String(
                        customer.id
                      )}
                    >
                      {formatCustomerId(
                        customer.id
                      )}
                    </strong>
                  </div>

                  <div className="customer-record-detail">
                    <span>Status</span>

                    <strong className="customer-active-status">
                      <i />
                      Active
                    </strong>
                  </div>

                  <button
                    type="button"
                    className="customer-delete-button"
                    onClick={() =>
                      handleDelete(
                        customer.id
                      )
                    }
                    disabled={
                      deletingCustomerId ===
                      customer.id
                    }
                  >
                    {deletingCustomerId ===
                    customer.id
                      ? "Deleting..."
                      : "Delete Customer"}
                  </button>
                </article>
              )
            )}
          </div>
        )}
      </section>

      <section className="customers-security-note">
        <div className="customers-security-note-icon">
          ✓
        </div>

        <div>
          <h2>
            Protected customer records
          </h2>

          <p>
            Customer management actions
            require authenticated
            administrative access.
          </p>
        </div>
      </section>
    </main>
  );
}

export default CustomersPage;