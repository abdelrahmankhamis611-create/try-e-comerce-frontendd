import apiClient from "../../../services/apiClient";

// Get All Users
export async function getUsers(params = {}) {
  const response = await apiClient.get("/user", {
    params,
  });

  return response.data;
}

// Get One User
export async function getUserById(userId) {
  const response = await apiClient.get(
    `/user/${userId}`
  );

  return response.data;
}

// Create User
export async function createUser(userData) {
  const response = await apiClient.post(
    "/user",
    userData
  );

  return response.data;
}

// Update User
export async function updateUser(
  userId,
  userData
) {
  const response = await apiClient.put(
    `/user/${userId}`,
    userData
  );

  return response.data;
}

// Change User Password
export async function changeUserPassword(
  userId,
  passwordData
) {
  const response = await apiClient.put(
    `/user/changePassword/${userId}`,
    passwordData
  );

  return response.data;
}

// Delete User
export async function deleteUser(userId) {
  const response = await apiClient.delete(
    `/user/${userId}`
  );

  return response.data;
}