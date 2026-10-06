import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import useOrder from "../../../features/orders/hooks/useOrder";

/* =========================================================
   الـ CSS جوه الملف نفسه، وكل القواعد متقيّدة بـ .ord-x
   ========================================================= */
const css = `
.ord-x { width: 100%; min-height: 650px; background-color: #f8fafc; }
.ord-x *, .ord-x *::before, .ord-x *::after { box-sizing: border-box; }

.ord-x .ord-container { max-width: 1400px; margin: 0 auto; padding: 40px; }

.ord-x .ord-header { margin-bottom: 25px; }
.ord-x .ord-header h1 { margin: 0 0 6px; color: #111827; font-size: 30px; font-weight: 800; }
.ord-x .ord-header p { margin: 0; color: #6b7280; font-size: 14px; }

.ord-x .ord-list { display: flex; flex-direction: column; gap: 20px; }

.ord-x .ord-card { overflow: hidden; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; }

.ord-x .ord-card-head { padding: 20px 25px; display: flex; align-items: center; justify-content: space-between; gap: 20px; border-bottom: 1px solid #e5e7eb; }
.ord-x .ord-card-head > div { display: flex; flex-direction: column; gap: 5px; }
.ord-x .ord-label { color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.ord-x .ord-id { color: #111827; font-size: 13px; font-weight: 700; word-break: break-all; }

.ord-x .ord-status { padding: 7px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
.ord-x .ord-status.ord-pending { background-color: #fff7ed; color: #ea580c; }
.ord-x .ord-status.ord-delivered { background-color: #ecfdf5; color: #047857; }

.ord-x .ord-info { padding: 20px 25px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; border-bottom: 1px solid #f3f4f6; }
.ord-x .ord-info-item { display: flex; flex-direction: column; gap: 6px; }
.ord-x .ord-info-item span { color: #6b7280; font-size: 12px; }
.ord-x .ord-info-item strong { color: #111827; font-size: 14px; }
.ord-x .ord-info-item strong.ord-paid { color: #047857; }
.ord-x .ord-info-item strong.ord-not-paid { color: #ea580c; }

.ord-x .ord-products { padding: 20px 25px; display: flex; flex-direction: column; gap: 15px; }
.ord-x .ord-product { display: flex; align-items: center; gap: 15px; }
.ord-x .ord-product-image { width: 75px; height: 75px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-radius: 7px; background-color: #f8fafc; overflow: hidden; }
.ord-x .ord-product-image img { width: 100%; height: 100%; padding: 5px; object-fit: contain; }
.ord-x .ord-product-info { min-width: 0; flex: 1; }
.ord-x .ord-product-info h3 { margin: 0 0 5px; color: #111827; font-size: 14px; font-weight: 700; line-height: 1.4; }
.ord-x .ord-product-info p { margin: 0 0 5px; color: #6b7280; font-size: 12px; }
.ord-x .ord-product-info strong { color: #111827; font-size: 14px; }

.ord-x .ord-card-footer { padding: 15px 25px; display: flex; justify-content: flex-end; border-top: 1px solid #f3f4f6; }
.ord-x .ord-details-btn { min-width: 120px; height: 40px; padding: 0 18px; display: flex; align-items: center; justify-content: center; border-radius: 6px; background-color: #111827; color: #ffffff; font-size: 12px; font-weight: 700; text-decoration: none; }
.ord-x .ord-details-btn:hover { background-color: #374151; }

.ord-x .ord-empty { min-height: 500px; padding: 50px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; text-align: center; }
.ord-x .ord-empty-icon { margin-bottom: 15px; font-size: 65px; }
.ord-x .ord-empty h1 { margin: 0 0 10px; color: #111827; font-size: 26px; }
.ord-x .ord-empty p { margin: 0 0 25px; color: #6b7280; font-size: 14px; }
.ord-x .ord-shop-btn { padding: 12px 25px; border-radius: 7px; background-color: #111827; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; }
.ord-x .ord-shop-btn:hover { background-color: #374151; }

.ord-x .ord-message { max-width: 1400px; min-height: 400px; margin: 0 auto; padding: 40px; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 16px; text-align: center; }
.ord-x .ord-message.ord-error { color: #dc2626; }
.ord-x .ord-error-box { margin-bottom: 20px; padding: 12px 15px; border: 1px solid #fecaca; border-radius: 7px; background-color: #fef2f2; color: #dc2626; font-size: 13px; }

@media (max-width: 900px) {
  .ord-x .ord-info { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 650px) {
  .ord-x .ord-container { padding: 30px 20px; }
  .ord-x .ord-card-head { padding: 18px; }
  .ord-x .ord-info { padding: 18px; }
  .ord-x .ord-products { padding: 18px; }
  .ord-x .ord-card-footer { padding: 15px 18px; }
}

@media (max-width: 500px) {
  .ord-x .ord-container { padding: 25px 15px 50px; }
  .ord-x .ord-info { grid-template-columns: 1fr; gap: 15px; }
  .ord-x .ord-card-head { align-items: flex-start; flex-direction: column; }
  .ord-x .ord-card-footer { justify-content: stretch; }
  .ord-x .ord-details-btn { width: 100%; }
}
`;

