import { useCallback } from "react";
import { useDispatch } from "react-redux";

import {
  getWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
} from "../api/wishlistApi";

import { wishlistActions } from "../wishlistSlice";

function useWishlist() {
  // Redux
  const dispatch = useDispatch();

  // Get Wishlist
  const fetchWishlist = useCallback(async () => {
    try {
      dispatch(wishlistActions.setLoading());

      const data = await getWishlist();

      dispatch(
        wishlistActions.getWishlistSuccess(
          data.data
        )
      );

      return data;
    } catch (error) {
      console.log(
        "Fetch Wishlist Error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to fetch wishlist";

      dispatch(
        wishlistActions.setError(message)
      );

      return null;
    }
  }, [dispatch]);

  // Add Product To Wishlist
  const addToWishlist = useCallback(
    async (productId) => {
      try {
        dispatch(wishlistActions.setLoading());

        const data =
          await addProductToWishlist(
            productId
          );

        /*
          The backend returns wishlist IDs
          after adding.

          So we fetch the wishlist again
          to get the populated products.
        */
        await fetchWishlist();

        return data;
      } catch (error) {
        console.log(
          "Add To Wishlist Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to add product to wishlist";

        dispatch(
          wishlistActions.setError(message)
        );

        throw error;
      }
    },
    [dispatch, fetchWishlist]
  );

  // Remove Product From Wishlist
  const removeFromWishlist = useCallback(
    async (productId) => {
      try {
        dispatch(wishlistActions.setLoading());

        const data =
          await removeProductFromWishlist(
            productId
          );

        /*
          The backend returns wishlist IDs
          after removing.

          So we fetch the wishlist again
          to get the remaining populated products.
        */
        await fetchWishlist();

        return data;
      } catch (error) {
        console.log(
          "Remove From Wishlist Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to remove product from wishlist";

        dispatch(
          wishlistActions.setError(message)
        );

        throw error;
      }
    },
    [dispatch, fetchWishlist]
  );

  return {
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
  };
}

export default useWishlist;