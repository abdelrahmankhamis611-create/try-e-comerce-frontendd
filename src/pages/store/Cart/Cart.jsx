import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import useCart from "../../../features/cart/hooks/useCart";

import "./Cart.css";

function Cart() {
  const {
    fetchCart,
    removeItem,
    updateQuantity,
    removeAllCart,
  } = useCart();

  const {
    cart,
    loading,
    error,
  } = useSelector((state) => state.cart);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (loading && !cart) {
    return (
      <main className="cart-page">
        <div className="cart-message">
          Loading cart...
        </div>
      </main>
    );
  }

  if (error && !cart) {
    return (
      <main className="cart-page">
        <div className="cart-message cart-error">
          {error}
        </div>
      </main>
    );
  }

  const cartItems = cart?.cartItems || [];

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-container">
          <div className="cart-empty">
            <div className="cart-empty-icon">
              🛒
            </div>

            <h1>Your Cart is Empty</h1>

            <p>
              You haven't added any products to
              your cart yet.
            </p>

            <Link
              to="/products"
              className="continue-shopping-button"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <div>
            <h1>Shopping Cart</h1>

            <p>
              {cartItems.length}{" "}
              {cartItems.length === 1
                ? "item"
                : "items"}{" "}
              in your cart
            </p>
          </div>

          <button
            type="button"
            className="clear-cart-button"
            onClick={removeAllCart}
            disabled={loading}
          >
            Clear Cart
          </button>
        </div>

        {error && (
          <div className="cart-error-box">
            {error}
          </div>
        )}

        <div className="cart-content">
          <section className="cart-items">
            {cartItems.map((item) => {
              const product = item.product;

              return (
                <article
                  key={item._id}
                  className="cart-item"
                >
                  <Link
                    to={`/products/${product._id}`}
                    className="cart-item-image"
                  >
                    <img
                      src={product.imageCover}
                      alt={product.title}
                    />
                  </Link>

                  <div className="cart-item-info">
                    <Link
                      to={`/products/${product._id}`}
                      className="cart-item-title"
                    >
                      {product.title}
                    </Link>

                    <p className="cart-item-price">
                      ${item.pricePerUnit}
                    </p>

                    {item.color && (
                      <p className="cart-item-color">
                        Color: {item.color}
                      </p>
                    )}

                    <div className="cart-item-actions">
                      <div className="cart-quantity">
                        <button
                          type="button"
                          disabled={
                            loading ||
                            item.quantity <= 1
                          }
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.quantity - 1
                            )
                          }
                        >
                          −
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          disabled={
                            loading ||
                            item.quantity >=
                              product.quantity
                          }
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="remove-item-button"
                        onClick={() =>
                          removeItem(item._id)
                        }
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-total">
                    ${item.totalPrice}
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items</span>

              <span>
                ${cart.totalCartPrice || 0}
              </span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>

              <span>Free</span>
            </div>

            <div className="summary-row">
              <span>Tax</span>

              <span>$0</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>

              <strong>
                $
                {cart.totalPriceAfterDiscount ??
                  cart.totalCartPrice ??
                  0}
              </strong>
            </div>

            <Link
              to="/checkout"
              className="checkout-button"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/products"
              className="continue-shopping-link"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Cart;