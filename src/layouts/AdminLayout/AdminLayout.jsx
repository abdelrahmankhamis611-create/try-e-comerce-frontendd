import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { authActions } from "../../features/auth/authSlice";

import "./AdminLayout.css";

function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector(
    (state) => state.auth
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(authActions.logout());

    navigate("/login", {
      replace: true,
    });
  };

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const getNavLinkClass = ({ isActive }) => {
    return isActive
      ? "admin-sidebar-link active"
      : "admin-sidebar-link";
  };

  return (
    <div className="admin-layout">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={handleCloseSidebar}
        />
      )}

      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "admin-sidebar-open" : ""
        }`}
      >

        <div className="admin-sidebar-logo">
          <h2>Admin Panel</h2>

          <button
            type="button"
            className="admin-sidebar-close"
            onClick={handleCloseSidebar}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <nav className="admin-sidebar-nav">

          <NavLink
            to="/admin"
            end
            className={getNavLinkClass}
            onClick={handleCloseSidebar}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={getNavLinkClass}
            onClick={handleCloseSidebar}
          >
            Products
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={getNavLinkClass}
            onClick={handleCloseSidebar}
          >
            Categories
          </NavLink>

          <NavLink
            to="/admin/subcategories"
            className={getNavLinkClass}
            onClick={handleCloseSidebar}
          >
            SubCategories
          </NavLink>

          <NavLink
            to="/admin/brands"
            className={getNavLinkClass}
            onClick={handleCloseSidebar}
          >
            Brands
          </NavLink>

          <NavLink
            to="/admin/users"
            className={getNavLinkClass}
            onClick={handleCloseSidebar}
          >
            Users
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={getNavLinkClass}
            onClick={handleCloseSidebar}
          >
            Orders
          </NavLink>

        </nav>

        <div className="admin-sidebar-bottom">

          <button
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </aside>

      <div className="admin-main">

        <header className="admin-header">

          <div className="admin-header-left">

            <button
              type="button"
              className="admin-menu-button"
              onClick={handleToggleSidebar}
              aria-label={
                sidebarOpen
                  ? "Close menu"
                  : "Open menu"
              }
            >
              {sidebarOpen ? "×" : "☰"}
            </button>

            <div className="admin-header-title">
              <h1>Admin Panel</h1>
            </div>

          </div>

          <div className="admin-user-info">
            <span>{user?.name}</span>
            <span>{user?.role}</span>
          </div>

        </header>

        <main className="admin-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;