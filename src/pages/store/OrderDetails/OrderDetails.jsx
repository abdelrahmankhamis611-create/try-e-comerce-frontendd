import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import useOrder from "../../../features/orders/hooks/useOrder";

import "./OrderDetails.css";

function OrderDetails() {
  const { orderId } = useParams();

  const { fetchOrder } = useOrder();

  const {
    order,
    loading,
    error,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId, fetchOrder]);

  if (loading) {
    return (
      <main className="order-details-page">
        <div className="order-details-message">
          Loading order...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="order-details-page">
        <div className="order-details-message order-details-error">
          {error}
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="order-details-page">
        <div className="order-details-message">
          Order not found.
        </div>
      </main>
    );
  }

  return (
    <main className="order-details-page">
      <div className="order-details-container">
        <div className="order-details-header">
          <div>
            <Link
              to="/orders"
              className="back-to-orders"
            >
              ← Back to Orders
            </Link>

            <h1>Order Details</h1>

            <p>
              Order #{order._id}
            </p>
          </div>

          <span
            className={
              order.isDelivered
                ? "order-details-status delivered"
                : "order-details-status pending"
            }
          >
            {order.isDelivered
              ? "Delivered"
              : "Processing"}
          </span>
        </div>

        <div className="order-details-content">
          <section className="order-details-main">
            <div className="order-details-card">
              <h2>Products</h2>

              <div className="order-details-products">
                {order.cartItems?.map(
                  (item) => (
                    <div
                      key={item._id}
                      className="order-details-product"
                    >
                      <div className="order-details-product-image">
                        <img
                          src={
                            item.product
                              ?.imageCover
                          }
                          alt={
                            item.product
                              ?.title ||
                            "Product"
                          }
                        />
                      </div>

                      <div className="order-details-product-info">
                        <h3>
                          {item.product
                            ?.title ||
                            "Product"}
                        </h3>

                        <p>
                          Quantity:{" "}
                          {item.quantity}
                        </p>

                        {item.color && (
                          <p>
                            Color:{" "}
                            {item.color}
                          </p>
                        )}

                        <strong>
                          $
                          {item.totalPrice}
                        </strong>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="order-details-card">
              <h2>Shipping Address</h2>

              <div className="shipping-address">
                <p>
                  <strong>
                    Address:
                  </strong>{" "}
                  {order.shippingAddress
                    ?.details || "-"}
                </p>

                <p>
                  <strong>
                    Phone:
                  </strong>{" "}
                  {order.shippingAddress
                    ?.phone || "-"}
                </p>

                <p>
                  <strong>
                    City:
                  </strong>{" "}
                  {order.shippingAddress
                    ?.city || "-"}
                </p>

                <p>
                  <strong>
                    Postal Code:
                  </strong>{" "}
                  {order.shippingAddress
                    ?.postalCode || "-"}
                </p>
              </div>
            </div>
          </section>

          <aside className="order-details-sidebar">
            <div className="order-details-card">
              <h2>Order Summary</h2>

              <div className="order-summary-row">
                <span>Payment Method</span>

                <strong>
                  {order.paymentMethod ===
                  "card"
                    ? "Card"
                    : "Cash on Delivery"}
                </strong>
              </div>

              <div className="order-summary-row">
                <span>Payment Status</span>

                <strong
                  className={
                    order.isPaid
                      ? "summary-paid"
                      : "summary-not-paid"
                  }
                >
                  {order.isPaid
                    ? "Paid"
                    : "Not Paid"}
                </strong>
              </div>

              <div className="order-summary-row">
                <span>Delivery Status</span>

                <strong>
                  {order.isDelivered
                    ? "Delivered"
                    : "Processing"}
                </strong>
              </div>

              <div className="order-summary-row">
                <span>Order Date</span>

                <strong>
                  {order.createdAt
                    ? new Date(
                        order.createdAt
                      ).toLocaleDateString()
                    : "-"}
                </strong>
              </div>

              <div className="order-summary-divider" />

              <div className="order-summary-row">
                <span>Tax</span>

                <span>
                  ${order.taxprice || 0}
                </span>
              </div>

              <div className="order-summary-row">
                <span>Shipping</span>

                <span>
                  $
                  {order.shippingPrice ||
                    0}
                </span>
              </div>

              <div className="order-summary-divider" />

              <div className="order-details-total">
                <span>Total</span>

                <strong>
                  $
                  {order.totalOrderPrice ||
                    0}
                </strong>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default OrderDetails;