import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import useCart from "../../../features/cart/hooks/useCart";
import useOrder from "../../../features/orders/hooks/useOrder";

import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const { fetchCart } = useCart();
  const { createCash } = useOrder();

  const {
    cart,
    loading: cartLoading,
    error: cartError,
  } = useSelector((state) => state.cart);

  const {
    loading: orderLoading,
    error: orderError,
  } = useSelector((state) => state.orders);

  const [shippingAddress, setShippingAddress] =
    useState({
      details: "",
      phone: "",
      city: "",
      postalCode: "",
    });

  const [paymentMethod, setPaymentMethod] =
    useState("cash");

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cart?._id) {
      return;
    }

    if (paymentMethod === "card") {
      console.log(
        "Stripe payment will be connected next."
      );
      return;
    }

    try {
      await createCash(
        cart._id,
        shippingAddress
      );

      // Backend deletes the cart after creating the order.
      // Refresh Redux cart state to reflect that.
      await fetchCart();

      navigate("/orders");
    } catch (error) {
      console.log(
        "Checkout Error:",
        error
      );
    }
  };

  if (cartLoading && !cart) {
    return (
      <main className="checkout-page">
        <div className="checkout-message">
          Loading checkout...
        </div>
      </main>
    );
  }

  if (cartError && !cart) {
    return (
      <main className="checkout-page">
        <div className="checkout-message checkout-error">
          {cartError}
        </div>
      </main>
    );
  }

  const cartItems = cart?.cartItems || [];

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-empty">
            <h1>Your Cart is Empty</h1>

            <p>
              Add some products to your cart
              before proceeding to checkout.
            </p>

            <Link
              to="/products"
              className="checkout-back-button"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const subtotal =
    cart.totalCartPrice || 0;

  const total =
    cart.totalPriceAfterDiscount ??
    cart.totalCartPrice ??
    0;

  const isSubmitting =
    cartLoading || orderLoading;

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>

          <p>
            Complete your information to place
            your order.
          </p>
        </div>

        {(cartError || orderError) && (
          <div className="checkout-error-box">
            {orderError || cartError}
          </div>
        )}

        <form
          className="checkout-content"
          onSubmit={handleSubmit}
        >
          <section className="checkout-form-section">
            <div className="checkout-section-card">
              <h2>Shipping Address</h2>

              <div className="checkout-form-group">
                <label htmlFor="details">
                  Address Details
                </label>

                <textarea
                  id="details"
                  name="details"
                  value={shippingAddress.details}
                  onChange={handleChange}
                  placeholder="Enter your full address"
                  rows="4"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="checkout-form-row">
                <div className="checkout-form-group">
                  <label htmlFor="phone">
                    Phone
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="checkout-form-group">
                  <label htmlFor="city">
                    City
                  </label>

                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="checkout-form-group">
                <label htmlFor="postalCode">
                  Postal Code
                </label>

                <input
                  id="postalCode"
                  type="text"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleChange}
                  placeholder="Enter postal code"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="checkout-section-card">
              <h2>Payment Method</h2>

              <div className="payment-methods">
                <label
                  className={
                    paymentMethod === "cash"
                      ? "payment-option active"
                      : "payment-option"
                  }
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={
                      paymentMethod === "cash"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                    disabled={isSubmitting}
                  />

                  <span>
                    <strong>
                      Cash on Delivery
                    </strong>

                    <small>
                      Pay when your order arrives.
                    </small>
                  </span>
                </label>

                <label
                  className={
                    paymentMethod === "card"
                      ? "payment-option active"
                      : "payment-option"
                  }
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={
                      paymentMethod === "card"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                    disabled={isSubmitting}
                  />

                  <span>
                    <strong>
                      Credit / Debit Card
                    </strong>

                    <small>
                      Pay securely using Stripe.
                    </small>
                  </span>
                </label>
              </div>
            </div>
          </section>

          <aside className="checkout-summary">
            <h2>Order Summary</h2>

            <div className="checkout-products">
              {cartItems.map((item) => {
                const product = item.product;

                return (
                  <div
                    key={item._id}
                    className="checkout-product"
                  >
                    <div className="checkout-product-image">
                      <img
                        src={product.imageCover}
                        alt={product.title}
                      />
                    </div>

                    <div className="checkout-product-info">
                      <h3>
                        {product.title}
                      </h3>

                      <p>
                        Quantity: {item.quantity}
                      </p>

                      <strong>
                        ${item.totalPrice}
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="checkout-summary-row">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>

            <div className="checkout-summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="checkout-summary-row">
              <span>Tax</span>
              <span>$0</span>
            </div>

            {cart.totalPriceAfterDiscount !==
              undefined &&
              cart.totalPriceAfterDiscount !==
                cart.totalCartPrice && (
                <div className="checkout-summary-row">
                  <span>
                    Discounted Total
                  </span>

                  <span>
                    $
                    {
                      cart.totalPriceAfterDiscount
                    }
                  </span>
                </div>
              )}

            <div className="checkout-summary-divider" />

            <div className="checkout-total">
              <span>Total</span>

              <strong>${total}</strong>
            </div>

            <button
              type="submit"
              className="place-order-button"
              disabled={isSubmitting}
            >
              {orderLoading
                ? "Placing Order..."
                : paymentMethod === "cash"
                  ? "Place Order"
                  : "Continue to Payment"}
            </button>

            <button
              type="button"
              className="back-to-cart-button"
              onClick={() => navigate("/cart")}
              disabled={isSubmitting}
            >
              Back to Cart
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
}

export default Checkout;