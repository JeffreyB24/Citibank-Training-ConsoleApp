import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import bankApi from "../api/bankApi";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    const role =
      localStorage.getItem("role");

    if (!token) {
      return;
    }

    if (role === "ADMIN") {
      navigate("/admin", {
        replace: true,
      });
    } else if (role === "CUSTOMER") {
      navigate("/customer", {
        replace: true,
      });
    }
  }, [navigate]);

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
    setError("");

    try {
      const response = await bankApi.post(
        "/auth/login",
        formData
      );

      const {
        token,
        customerId,
        username,
        role,
      } = response.data;

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "customerId",
        customerId
      );

      localStorage.setItem(
        "username",
        username
      );

      localStorage.setItem(
        "role",
        role
      );

      if (role === "ADMIN") {
        navigate("/admin", {
          replace: true,
        });
      } else if (role === "CUSTOMER") {
        navigate("/customer", {
          replace: true,
        });
      } else {
        setError(
          "This account does not have a valid role."
        );
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Invalid username or password."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Citibank Banking System</h1>

        <p>Please sign in to continue.</p>

        {error && (
          <div className="alert error-alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
              placeholder="Enter username"
              autoComplete="username"
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
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={submitting}
          >
            {submitting
              ? "Signing in..."
              : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;