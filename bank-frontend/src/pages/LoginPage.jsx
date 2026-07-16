import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState("CUSTOMER");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    // Temporary role-based navigation.
    // Tomorrow this will call the backend login API.
    if (role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/customer");
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Citibank Training</h1>
        <p>Sign in to access your banking dashboard.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="role">User type</label>

            <select
              id="role"
              value={role}
              onChange={(event) =>
                setRole(event.target.value)
              }
            >
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter password"
              required
            />
          </div>

          <button className="primary-button" type="submit">
            Sign In
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;