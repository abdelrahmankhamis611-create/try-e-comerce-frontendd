import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import useOrder from "../../../features/orders/hooks/useOrder";

import "./Orders.css";

function Orders() {
  const { fetchOrders } = useOrder();

  const {
    orders,
    loading,
    error,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading && orders.length === 0) {
    return (
      <main className="orders-page">
        <div className="orders-message">
          Loading orders...
        </div>
      </main>
    );
  }

  if (error && orders.length === 0) {
    return (
      <main className="orders-page">
        <div className="orders-message orders-error">
          {error}
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="orders-page">
        <div className="orders-container">
          <div className="orders-empty">
            <div className="orders-empty-icon">
              📦
            </div>

            <h1>No Orders Yet</h1>

            <p>
              You haven't placed any orders
              yet.
            </p>

            <Link
              to="/products"
              className="orders-shopping-button"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <div>
            <h1>My Orders</h1>

            <p>
              {orders.length}{" "}
              {orders.length === 1
                ? "order"
                : "orders"}{" "}
              in your account
            </p>
          </div>
        </div>

        {error && (
          <div className="orders-error-box">
            {error}
          </div>
        )}

        <div className="orders-list">
          {orders.map((order) => (
            <article
              key={order._id}
              className="order-card"
            >
              <div className="order-card-header">
                <div>
                  <span className="order-label">
                    Order ID
                  </span>

                  <strong className="order-id">
                    #{order._id}
                  </strong>
                </div>

                <span
                  className={
                    order.isDelivered
                      ? "order-status delivered"
                      : "order-status pending"
                  }
                >
                  {order.isDelivered
                    ? "Delivered"
                    : "Processing"}
                </span>
              </div>

              <div className="order-card-info">
                <div className="order-info-item">
                  <span>
                    Order Date
                  </span>

                  <strong>
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </strong>
                </div>

                <div className="order-info-item">
                  <span>
                    Payment
                  </span>

                  <strong>
                    {order.paymentMethod ===
                    "card"
                      ? "Card"
                      : "Cash on Delivery"}
                  </strong>
                </div>

                <div className="order-info-item">
                  <span>
                    Payment Status
                  </span>

                  <strong
                    className={
                      order.isPaid
                        ? "paid"
                        : "not-paid"
                    }
                  >
                    {order.isPaid
                      ? "Paid"
                      : "Not Paid"}
                  </strong>
                </div>

                <div className="order-info-item">
                  <span>
                    Total
                  </span>

                  <strong>
                    $
                    {order.totalOrderPrice ||
                      0}
                  </strong>
                </div>
              </div>

              <div className="order-products">
                {order.cartItems?.map(
                  (item) => (
                    <div
                      key={item._id}
                      className="order-product"
                    >
                      <div className="order-product-image">
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

                      <div className="order-product-info">
                        <h3>
                          {item.product
                            ?.title ||
                            "Product"}
                        </h3>

                        <p>
                          Quantity:{" "}
                          {item.quantity}
                        </p>

                        <strong>
                          $
                          {item.totalPrice}
                        </strong>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="order-card-footer">
                <Link
                  to={`/orders/${order._id}`}
                  className="order-details-button"
                >
                  View Order
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Orders;