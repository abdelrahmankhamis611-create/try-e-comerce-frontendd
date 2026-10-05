import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { authActions } from "../../../features/auth/authSlice";
import { cartActions } from "../../../features/cart/cartSlice";
import { wishlistActions } from "../../../features/wishlist/wishlistSlice";

import "./Navbar.css";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const { cart } = useSelector(
    (state) => state.cart
  );

  const { wishlist } = useSelector(
    (state) => state.wishlist
  );

  const cartItemsCount =
    cart?.cartItems?.length || 0;

  const wishlistItemsCount =
    wishlist?.length || 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const keyword = searchKeyword.trim();

    if (!keyword) {
      navigate("/products");
      return;
    }

    navigate(
      `/products?keyword=${encodeURIComponent(keyword)}`
    );
  };

  const handleLogout = () => {
    dispatch(authActions.logout());
    dispatch(cartActions.clearCartSuccess());
    dispatch(wishlistActions.getWishlistSuccess([]));

    navigate("/login", { replace: true });
  };

  const handleAccountClick = () => {
    setIsAccountOpen((prev) => !prev);
  };

  const closeAccountMenu = () => {
    setIsAccountOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link
          to="/"
          className="navbar-logo"
        >
          E-Commerce
        </Link>

        {/* Search */}

        <form
          className="navbar-search"
          onSubmit={handleSearchSubmit}
        >
          <input
            type="text"
            placeholder="Search products..."
            value={searchKeyword}
            onChange={(e) =>
              setSearchKeyword(e.target.value)
            }
          />

          <button type="submit">
            🔍
          </button>
        </form>

        <nav className="navbar-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/products">
            Products
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/orders">
                My Orders
              </Link>

              {/* Wishlist */}

              <Link
                to="/wishlist"
                className="navbar-wishlist-link"
                title="Wishlist"
              >
                <span className="navbar-icon-wrapper">

                  <span className="navbar-icon">
                    ♡
                  </span>

                  {wishlistItemsCount > 0 && (
                    <span className="navbar-count">
                      {wishlistItemsCount}
                    </span>
                  )}

                </span>

                <span>
                  Wishlist
                </span>
              </Link>

              {/* Cart */}

              <Link
                to="/cart"
                className="navbar-cart-link"
                title="Cart"
              >
                <span className="navbar-icon-wrapper">

                  <span className="navbar-icon">
                    🛒
                  </span>

                  {cartItemsCount > 0 && (
                    <span className="navbar-count">
                      {cartItemsCount}
                    </span>
                  )}

                </span>

                <span>
                  Cart
                </span>
              </Link>

              {/* Account */}

              <div className="navbar-account">

                <button
                  type="button"
                  className="navbar-account-button"
                  onClick={handleAccountClick}
                >
                  <span className="navbar-account-avatar">
                    {user?.name
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </span>

                  <span className="navbar-account-name">
                    {user?.name || "Account"}
                  </span>

                  <span className="navbar-account-arrow">
                    {isAccountOpen ? "▲" : "▼"}
                  </span>
                </button>

                {isAccountOpen && (
                  <div className="navbar-account-menu">

                    <div className="navbar-account-menu-header">

                      <strong>
                        {user?.name || "User"}
                      </strong>

                      <span>
                        {user?.email}
                      </span>

                    </div>

                    <Link
                      to="/account"
                      onClick={closeAccountMenu}
                    >
                      My Account
                    </Link>

                    <Link
                      to="/orders"
                      onClick={closeAccountMenu}
                    >
                      My Orders
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        closeAccountMenu();
                        handleLogout();
                      }}
                    >
                      Logout
                    </button>

                  </div>
                )}

              </div>
            </>
          )}

          {!isAuthenticated && (
            <Link to="/login">
              Login
            </Link>
          )}

        </nav>

      </div>
    </header>
  );
}

export default Navbar;