/* الغلاف المشترك: بيحط الـ CSS والجذر في كل الحالات */
function Shell({ children }) {
  return (
    <div className="ord-x">
      <style>{css}</style>
      {children}
    </div>
  );
}

function Orders() {
  const { fetchOrders } = useOrder();

  const { orders, loading, error } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading && orders.length === 0) {
    return (
      <Shell>
        <div className="ord-message">Loading orders...</div>
      </Shell>
    );
  }

  if (error && orders.length === 0) {
    return (
      <Shell>
        <div className="ord-message ord-error">{error}</div>
      </Shell>
    );
  }

  if (orders.length === 0) {
    return (
      <Shell>
        <div className="ord-container">
          <div className="ord-empty">
            <div className="ord-empty-icon">📦</div>

            <h1>No Orders Yet</h1>

            <p>You haven't placed any orders yet.</p>

            <Link to="/products" className="ord-shop-btn">
              Start Shopping
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="ord-container">
        <div className="ord-header">
          <div>
            <h1>My Orders</h1>

            <p>
              {orders.length}{" "}
              {orders.length === 1 ? "order" : "orders"} in your
              account
            </p>
          </div>
        </div>

        {error && <div className="ord-error-box">{error}</div>}

        <div className="ord-list">
          {orders.map((order) => (
            <article key={order._id} className="ord-card">
              <div className="ord-card-head">
                <div>
                  <span className="ord-label">Order ID</span>

                  <strong className="ord-id">#{order._id}</strong>
                </div>

                <span
                  className={
                    order.isDelivered
                      ? "ord-status ord-delivered"
                      : "ord-status ord-pending"
                  }
                >
                  {order.isDelivered ? "Delivered" : "Processing"}
                </span>
              </div>

              <div className="ord-info">
                <div className="ord-info-item">
                  <span>Order Date</span>

                  <strong>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "-"}
                  </strong>
                </div>

                <div className="ord-info-item">
                  <span>Payment</span>

                  <strong>
                    {order.paymentMethod === "card"
                      ? "Card"
                      : "Cash on Delivery"}
                  </strong>
                </div>

                <div className="ord-info-item">
                  <span>Payment Status</span>

                  <strong
                    className={order.isPaid ? "ord-paid" : "ord-not-paid"}
                  >
                    {order.isPaid ? "Paid" : "Not Paid"}
                  </strong>
                </div>

                <div className="ord-info-item">
                  <span>Total</span>

                  <strong>${order.totalOrderPrice || 0}</strong>
                </div>
              </div>

              <div className="ord-products">
                {order.cartItems?.map((item) => (
                  <div key={item._id} className="ord-product">
                    <div className="ord-product-image">
                      <img
                        src={item.product?.imageCover}
                        alt={item.product?.title || "Product"}
                      />
                    </div>

                    <div className="ord-product-info">
                      <h3>{item.product?.title || "Product"}</h3>

                      <p>Quantity: {item.quantity}</p>

                      <strong>${item.totalPrice}</strong>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ord-card-footer">
                <Link
                  to={`/orders/${order._id}`}
                  className="ord-details-btn"
                >
                  View Order
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export default Orders;
