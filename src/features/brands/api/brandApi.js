import apiClient from "../../../services/apiClient";

// Get All Brands
export async function getBrands(params = {}) {
  const response = await apiClient.get("/brand", {
    params,
  });

  return response.data;
}

// Get One Brand
export async function getBrandById(brandId) {
  const response = await apiClient.get(
    `/brand/${brandId}`
  );

  return response.data;
}

// Create Brand
export async function createBrand(brandData) {
  const response = await apiClient.post(
    "/brand",
    brandData
  );

  return response.data;
}

// Update Brand
export async function updateBrand(
  brandId,
  brandData
) {
  const response = await apiClient.put(
    `/brand/${brandId}`,
    brandData
  );

  return response.data;
}

// Delete Brand
export async function deleteBrand(brandId) {
  const response = await apiClient.delete(
    `/brand/${brandId}`
  );

  return response.data;
}