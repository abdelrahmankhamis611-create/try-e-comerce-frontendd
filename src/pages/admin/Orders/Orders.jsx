import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

import useOrders from "../../../features/orders/hooks/useOrders";

import "./Orders.css";

function Orders() {
  const {
    fetchOrders,
    fetchOrderById,
    handleMarkOrderAsPaid,
    handleMarkOrderAsDelivered,
    handleDeleteOrder,
  } = useOrders();

  const { orders, order, loading, error } = useSelector(
    (state) => state.orders
  );

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // =========================
  // FILTERS
  // =========================

  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // =========================
  // VIEW ORDER
  // =========================

  const handleViewOrder = async (orderId) => {
    const result = await fetchOrderById(orderId);

    if (result?.data) {
      setSelectedOrder(result.data);
      setShowDetails(true);
    }
  };

  // =========================
  // MARK PAID
  // =========================

  const handlePaid = async (orderId) => {
    try {
      await handleMarkOrderAsPaid(orderId);

      await fetchOrders();

      Swal.fire({
        icon: "success",
        title: "Order Paid",
        text: "Order has been marked as paid successfully.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to mark order as paid.",
      });
    }
  };

  // =========================
  // MARK DELIVERED
  // =========================

  const handleDelivered = async (orderId) => {
    try {
      await handleMarkOrderAsDelivered(orderId);

      await fetchOrders();

      Swal.fire({
        icon: "success",
        title: "Order Delivered",
        text: "Order has been marked as delivered successfully.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to mark order as delivered.",
      });
    }
  };

  // =========================
  // DELETE ORDER
  // =========================

  const handleDelete = async (orderId) => {
    const result = await Swal.fire({
      title: "Delete Order?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await handleDeleteOrder(orderId);

      if (selectedOrder?._id === orderId) {
        setSelectedOrder(null);
        setShowDetails(false);
      }

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Order has been deleted successfully.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to delete order.",
      });
    }
  };

  // =========================
  // CLOSE DETAILS
  // =========================

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedOrder(null);
  };

  // =========================
  // STATUS HELPERS
  // =========================

  const getPaymentStatus = (currentOrder) => {
    return currentOrder?.isPaid ? "Paid" : "Not Paid";
  };

  const getDeliveryStatus = (currentOrder) => {
    return currentOrder?.isDelivered ? "Delivered" : "Not Delivered";
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-GB");
  };

  // =========================
  // FILTER ORDERS
  // =========================

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return orders.filter((currentOrder) => {
      const orderId =
        currentOrder._id?.toLowerCase() || "";

      const customerName =
        currentOrder.user?.name?.toLowerCase() || "";

      const customerEmail =
        currentOrder.user?.email?.toLowerCase() || "";

      const matchesSearch =
        !normalizedSearch ||
        orderId.includes(normalizedSearch) ||
        customerName.includes(normalizedSearch) ||
        customerEmail.includes(normalizedSearch);

      const matchesPayment =
        paymentFilter === "all" ||
        (paymentFilter === "paid" &&
          currentOrder.isPaid) ||
        (paymentFilter === "not-paid" &&
          !currentOrder.isPaid);

      const matchesDelivery =
        deliveryFilter === "all" ||
        (deliveryFilter === "delivered" &&
          currentOrder.isDelivered) ||
        (deliveryFilter === "not-delivered" &&
          !currentOrder.isDelivered);

      return (
        matchesSearch &&
        matchesPayment &&
        matchesDelivery
      );
    });
  }, [
    orders,
    searchTerm,
    paymentFilter,
    deliveryFilter,
  ]);

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    setSearchTerm("");
    setPaymentFilter("all");
    setDeliveryFilter("all");
  };

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    paymentFilter !== "all" ||
    deliveryFilter !== "all";

  return (
    <div className="admin-page orders-page">
      {/* =========================
          HEADER
      ========================= */}

      <div className="admin-page-header orders-header">
        <div>
          <h2>Orders</h2>

          <p>
            Manage customer orders, payments and deliveries.
          </p>
        </div>

        <div className="orders-count">
          {filteredOrders.length} / {orders.length} Orders
        </div>
      </div>

      {/* =========================
          FILTERS
      ========================= */}

      {!loading && !error && orders.length > 0 && (
        <div className="orders-filters">
          <div className="orders-search-box">
            <span className="orders-search-icon">
              🔍
            </span>

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search by order ID, customer or email..."
            />
          </div>

          <div className="orders-filter-select">
            <label htmlFor="payment-filter">
              Payment
            </label>

            <select
              id="payment-filter"
              value={paymentFilter}
              onChange={(event) =>
                setPaymentFilter(event.target.value)
              }
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="not-paid">Not Paid</option>
            </select>
          </div>

          <div className="orders-filter-select">
            <label htmlFor="delivery-filter">
              Delivery
            </label>

            <select
              id="delivery-filter"
              value={deliveryFilter}
              onChange={(event) =>
                setDeliveryFilter(event.target.value)
              }
            >
              <option value="all">All Deliveries</option>
              <option value="delivered">Delivered</option>
              <option value="not-delivered">
                Not Delivered
              </option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="orders-clear-filters"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <div className="orders-loading">
          Loading orders...
        </div>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {error && !loading && (
        <div className="orders-error">
          {error}
        </div>
      )}

      {/* =========================
          NO ORDERS
      ========================= */}

      {!loading &&
        !error &&
        orders.length === 0 && (
          <div className="admin-empty-state">
            <h3>No Orders Found</h3>

            <p>
              There are no orders available right now.
            </p>
          </div>
        )}

      {/* =========================
          NO FILTER RESULTS
      ========================= */}

      {!loading &&
        !error &&
        orders.length > 0 &&
        filteredOrders.length === 0 && (
          <div className="admin-empty-state orders-no-results">
            <h3>No Matching Orders</h3>

            <p>
              Try changing your search or filters.
            </p>

            <button
              type="button"
              className="orders-clear-results"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}

      {/* =========================
          ORDERS TABLE
      ========================= */}

      {!loading &&
        !error &&
        filteredOrders.length > 0 && (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Delivery</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((currentOrder) => (
                  <tr key={currentOrder._id}>
                    <td data-label="Order">
                      <span className="order-id">
                        #{currentOrder._id?.slice(-6)}
                      </span>
                    </td>

                    <td data-label="Customer">
                      <div className="order-customer">
                        <strong>
                          {currentOrder.user?.name ||
                            "Unknown"}
                        </strong>

                        <span>
                          {currentOrder.user?.email || "-"}
                        </span>
                      </div>
                    </td>

                    <td data-label="Total">
                      <strong className="order-total">
                        {currentOrder.totalOrderPrice ?? 0} EGP
                      </strong>
                    </td>

                    <td data-label="Payment">
                      <div className="order-status-group">
                        <span
                          className={`order-status ${
                            currentOrder.isPaid
                              ? "status-success"
                              : "status-warning"
                          }`}
                        >
                          {getPaymentStatus(currentOrder)}
                        </span>

                        <small>
                          {currentOrder.paymentMethod ||
                            "cash"}
                        </small>
                      </div>
                    </td>

                    <td data-label="Delivery">
                      <span
                        className={`order-status ${
                          currentOrder.isDelivered
                            ? "status-success"
                            : "status-warning"
                        }`}
                      >
                        {getDeliveryStatus(currentOrder)}
                      </span>
                    </td>

                    <td data-label="Date">
                      {formatDate(currentOrder.createdAt)}
                    </td>

                    <td data-label="Actions">
                      <div className="orders-actions">
                        <button
                          type="button"
                          className="order-btn view-btn"
                          onClick={() =>
                            handleViewOrder(
                              currentOrder._id
                            )
                          }
                        >
                          View
                        </button>

                        {!currentOrder.isPaid && (
                          <button
                            type="button"
                            className="order-btn paid-btn"
                            onClick={() =>
                              handlePaid(
                                currentOrder._id
                              )
                            }
                          >
                            Mark Paid
                          </button>
                        )}

                        {!currentOrder.isDelivered && (
                          <button
                            type="button"
                            className="order-btn delivered-btn"
                            onClick={() =>
                              handleDelivered(
                                currentOrder._id
                              )
                            }
                          >
                            Deliver
                          </button>
                        )}

                        <button
                          type="button"
                          className="order-btn delete-btn"
                          onClick={() =>
                            handleDelete(
                              currentOrder._id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      {/* =========================
          ORDER DETAILS MODAL
      ========================= */}

      {showDetails && selectedOrder && (
        <div
          className="order-modal-overlay"
          onClick={closeDetails}
        >
          <div
            className="order-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="order-modal-header">
              <div>
                <h3>Order Details</h3>

                <span>
                  #{selectedOrder._id}
                </span>
              </div>

              <button
                type="button"
                className="order-modal-close"
                onClick={closeDetails}
              >
                ×
              </button>
            </div>

            <div className="order-modal-body">
              {/* CUSTOMER */}

              <div className="order-details-section">
                <h4>Customer Information</h4>

                <div className="order-info-grid">
                  <div>
                    <span>Name</span>

                    <strong>
                      {selectedOrder.user?.name || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Email</span>

                    <strong>
                      {selectedOrder.user?.email || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Phone</span>

                    <strong>
                      {selectedOrder.user?.phone || "-"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* SHIPPING */}

              <div className="order-details-section">
                <h4>Shipping Address</h4>

                <div className="order-info-grid">
                  <div>
                    <span>Details</span>

                    <strong>
                      {selectedOrder.shippingAddress
                        ?.details || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>City</span>

                    <strong>
                      {selectedOrder.shippingAddress
                        ?.city || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Postal Code</span>

                    <strong>
                      {selectedOrder.shippingAddress
                        ?.postalCode || "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Phone</span>

                    <strong>
                      {selectedOrder.shippingAddress
                        ?.phone || "-"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* ITEMS */}

              <div className="order-details-section">
                <h4>Order Items</h4>

                <div className="order-items">
                  {selectedOrder.cartItems?.map(
                    (item, index) => (
                      <div
                        className="order-item"
                        key={`${
                          item.product?._id || "item"
                        }-${index}`}
                      >
                        <div className="order-item-image">
                          {item.product?.imageCover ? (
                            <img
                              src={item.product.imageCover}
                              alt={
                                item.product?.title ||
                                "Product"
                              }
                            />
                          ) : (
                            <span>No Image</span>
                          )}
                        </div>

                        <div className="order-item-info">
                          <strong>
                            {item.product?.title ||
                              "Unknown Product"}
                          </strong>

                          <span>
                            Quantity: {item.quantity || 0}
                          </span>

                          <span>
                            Price:{" "}
                            {item.pricePerUnit || 0} EGP
                          </span>
                        </div>

                        <strong className="order-item-total">
                          {item.totalPrice ||
                            (item.pricePerUnit || 0) *
                              (item.quantity || 0)}{" "}
                          EGP
                        </strong>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* SUMMARY */}

              <div className="order-details-summary">
                <div>
                  <span>Payment Method</span>

                  <strong>
                    {selectedOrder.paymentMethod ||
                      "cash"}
                  </strong>
                </div>

                <div>
                  <span>Payment Status</span>

                  <strong
                    className={
                      selectedOrder.isPaid
                        ? "text-success"
                        : "text-warning"
                    }
                  >
                    {selectedOrder.isPaid
                      ? "Paid"
                      : "Not Paid"}
                  </strong>
                </div>

                <div>
                  <span>Delivery Status</span>

                  <strong
                    className={
                      selectedOrder.isDelivered
                        ? "text-success"
                        : "text-warning"
                    }
                  >
                    {selectedOrder.isDelivered
                      ? "Delivered"
                      : "Not Delivered"}
                  </strong>
                </div>

                <div className="order-grand-total">
                  <span>Total Order Price</span>

                  <strong>
                    {selectedOrder.totalOrderPrice ||
                      0}{" "}
                    EGP
                  </strong>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}

            <div className="order-modal-footer">
              {!selectedOrder.isPaid && (
                <button
                  type="button"
                  className="order-btn paid-btn"
                  onClick={async () => {
                    await handlePaid(
                      selectedOrder._id
                    );

                    const refreshedOrder =
                      await fetchOrderById(
                        selectedOrder._id
                      );

                    if (refreshedOrder?.data) {
                      setSelectedOrder(
                        refreshedOrder.data
                      );
                    }
                  }}
                >
                  Mark Paid
                </button>
              )}

              {!selectedOrder.isDelivered && (
                <button
                  type="button"
                  className="order-btn delivered-btn"
                  onClick={async () => {
                    await handleDelivered(
                      selectedOrder._id
                    );

                    const refreshedOrder =
                      await fetchOrderById(
                        selectedOrder._id
                      );

                    if (refreshedOrder?.data) {
                      setSelectedOrder(
                        refreshedOrder.data
                      );
                    }
                  }}
                >
                  Mark Delivered
                </button>
              )}

              <button
                type="button"
                className="order-btn delete-btn"
                onClick={() =>
                  handleDelete(selectedOrder._id)
                }
              >
                Delete
              </button>

              <button
                type="button"
                className="order-btn close-btn"
                onClick={closeDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;