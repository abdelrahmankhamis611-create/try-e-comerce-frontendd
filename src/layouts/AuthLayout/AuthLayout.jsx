import { Outlet, Link } from "react-router-dom";

import "./AuthLayout.css";

function AuthLayout() {
  return (
    <main className="auth-layout">
      <div className="auth-container">

        <Link
          to="/"
          className="auth-logo"
        >
          E-Commerce
        </Link>

        <div className="auth-card">
          <Outlet />
        </div>

        <p className="auth-footer">
          © 2026 E-Commerce. All rights reserved.
        </p>

      </div>
    </main>
  );
}

export default AuthLayout;