import apiClient from "../../../services/apiClient";

// Login
export async function loginUser(credentials) {
  const response = await apiClient.post("/auth/login", credentials);
  return response.data;
}

// Signup
export async function signupUser(userData) {
  const response = await apiClient.post("/auth/signup", userData);
  return response.data;
}

// Get Logged User
export async function getLoggedUser() {
  const response = await apiClient.get("/user/getMe");
  return response.data;
}

// Forgot Password
export async function forgotPassword(email) {
  const response = await apiClient.post("/auth/forgotPassword", {
    email,
  });
  return response.data;
}

// Verify Reset Password Code
export async function verifyResetPassword(resetCode) {
  const response = await apiClient.post("/auth/verifyResetPassword", {
    resetCode,
  });
  return response.data;
}

// Reset Password
export async function resetPassword(resetToken, newPassword) {
  const response = await apiClient.put("/auth/resetPassword", {
    resetToken,
    newPassword,
  });
  return response.data;
}