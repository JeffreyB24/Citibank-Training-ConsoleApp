import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bankApi from "../api/bankApi";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) return;

    if (role === "ADMIN") {
      navigate("/admin", { replace: true });
    } else if (role === "CUSTOMER") {
      navigate("/customer", { replace: true });
    }
  }, [navigate]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const response = await bankApi.post("/auth/login", formData);

      const { token, customerId, username, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("customerId", customerId);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);

      if (role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (role === "CUSTOMER") {
        navigate("/customer", { replace: true });
      } else {
        setError("This account does not have a valid role.");
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
    <main className="login-page modern-login">

      <div className="login-left">

        <Link to="/" className="login-logo">
          🏦 Citibank
        </Link>

        <h1>
          Secure Banking,
          <br />
          Simplified.
        </h1>

        <p>
          Access your accounts, review transactions,
          transfer funds, and manage your finances
          securely from anywhere in the world.
        </p>

        <div className="login-features">

          <div className="feature">
            <span>🔒</span>
            <div>
              <strong>256-bit Encryption</strong>
              <p>Your information is protected.</p>
            </div>
          </div>

          <div className="feature">
            <span>⚡</span>
            <div>
              <strong>Instant Transfers</strong>
              <p>Move money in seconds.</p>
            </div>
          </div>

          <div className="feature">
            <span>🌎</span>
            <div>
              <strong>24/7 Banking</strong>
              <p>Access your finances anytime.</p>
            </div>
          </div>

        </div>

      </div>

      <div className="login-right">

        <section className="login-card modern-card">

          <h2>Welcome Back</h2>

          <p className="login-subtitle">
            Sign in to continue to your dashboard.
          </p>

          {error && (
            <div className="alert error-alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>Username</label>

              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                autoComplete="username"
                required
              />

            </div>

            <div className="form-group">

              <label>Password</label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

            </div>

            <div className="login-options">

              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>

              <a href="#">Forgot Password?</a>

            </div>

            <button
              type="submit"
              className="primary-button login-button"
              disabled={submitting}
            >
              {submitting ? "Signing In..." : "Sign In"}
            </button>

          </form>

        </section>

      </div>

    </main>
  );
}

export default LoginPage;