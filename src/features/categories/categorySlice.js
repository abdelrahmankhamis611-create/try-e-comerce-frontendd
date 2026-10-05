import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  category: null,

  loading: false,
  error: null,

  pagination: null,

  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

const categorySlice = createSlice({
  name: "categories",

  initialState,

  reducers: {
    // =========================
    // Get Categories
    // =========================
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    getCategoriesSuccess: (state, action) => {
      state.loading = false;

      state.categories =
        action.payload.categories;

      state.pagination =
        action.payload.pagination;

      state.error = null;
    },

    // =========================
    // Get Category
    // =========================
    getCategorySuccess: (state, action) => {
      state.loading = false;
      state.category = action.payload;
      state.error = null;
    },

    // =========================
    // Create Category
    // =========================
    createCategoryStart: (state) => {
      state.createLoading = true;
      state.error = null;
    },

    createCategorySuccess: (
      state,
      action
    ) => {
      state.createLoading = false;

      state.categories.unshift(
        action.payload
      );

      state.error = null;
    },

    // =========================
    // Update Category
    // =========================
    updateCategoryStart: (state) => {
      state.updateLoading = true;
      state.error = null;
    },

    updateCategorySuccess: (
      state,
      action
    ) => {
      state.updateLoading = false;

      const updatedCategory =
        action.payload;

      state.category =
        updatedCategory;

      const categoryIndex =
        state.categories.findIndex(
          (category) =>
            category._id ===
            updatedCategory._id
        );

      if (categoryIndex !== -1) {
        state.categories[
          categoryIndex
        ] = updatedCategory;
      }

      state.error = null;
    },

    // =========================
    // Delete Category
    // =========================
    deleteCategoryStart: (state) => {
      state.deleteLoading = true;
      state.error = null;
    },

    deleteCategorySuccess: (
      state,
      action
    ) => {
      state.deleteLoading = false;

      state.categories =
        state.categories.filter(
          (category) =>
            category._id !==
            action.payload
        );

      if (
        state.category?._id ===
        action.payload
      ) {
        state.category = null;
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
    // Clear
    // =========================
    clearCategory: (state) => {
      state.category = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const categoryActions =
  categorySlice.actions;

export default categorySlice.reducer;