import apiClient from "../../../services/apiClient";

// Get Logged User Cart
export async function getCart() {
  const response = await apiClient.get("/cart");

  return response.data;
}

// Add Product To Cart
export async function addProductToCart(
  productId,
  color,
  quantity
) {
  const response = await apiClient.post("/cart", {
    productId,
    color,
    quantity,
  });

  return response.data;
}

// Remove All Cart
export async function clearCart() {
  const response = await apiClient.delete("/cart");

  return response.data;
}

// Remove Product From Cart
export async function removeProductFromCart(itemId) {
  const response = await apiClient.put(`/cart/${itemId}`);

  return response.data;
}

// Update Product Quantity
export async function updateCartQuantity(
  itemId,
  quantity
) {
  const response = await apiClient.put(
    `/cart/updateQuantity/${itemId}`,
    {
      quantity,
    }
  );

  return response.data;
}

// Apply Coupon
export async function applyCoupon(coupon) {
  const response = await apiClient.put(
    "/cart/applyCoupon",
    {
      coupon,
    }
  );

  return response.data;
}