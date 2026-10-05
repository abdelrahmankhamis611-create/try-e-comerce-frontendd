import { useCallback } from "react";
import { useDispatch } from "react-redux";

import {
  getCart,
  addProductToCart,
  clearCart,
  removeProductFromCart,
  updateCartQuantity,
  applyCoupon,
} from "../api/cartApi";

import { cartActions } from "../cartSlice";

function useCart() {
  const dispatch = useDispatch();

  const fetchCart = useCallback(async () => {
    try {
      dispatch(cartActions.setLoading());

      const data = await getCart();

      dispatch(
        cartActions.getCartSuccess(data.data)
      );

      return data;
    } catch (error) {
      console.log("Fetch Cart Error:", error);

      // User does not have a cart yet
      if (error.response?.status === 404) {
        dispatch(
          cartActions.getCartSuccess(null)
        );

        return null;
      }

      const message =
        error.response?.data?.message ||
        "Failed to fetch cart";

      dispatch(cartActions.setError(message));

      return null;
    }
  }, [dispatch]);

  const addToCart = useCallback(
    async (productId, color, quantity) => {
      try {
        dispatch(cartActions.setLoading());

        const data = await addProductToCart(
          productId,
          color,
          quantity
        );

        dispatch(
          cartActions.addToCartSuccess(data.data)
        );

        return data;
      } catch (error) {
        console.log(
          "Add To Cart Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to add product to cart";

        dispatch(
          cartActions.setError(message)
        );

        throw error;
      }
    },
    [dispatch]
  );

  const removeItem = useCallback(
    async (itemId) => {
      try {
        dispatch(cartActions.setLoading());

        const data =
          await removeProductFromCart(itemId);

        dispatch(
          cartActions.removeItemSuccess(
            data.data
          )
        );

        return data;
      } catch (error) {
        console.log(
          "Remove Cart Item Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to remove product from cart";

        dispatch(
          cartActions.setError(message)
        );

        throw error;
      }
    },
    [dispatch]
  );

  const updateQuantity = useCallback(
    async (itemId, quantity) => {
      try {
        dispatch(cartActions.setLoading());

        const data =
          await updateCartQuantity(
            itemId,
            quantity
          );

        dispatch(
          cartActions.updateQuantitySuccess(
            data.data
          )
        );

        return data;
      } catch (error) {
        console.log(
          "Update Cart Quantity Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to update cart quantity";

        dispatch(
          cartActions.setError(message)
        );

        throw error;
      }
    },
    [dispatch]
  );

  const removeAllCart = useCallback(
    async () => {
      try {
        dispatch(cartActions.setLoading());

        await clearCart();

        dispatch(
          cartActions.clearCartSuccess()
        );
      } catch (error) {
        console.log(
          "Clear Cart Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to clear cart";

        dispatch(
          cartActions.setError(message)
        );

        throw error;
      }
    },
    [dispatch]
  );

  const handleApplyCoupon = useCallback(
    async (coupon) => {
      try {
        dispatch(cartActions.setLoading());

        const data =
          await applyCoupon(coupon);

        dispatch(
          cartActions.applyCouponSuccess(
            data.data
          )
        );

        return data;
      } catch (error) {
        console.log(
          "Apply Coupon Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to apply coupon";

        dispatch(
          cartActions.setError(message)
        );

        throw error;
      }
    },
    [dispatch]
  );

  return {
    fetchCart,
    addToCart,
    removeItem,
    updateQuantity,
    removeAllCart,
    handleApplyCoupon,
  };
}

export default useCart;