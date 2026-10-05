import apiClient from "../../../services/apiClient";

// =========================
// Get All SubCategories
// =========================
export async function getSubCategories(
  params = {}
) {
  const response =
    await apiClient.get("/subCategory", {
      params,
    });

  return response.data;
}

// =========================
// Get SubCategories By Category
// =========================
export async function getSubCategoriesByCategory(
  categoryId,
  params = {}
) {
  const response =
    await apiClient.get(
      `/category/${categoryId}/subcategory`,
      {
        params,
      }
    );

  return response.data;
}

// =========================
// Get Single SubCategory
// =========================
export async function getSubCategoryById(
  subCategoryId
) {
  const response =
    await apiClient.get(
      `/subCategory/${subCategoryId}`
    );

  return response.data;
}

// =========================
// Create SubCategory
// =========================
export async function createSubCategory(
  subCategoryData
) {
  const response =
    await apiClient.post(
      "/subCategory",
      subCategoryData
    );

  return response.data;
}

// =========================
// Update SubCategory
// =========================
export async function updateSubCategory(
  subCategoryId,
  subCategoryData
) {
  const response =
    await apiClient.put(
      `/subCategory/${subCategoryId}`,
      subCategoryData
    );

  return response.data;
}

// =========================
// Delete SubCategory
// =========================
export async function deleteSubCategory(
  subCategoryId
) {
  const response =
    await apiClient.delete(
      `/subCategory/${subCategoryId}`
    );

  return response.data;
}