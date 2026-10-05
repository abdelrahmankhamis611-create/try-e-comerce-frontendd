import { useCallback } from "react";
import { useDispatch } from "react-redux";

import {
  getOrders,
  getOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
  deleteOrder,
} from "../api/orderApi";

import { orderActions } from "../orderSlice";

function useOrders() {
  const dispatch = useDispatch();

  // =========================
  // Get All Orders
  // =========================

  const fetchOrders = useCallback(
    async (params = {}) => {
      try {
        dispatch(orderActions.setLoading());

        const data = await getOrders(params);

        dispatch(
          orderActions.getOrdersSuccess(data.data)
        );

        return data;
      } catch (error) {
        console.log("Fetch Orders Error:", error);

        const message =
          error.response?.data?.message ||
          "Failed to fetch orders";

        dispatch(orderActions.setError(message));

        return null;
      }
    },
    [dispatch]
  );

  // =========================
  // Get One Order
  // =========================

  const fetchOrderById = useCallback(
    async (orderId) => {
      try {
        dispatch(orderActions.setLoading());

        const data = await getOrderById(orderId);

        dispatch(
          orderActions.getOrderByIdSuccess(data.data)
        );

        return data;
      } catch (error) {
        console.log("Fetch Order Error:", error);

        const message =
          error.response?.data?.message ||
          "Failed to fetch order";

        dispatch(orderActions.setError(message));

        return null;
      }
    },
    [dispatch]
  );

  // =========================
  // Mark Order As Paid
  // =========================

  const handleMarkOrderAsPaid = useCallback(
    async (orderId) => {
      try {
        dispatch(orderActions.setLoading());

        const data = await markOrderAsPaid(orderId);

        dispatch(
          orderActions.updateOrderSuccess(data.data)
        );

        return data;
      } catch (error) {
        console.log(
          "Mark Order As Paid Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to mark order as paid";

        dispatch(orderActions.setError(message));

        throw error;
      }
    },
    [dispatch]
  );

  // =========================
  // Mark Order As Delivered
  // =========================

  const handleMarkOrderAsDelivered = useCallback(
    async (orderId) => {
      try {
        dispatch(orderActions.setLoading());

        const data =
          await markOrderAsDelivered(orderId);

        dispatch(
          orderActions.updateOrderSuccess(data.data)
        );

        return data;
      } catch (error) {
        console.log(
          "Mark Order As Delivered Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to mark order as delivered";

        dispatch(orderActions.setError(message));

        throw error;
      }
    },
    [dispatch]
  );

  // =========================
  // Delete Order
  // =========================

  const handleDeleteOrder = useCallback(
    async (orderId) => {
      try {
        dispatch(orderActions.setLoading());

        await deleteOrder(orderId);

        dispatch(
          orderActions.deleteOrderSuccess(orderId)
        );
      } catch (error) {
        console.log(
          "Delete Order Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to delete order";

        dispatch(orderActions.setError(message));

        throw error;
      }
    },
    [dispatch]
  );

  return {
    fetchOrders,
    fetchOrderById,
    handleMarkOrderAsPaid,
    handleMarkOrderAsDelivered,
    handleDeleteOrder,
  };
}

export default useOrders;