import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { getProductById } from "../api/productApi";
import { productActions } from "../productSlice";

function useProduct() {
  const dispatch = useDispatch();

  const fetchProduct = useCallback(
    async (productId) => {
      try {
        dispatch(productActions.setLoading());

        const data = await getProductById(productId);

        dispatch(
          productActions.getProductSuccess(data.data)
        );
      } catch (error) {
        console.log("Fetch Product Error:", error);

        const message =
          error.response?.data?.message ||
          "Failed to fetch product";

        dispatch(productActions.setError(message));
      }
    },
    [dispatch]
  );

  return {
    fetchProduct,
  };
}

export default useProduct;