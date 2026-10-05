import {
  getSubCategories,
  getSubCategoriesByCategory,
  getSubCategoryById,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../api/subcategoryApi";

import {
  subCategoryActions,
} from "../subcategorySlice";

function useSubCategories() {
  const dispatch = useDispatch();

  // =========================
  // Get All SubCategories
  // =========================
  const fetchSubCategories =
    useCallback(
      async (params = {}) => {
        try {
          dispatch(
            subCategoryActions.setLoading()
          );

          const data =
            await getSubCategories(
              params
            );

          dispatch(
            subCategoryActions.getSubCategoriesSuccess(
              {
                subCategories:
                  data.data,
                pagination:
                  data.paginationResult,
              }
            )
          );

          return data;
        } catch (error) {
          console.log(
            "Fetch SubCategories Error:",
            error
          );

          const message =
            error.response?.data
              ?.message ||
            "Failed to fetch subcategories";

          dispatch(
            subCategoryActions.setError(
              message
            )
          );

          throw error;
        }
      },
      [dispatch]
    );

  // =========================
  // Get By Category
  // =========================
  const fetchSubCategoriesByCategory =
    useCallback(
      async (
        categoryId,
        params = {}
      ) => {
        try {
          dispatch(
            subCategoryActions.setLoading()
          );

          const data =
            await getSubCategoriesByCategory(
              categoryId,
              params
            );

          dispatch(
            subCategoryActions.getSubCategoriesSuccess(
              {
                subCategories:
                  data.data,
                pagination:
                  data.paginationResult,
              }
            )
          );

          return data;
        } catch (error) {
          console.log(
            "Fetch SubCategories By Category Error:",
            error
          );

          const message =
            error.response?.data
              ?.message ||
            "Failed to fetch subcategories";

          dispatch(
            subCategoryActions.setError(
              message
            )
          );

          throw error;
        }
      },
      [dispatch]
    );

  // =========================
  // Get Single
  // =========================
  const fetchSubCategoryById =
    useCallback(
      async (subCategoryId) => {
        try {
          dispatch(
            subCategoryActions.setLoading()
          );

          const data =
            await getSubCategoryById(
              subCategoryId
            );

          dispatch(
            subCategoryActions.getSubCategorySuccess(
              data.data
            )
          );

          return data;
        } catch (error) {
          console.log(
            "Fetch SubCategory Error:",
            error
          );

          const message =
            error.response?.data
              ?.message ||
            "Failed to fetch subcategory";

          dispatch(
            subCategoryActions.setError(
              message
            )
          );

          throw error;
        }
      },
      [dispatch]
    );

  // =========================
  // Create
  // =========================
  const handleCreateSubCategory =
    useCallback(
      async (subCategoryData) => {
        try {
          dispatch(
            subCategoryActions.createSubCategoryStart()
          );

          const data =
            await createSubCategory(
              subCategoryData
            );

          dispatch(
            subCategoryActions.createSubCategorySuccess(
              data.data
            )
          );

          return data;
        } catch (error) {
          console.log(
            "Create SubCategory Error:",
            error
          );

          const message =
            error.response?.data
              ?.message ||
            error.response?.data
              ?.errors?.[0]?.msg ||
            "Failed to create subcategory";

          dispatch(
            subCategoryActions.setError(
              message
            )
          );

          throw error;
        }
      },
      [dispatch]
    );

  // =========================
  // Update
  // =========================
  const handleUpdateSubCategory =
    useCallback(
      async (
        subCategoryId,
        subCategoryData
      ) => {
        try {
          dispatch(
            subCategoryActions.updateSubCategoryStart()
          );

          const data =
            await updateSubCategory(
              subCategoryId,
              subCategoryData
            );

          dispatch(
            subCategoryActions.updateSubCategorySuccess(
              data.data
            )
          );

          return data;
        } catch (error) {
          console.log(
            "Update SubCategory Error:",
            error
          );

          const message =
            error.response?.data
              ?.message ||
            error.response?.data
              ?.errors?.[0]?.msg ||
            "Failed to update subcategory";

          dispatch(
            subCategoryActions.setError(
              message
            )
          );

          throw error;
        }
      },
      [dispatch]
    );

  // =========================
  // Delete
  // =========================
  const handleDeleteSubCategory =
    useCallback(
      async (subCategoryId) => {
        try {
          dispatch(
            subCategoryActions.deleteSubCategoryStart()
          );

          const data =
            await deleteSubCategory(
              subCategoryId
            );

          dispatch(
            subCategoryActions.deleteSubCategorySuccess(
              subCategoryId
            )
          );

          return data;
        } catch (error) {
          console.log(
            "Delete SubCategory Error:",
            error
          );

          const message =
            error.response?.data
              ?.message ||
            "Failed to delete subcategory";

          dispatch(
            subCategoryActions.setError(
              message
            )
          );

          throw error;
        }
      },
      [dispatch]
    );

  return {
    fetchSubCategories,
    fetchSubCategoriesByCategory,
    fetchSubCategoryById,
    handleCreateSubCategory,
    handleUpdateSubCategory,
    handleDeleteSubCategory,
  };
}

export default useSubCategories;