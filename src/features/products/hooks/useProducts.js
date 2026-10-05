import { useCallback } from "react";
import { useDispatch } from "react-redux";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productApi";

import { productActions } from "../productSlice";

function useProducts() {
  const dispatch = useDispatch();

  // =========================
  // Get All Products
  // =========================
  const fetchProducts = useCallback(
    async (params = {}) => {
      try {
        dispatch(productActions.setLoading());

        const data = await getProducts(params);

        dispatch(
          productActions.getProductsSuccess(data)
        );

        return data;
      } catch (error) {
        console.log(
          "Fetch Products Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to fetch products";

        dispatch(
          productActions.setError(message)
        );

        throw error;
      }
    },
    [dispatch]
  );

  // =========================
  // Get Product By ID
  // =========================
  const fetchProductById = useCallback(
    async (productId) => {
      try {
        dispatch(productActions.setLoading());

        const data =
          await getProductById(productId);

        dispatch(
          productActions.getProductSuccess(
            data.data
          )
        );

        return data;
      } catch (error) {
        console.log(
          "Fetch Product Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to fetch product";

        dispatch(
          productActions.setError(message)
        );

        throw error;
      }
    },
    [dispatch]
  );

  // =========================
  // Create Product
  // =========================
  const handleCreateProduct = useCallback(
    async (productData) => {
      try {
        dispatch(
          productActions.createProductStart()
        );

        const data =
          await createProduct(productData);

        dispatch(
          productActions.createProductSuccess(
            data.data
          )
        );

        return data;
      } catch (error) {
        console.log(
          "Create Product Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          error.response?.data?.errors?.[0]
            ?.msg ||
          "Failed to create product";

        dispatch(
          productActions.setError(message)
        );

        throw error;
      }
    },
    [dispatch]
  );

  // =========================
  // Update Product
  // =========================
  const handleUpdateProduct =
    useCallback(
      async (productId, productData) => {
        try {
          dispatch(
            productActions.updateProductStart()
          );

          const data =
            await updateProduct(
              productId,
              productData
            );

          dispatch(
            productActions.updateProductSuccess(
              data.data
            )
          );

          return data;
        } catch (error) {
          console.log(
            "Update Product Error:",
            error
          );

          const message =
            error.response?.data?.message ||
            error.response?.data?.errors?.[0]
              ?.msg ||
            "Failed to update product";

          dispatch(
            productActions.setError(message)
          );

          throw error;
        }
      },
      [dispatch]
    );

  // =========================
  // Delete Product
  // =========================
  const handleDeleteProduct =
    useCallback(
      async (productId) => {
        try {
          dispatch(
            productActions.deleteProductStart()
          );

          const data =
            await deleteProduct(productId);

          dispatch(
            productActions.deleteProductSuccess(
              productId
            )
          );

          return data;
        } catch (error) {
          console.log(
            "Delete Product Error:",
            error
          );

          const message =
            error.response?.data?.message ||
            "Failed to delete product";

          dispatch(
            productActions.setError(message)
          );

          throw error;
        }
      },
      [dispatch]
    );

  return {
    fetchProducts,
    fetchProductById,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
  };
}

export default useProducts;