import apiClient from "../../../services/apiClient";

// =========================
// Get All Products
// =========================
export async function getProducts(params = {}) {
  const response = await apiClient.get("/product", {
    params,
  });

  return response.data;
}

// =========================
// Get Product By ID
// =========================
export async function getProductById(productId) {
  const response = await apiClient.get(
    `/product/${productId}`
  );

  return response.data;
}

// =========================
// Create Product
// =========================
export async function createProduct(productData) {
  const response = await apiClient.post(
    "/product",
    productData
  );

  return response.data;
}

// =========================
// Update Product
// =========================
export async function updateProduct(
  productId,
  productData
) {
  const response = await apiClient.put(
    `/product/${productId}`,
    productData
  );

  return response.data;
}

// =========================
// Delete Product
// =========================
export async function deleteProduct(productId) {
  const response = await apiClient.delete(
    `/product/${productId}`
  );

  return response.data;
}