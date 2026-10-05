
import apiClient from "../../../services/apiClient";

// Create Cash Order
export async function createCashOrder(
  cartId,
  shippingAddress
) {
  const response = await apiClient.post(
    `/order/${cartId}`,
    {
      shippingAddress,
    }
  );

  return response.data;
}

// Get Checkout Session
export async function getCheckoutSession(
  cartId,
  orderData
) {
  const response = await apiClient.get(
    `/order/checkout-session/${cartId}`,
    {
      data: {
        shippingAddress:
          orderData?.shippingAddress,
      },
    }
  );

  return response.data;
}

// Get All Orders
export async function getOrders(params = {}) {
  const response = await apiClient.get("/order", {
    params,
  });

  return response.data;
}

// Get One Order
export async function getOrderById(orderId) {
  const response = await apiClient.get(
    `/order/${orderId}`
  );

  return response.data;
}

// Mark Order As Paid
export async function markOrderAsPaid(orderId) {
  const response = await apiClient.put(
    `/order/paid/${orderId}`
  );

  return response.data;
}

// Mark Order As Delivered
export async function markOrderAsDelivered(
  orderId
) {
  const response = await apiClient.put(
    `/order/delivered/${orderId}`
  );

  return response.data;
}

// Delete Order
export async function deleteOrder(orderId) {
  const response = await apiClient.delete(
    `/order/${orderId}`
  );

  return response.data;
}

