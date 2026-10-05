import apiClient from "../../../services/apiClient";

export async function getLoggedUser() {
  const response = await apiClient.get("/user/getMe");

  return response.data;
}

export async function updateLoggedUserData(userData) {
  const response = await apiClient.put(
    "/user/updateData",
    userData
  );

  return response.data;
}

export async function updateUserPassword(passwordData) {
  const response = await apiClient.put(
    "/user/updatePassword",
    passwordData
  );

  return response.data;
}

export async function deleteLoggedUser() {
  const response = await apiClient.delete(
    "/user/deleteMe"
  );

  return response.data;
}