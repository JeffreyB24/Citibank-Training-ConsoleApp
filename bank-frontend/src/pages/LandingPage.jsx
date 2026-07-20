import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <div className="landing-container landing-nav">
          <Link
            to="/"
            className="landing-brand"
          >
            <span className="brand-mark">
              C
            </span>

            <span className="brand-name">
              CitiBank
            </span>
          </Link>

          <nav className="landing-links">
            <a href="#services">
              Services
            </a>

            <a href="#security">
              Security
            </a>

            <a href="#about">
              About
            </a>
          </nav>

          <div className="landing-actions">
            <Link
              to="/login"
              className="button button-secondary"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="landing-container hero-grid">
          <div className="hero-content">
            <p className="eyebrow">
              Modern banking. Built around you.
            </p>

            <h1>
              A smarter way to manage your money.
            </h1>

            <p className="hero-description">
              Securely manage accounts, review
              transactions, transfer funds, and
              stay in control of your financial
              future from one simple dashboard.
            </p>

            <div className="hero-actions">
              <Link
                to="/register"
                className="button button-primary button-large"
              >
                Open an Account
              </Link>

              <Link
                to="/login"
                className="button button-light button-large"
              >
                Sign In
              </Link>
            </div>

            <div className="hero-trust">
              <div>
                <strong>
                  256-bit
                </strong>

                <span>
                  Encryption
                </span>
              </div>

              <div>
                <strong>
                  24/7
                </strong>

                <span>
                  Account Access
                </span>
              </div>

              <div>
                <strong>
                  99.99%
                </strong>

                <span>
                  Platform Uptime
                </span>
              </div>
            </div>
          </div>

          <div className="hero-preview">
            <div className="preview-window">
              <div className="preview-header">
                <div>
                  <p className="preview-label">
                    Total balance
                  </p>

                  <h2>
                    $48,542.18
                  </h2>
                </div>

                <span className="status-badge">
                  Secure
                </span>
              </div>

              <div className="preview-card-grid">
                <div className="account-preview-card">
                  <span>
                    Checking
                  </span>

                  <strong>
                    $8,420.34
                  </strong>

                  <small>
                    •••• 4821
                  </small>
                </div>

                <div className="account-preview-card accent">
                  <span>
                    Savings
                  </span>

                  <strong>
                    $40,121.84
                  </strong>

                  <small>
                    4.25% APY
                  </small>
                </div>
              </div>

              <div className="preview-transactions">
                <div className="preview-section-heading">
                  <h3>
                    Recent activity
                  </h3>

                  <span>
                    View all
                  </span>
                </div>

                <div className="preview-transaction">
                  <div className="transaction-icon">
                    P
                  </div>

                  <div className="transaction-copy">
                    <strong>
                      Payroll deposit
                    </strong>

                    <span>
                      Today
                    </span>
                  </div>

                  <strong className="positive">
                    +$3,245.00
                  </strong>
                </div>

                <div className="preview-transaction">
                  <div className="transaction-icon">
                    U
                  </div>

                  <div className="transaction-copy">
                    <strong>
                      Utility payment
                    </strong>

                    <span>
                      Yesterday
                    </span>
                  </div>

                  <strong>
                    -$142.56
                  </strong>
                </div>

                <div className="preview-transaction">
                  <div className="transaction-icon">
                    G
                  </div>

                  <div className="transaction-copy">
                    <strong>
                      Grocery purchase
                    </strong>

                    <span>
                      Jul 17
                    </span>
                  </div>

                  <strong>
                    -$86.24
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="services-section"
      >
        <div className="landing-container">
          <div className="section-heading">
            <p className="eyebrow">
              Banking made simple
            </p>

            <h2>
              Everything you need in one place
            </h2>

            <p>
              Manage your everyday banking with
              secure tools designed to keep your
              finances clear and accessible.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon">
                $
              </div>

              <h3>
                Smart account management
              </h3>

              <p>
                Review balances and manage your
                checking and savings accounts from
                a single dashboard.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">
                ↔
              </div>

              <h3>
                Fast transfers
              </h3>

              <p>
                Move money between eligible
                accounts with a simple and secure
                transfer experience.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">
                ✓
              </div>

              <h3>
                Secure by design
              </h3>

              <p>
                Authentication, role-based access,
                and protected account data help
                keep your information safe.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        id="security"
        className="security-section"
      >
        <div className="landing-container security-grid">
          <div>
            <p className="eyebrow">
              Built for trust
            </p>

            <h2>
              Security is part of every experience
            </h2>

            <p className="security-description">
              Your financial data deserves strong
              protection. Our platform uses secure
              authentication and controlled access
              to help protect your account.
            </p>
          </div>

          <div className="security-list">
            <div className="security-item">
              <span>
                01
              </span>

              <div>
                <h3>
                  Encrypted communication
                </h3>

                <p>
                  Data is transmitted through
                  secure HTTPS connections.
                </p>
              </div>
            </div>

            <div className="security-item">
              <span>
                02
              </span>

              <div>
                <h3>
                  Protected sessions
                </h3>

                <p>
                  JWT authentication helps secure
                  access to protected services.
                </p>
              </div>
            </div>

            <div className="security-item">
              <span>
                03
              </span>

              <div>
                <h3>
                  Role-based permissions
                </h3>

                <p>
                  Customers and administrators only
                  access the features assigned to
                  their roles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="cta-section"
      >
        <div className="landing-container cta-card">
          <div>
            <p className="eyebrow">
              Ready to get started?
            </p>

            <h2>
              Take control of your banking today.
            </h2>
          </div>

          <div className="cta-actions">
            <Link
              to="/register"
              className="button button-primary button-large"
            >
              Open an Account
            </Link>

            <Link
              to="/login"
              className="button button-secondary button-large"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-container footer-content">
          <div>
            <Link
              to="/"
              className="landing-brand footer-brand"
            >
              <span className="brand-mark">
                C
              </span>

              <span className="brand-name">
                CitiBank
              </span>
            </Link>

            <p>
              Secure digital banking for modern
              customers.
            </p>
          </div>

          <div className="footer-links">
            <a href="#services">
              Services
            </a>

            <a href="#security">
              Security
            </a>

            <Link to="/login">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default LandingPage;