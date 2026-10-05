import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subCategories: [],
  subCategory: null,

  loading: false,
  error: null,

  pagination: null,

  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

const subCategorySlice =
  createSlice({
    name: "subCategories",

    initialState,

    reducers: {
      // =========================
      // Get SubCategories
      // =========================
      setLoading: (state) => {
        state.loading = true;
        state.error = null;
      },

      getSubCategoriesSuccess: (
        state,
        action
      ) => {
        state.loading = false;

        state.subCategories =
          action.payload.subCategories;

        state.pagination =
          action.payload.pagination;

        state.error = null;
      },

      // =========================
      // Get Single SubCategory
      // =========================
      getSubCategorySuccess: (
        state,
        action
      ) => {
        state.loading = false;

        state.subCategory =
          action.payload;

        state.error = null;
      },

      // =========================
      // Create
      // =========================
      createSubCategoryStart: (
        state
      ) => {
        state.createLoading = true;
        state.error = null;
      },

      createSubCategorySuccess: (
        state,
        action
      ) => {
        state.createLoading = false;

        state.subCategories.unshift(
          action.payload
        );

        state.error = null;
      },

      // =========================
      // Update
      // =========================
      updateSubCategoryStart: (
        state
      ) => {
        state.updateLoading = true;
        state.error = null;
      },

      updateSubCategorySuccess: (
        state,
        action
      ) => {
        state.updateLoading = false;

        const updatedSubCategory =
          action.payload;

        state.subCategory =
          updatedSubCategory;

        const index =
          state.subCategories.findIndex(
            (subCategory) =>
              subCategory._id ===
              updatedSubCategory._id
          );

        if (index !== -1) {
          state.subCategories[
            index
          ] = updatedSubCategory;
        }

        state.error = null;
      },

      // =========================
      // Delete
      // =========================
      deleteSubCategoryStart: (
        state
      ) => {
        state.deleteLoading = true;
        state.error = null;
      },

      deleteSubCategorySuccess: (
        state,
        action
      ) => {
        state.deleteLoading = false;

        state.subCategories =
          state.subCategories.filter(
            (subCategory) =>
              subCategory._id !==
              action.payload
          );

        if (
          state.subCategory?._id ===
          action.payload
        ) {
          state.subCategory = null;
        }

        state.error = null;
      },

      // =========================
      // Error
      // =========================
      setError: (
        state,
        action
      ) => {
        state.loading = false;
        state.createLoading = false;
        state.updateLoading = false;
        state.deleteLoading = false;

        state.error =
          action.payload;
      },

      // =========================
      // Clear
      // =========================
      clearSubCategory: (
        state
      ) => {
        state.subCategory = null;
      },

      clearError: (state) => {
        state.error = null;
      },
    },
  });

export const subCategoryActions =
  subCategorySlice.actions;

export default subCategorySlice.reducer;