import apiClient from "../../../services/apiClient";

// =========================
// Get All Categories
// =========================
export async function getCategories(params = {}) {
  const response = await apiClient.get("/category", {
    params,
  });

  return response.data;
}

// =========================
// Get Single Category
// =========================
export async function getCategoryById(categoryId) {
  const response = await apiClient.get(
    `/category/${categoryId}`
  );

  return response.data;
}

// =========================
// Create Category
// =========================
export async function createCategory(categoryData) {
  const response = await apiClient.post(
    "/category",
    categoryData
  );

  return response.data;
}

// =========================
// Update Category
// =========================
export async function updateCategory(
  categoryId,
  categoryData
) {
  const response = await apiClient.put(
    `/category/${categoryId}`,
    categoryData
  );

  return response.data;
}

// =========================
// Delete Category
// =========================
export async function deleteCategory(categoryId) {
  const response = await apiClient.delete(
    `/category/${categoryId}`
  );

  return response.data;
}