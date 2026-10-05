import { useCallback } from "react";
import { useDispatch } from "react-redux";

import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryApi";

import { categoryActions } from "../categorySlice";

function useCategories() {
  const dispatch = useDispatch();

  // =========================
  // Get All Categories
  // =========================
  const fetchCategories = useCallback(
    async (params = {}) => {
      try {
        dispatch(
          categoryActions.setLoading()
        );

        const data =
          await getCategories(params);

        dispatch(
          categoryActions.getCategoriesSuccess(
            {
              categories: data.data,
              pagination:
                data.paginationResult,
            }
          )
        );

        return data;
      } catch (error) {
        console.log(
          "Fetch Categories Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to fetch categories";

        dispatch(
          categoryActions.setError(message)
        );

        throw error;
      }
    },
    [dispatch]
  );

  // =========================
  // Get Category By ID
  // =========================
  const fetchCategoryById =
    useCallback(
      async (categoryId) => {
        try {
          dispatch(
            categoryActions.setLoading()
          );

          const data =
            await getCategoryById(
              categoryId
            );

          dispatch(
            categoryActions.getCategorySuccess(
              data.data
            )
          );

          return data;
        } catch (error) {
          console.log(
            "Fetch Category Error:",
            error
          );

          const message =
            error.response?.data?.message ||
            "Failed to fetch category";

          dispatch(
            categoryActions.setError(
              message
            )
          );

          throw error;
        }
      },
      [dispatch]
    );

  // =========================
  // Create Category
  // =========================
  const handleCreateCategory =
    useCallback(
      async (categoryData) => {
        try {
          dispatch(
            categoryActions.createCategoryStart()
          );

          const data =
            await createCategory(
              categoryData
            );

          dispatch(
            categoryActions.createCategorySuccess(
              data.data
            )
          );

          return data;
        } catch (error) {
          console.log(
            "Create Category Error:",
            error
          );

          const message =
            error.response?.data?.message ||
            error.response?.data?.errors?.[0]
              ?.msg ||
            "Failed to create category";

          dispatch(
            categoryActions.setError(
              message
            )
          );

          throw error;
        }
      },
      [dispatch]
    );

  // =========================
  // Update Category
  // =========================
  const handleUpdateCategory =
    useCallback(
      async (
        categoryId,
        categoryData
      ) => {
        try {
          dispatch(
            categoryActions.updateCategoryStart()
          );

          const data =
            await updateCategory(
              categoryId,
              categoryData
            );

          dispatch(
            categoryActions.updateCategorySuccess(
              data.data
            )
          );

          return data;
        } catch (error) {
          console.log(
            "Update Category Error:",
            error
          );

          const message =
            error.response?.data?.message ||
            error.response?.data?.errors?.[0]
              ?.msg ||
            "Failed to update category";

          dispatch(
            categoryActions.setError(
              message
            )
          );

          throw error;
        }
      },
      [dispatch]
    );

  // =========================
  // Delete Category
  // =========================
  const handleDeleteCategory =
    useCallback(
      async (categoryId) => {
        try {
          dispatch(
            categoryActions.deleteCategoryStart()
          );

          const data =
            await deleteCategory(
              categoryId
            );

          dispatch(
            categoryActions.deleteCategorySuccess(
              categoryId
            )
          );

          return data;
        } catch (error) {
          console.log(
            "Delete Category Error:",
            error
          );

          const message =
            error.response?.data?.message ||
            "Failed to delete category";

          dispatch(
            categoryActions.setError(
              message
            )
          );

          throw error;
        }
      },
      [dispatch]
    );

  return {
    fetchCategories,
    fetchCategoryById,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
  };
}

export default useCategories;