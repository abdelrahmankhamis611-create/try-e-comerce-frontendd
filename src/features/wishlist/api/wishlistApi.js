import apiClient from "../../../services/apiClient";

// Get Logged User Wishlist
export async function getWishlist() {
  const response = await apiClient.get("/wishlist");

  return response.data;
}

// Add Product To Wishlist
export async function addProductToWishlist(productId) {
  const response = await apiClient.post("/wishlist", {
    productId,
  });

  return response.data;
}

// Remove Product From Wishlist
export async function removeProductFromWishlist(productId) {
  const response = await apiClient.delete(
    `/wishlist/${productId}`
  );

  return response.data;
}