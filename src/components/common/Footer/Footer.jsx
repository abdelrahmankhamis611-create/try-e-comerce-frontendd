import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        {/* About */}
        <div className="footer-column footer-about">
          <Link to="/" className="footer-logo">
            <span className="footer-logo-main">Shop</span>
            <span className="footer-logo-sub">Store</span>
          </Link>

          <p>
            Discover quality products, great deals, and a simple shopping
            experience.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/products">Products</Link>
            </li>

            <li>
              <Link to="/categories">Categories</Link>
            </li>

            <li>
              <Link to="/brands">Brands</Link>
            </li>
          </ul>
        </div>

        {/* Customer */}
        <div className="footer-column">
          <h3>Customer Service</h3>

          <ul>
            <li>
              <Link to="/account">My Account</Link>
            </li>

            <li>
              <Link to="/orders">My Orders</Link>
            </li>

            <li>
              <Link to="/wishlist">Wishlist</Link>
            </li>

            <li>
              <Link to="/cart">Shopping Cart</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h3>Contact Us</h3>

          <div className="footer-contact">
            <p>📍 Cairo, Egypt</p>
            <p>📞 +20 100 000 0000</p>
            <p>✉️ support@shopstore.com</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Shop Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;