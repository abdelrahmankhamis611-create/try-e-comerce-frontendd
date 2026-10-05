import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { authActions } from "../../features/auth/authSlice";

import "./AdminLayout.css";

function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(authActions.logout());

    navigate("/login", {
      replace: true,
    });
  };

  const getNavLinkClass = ({ isActive }) => {
    return isActive
      ? "admin-sidebar-link active"
      : "admin-sidebar-link";
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">

        <div className="admin-sidebar-logo">
          <h2>Admin Panel</h2>
        </div>

        <nav className="admin-sidebar-nav">

          <NavLink
            to="/admin"
            end
            className={getNavLinkClass}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={getNavLinkClass}
          >
            Products
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={getNavLinkClass}
          >
            Categories
          </NavLink>

          <NavLink
            to="/admin/subcategories"
            className={getNavLinkClass}
          >
            SubCategories
          </NavLink>

          <NavLink
            to="/admin/brands"
            className={getNavLinkClass}
          >
            Brands
          </NavLink>

          <NavLink
            to="/admin/users"
            className={getNavLinkClass}
          >
            Users
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={getNavLinkClass}
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

          <div className="admin-header-title">
            <h1>Admin Panel</h1>
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