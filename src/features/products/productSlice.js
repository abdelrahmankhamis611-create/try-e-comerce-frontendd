import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  product: null,

  loading: false,
  error: null,

  pagination: null,

  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

const productSlice = createSlice({
  name: "products",

  initialState,

  reducers: {
    // =========================
    // General Loading
    // =========================
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    // =========================
    // Get All Products
    // =========================
    getProductsSuccess: (state, action) => {
      state.loading = false;

      state.products = action.payload.data;

      state.pagination =
        action.payload.paginationResult;

      state.error = null;
    },

    // =========================
    // Get Product By ID
    // =========================
    getProductSuccess: (state, action) => {
      state.loading = false;

      state.product = action.payload;

      state.error = null;
    },

    // =========================
    // Create Product
    // =========================
    createProductStart: (state) => {
      state.createLoading = true;
      state.error = null;
    },

    createProductSuccess: (state, action) => {
      state.createLoading = false;

      state.products.unshift(
        action.payload
      );

      state.error = null;
    },

    // =========================
    // Update Product
    // =========================
    updateProductStart: (state) => {
      state.updateLoading = true;
      state.error = null;
    },

    updateProductSuccess: (state, action) => {
      state.updateLoading = false;

      const updatedProduct =
        action.payload;

      state.product = updatedProduct;

      const productIndex =
        state.products.findIndex(
          (product) =>
            product._id ===
            updatedProduct._id
        );

      if (productIndex !== -1) {
        state.products[productIndex] =
          updatedProduct;
      }

      state.error = null;
    },

    // =========================
    // Delete Product
    // =========================
    deleteProductStart: (state) => {
      state.deleteLoading = true;
      state.error = null;
    },

    deleteProductSuccess: (
      state,
      action
    ) => {
      state.deleteLoading = false;

      state.products =
        state.products.filter(
          (product) =>
            product._id !==
            action.payload
        );

      if (
        state.product?._id ===
        action.payload
      ) {
        state.product = null;
      }

      state.error = null;
    },

    // =========================
    // Error
    // =========================
    setError: (state, action) => {
      state.loading = false;
      state.createLoading = false;
      state.updateLoading = false;
      state.deleteLoading = false;

      state.error = action.payload;
    },

    // =========================
    // Clear Product
    // =========================
    clearProduct: (state) => {
      state.product = null;
    },

    // =========================
    // Clear Error
    // =========================
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const productActions =
  productSlice.actions;

export default productSlice.reducer;