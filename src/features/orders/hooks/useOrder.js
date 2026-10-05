import { useCallback } from "react";
import { useDispatch } from "react-redux";

import {
  createCashOrder,
  getOrders,
  getOrderById,
  deleteOrder,
  getCheckoutSession,
} from "../api/orderApi";

import { orderActions } from "../orderSlice";

function useOrder() {
  const dispatch = useDispatch();

  const createCash = useCallback(
    async (cartId, shippingAddress) => {
      try {
        dispatch(orderActions.setLoading());

        const data = await createCashOrder(
          cartId,
          shippingAddress
        );

        dispatch(
          orderActions.createOrderSuccess(
            data.data
          )
        );

        return data;
      } catch (error) {
        console.log(
          "Create Cash Order Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to create cash order";

        dispatch(
          orderActions.setError(message)
        );

        throw error;
      }
    },
    [dispatch]
  );

  const fetchOrders = useCallback(
    async () => {
      try {
        dispatch(orderActions.setLoading());

        const data = await getOrders();

        dispatch(
          orderActions.getOrdersSuccess(
            data.data
          )
        );

        return data;
      } catch (error) {
        console.log(
          "Fetch Orders Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to fetch orders";

        dispatch(
          orderActions.setError(message)
        );

        return null;
      }
    },
    [dispatch]
  );

  const fetchOrder = useCallback(
    async (orderId) => {
      try {
        dispatch(orderActions.setLoading());

        const data =
          await getOrderById(orderId);

        dispatch(
          orderActions.getOrderSuccess(
            data.data
          )
        );

        return data;
      } catch (error) {
        console.log(
          "Fetch Order Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to fetch order";

        dispatch(
          orderActions.setError(message)
        );

        return null;
      }
    },
    [dispatch]
  );

  const removeOrder = useCallback(
    async (orderId) => {
      try {
        dispatch(orderActions.setLoading());

        await deleteOrder(orderId);

        dispatch(
          orderActions.deleteOrderSuccess(
            orderId
          )
        );
      } catch (error) {
        console.log(
          "Delete Order Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to delete order";

        dispatch(
          orderActions.setError(message)
        );

        throw error;
      }
    },
    [dispatch]
  );

  const createCheckoutSession =
    useCallback(
      async (
        cartId,
        shippingAddress
      ) => {
        try {
          dispatch(
            orderActions.setLoading()
          );

          const data =
            await getCheckoutSession(
              cartId,
              shippingAddress
            );

          return data;
        } catch (error) {
          console.log(
            "Checkout Session Error:",
            error
          );

          const message =
            error.response?.data?.message ||
            "Failed to create checkout session";

          dispatch(
            orderActions.setError(message)
          );

          throw error;
        }
      },
      [dispatch]
    );

  return {
    createCash,
    fetchOrders,
    fetchOrder,
    removeOrder,
    createCheckoutSession,
  };
}

export default useOrder;