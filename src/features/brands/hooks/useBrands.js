import { useCallback } from "react";
import { useDispatch } from "react-redux";

import {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../api/brandApi";

import { brandActions } from "../brandSlice";

function useBrands() {
  const dispatch = useDispatch();

  const fetchBrands = useCallback(
    async (params = {}) => {
      try {
        dispatch(brandActions.setLoading());

        const data = await getBrands(params);

        dispatch(
          brandActions.getBrandsSuccess(data.data)
        );

        dispatch(
          brandActions.setPagination(
            data.paginationResult
          )
        );

        return data;
      } catch (error) {
        console.log(
          "Fetch Brands Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to fetch brands";

        dispatch(
          brandActions.setError(message)
        );

        return null;
      }
    },
    [dispatch]
  );

  const fetchBrandById = useCallback(
    async (brandId) => {
      try {
        dispatch(brandActions.setLoading());

        const data =
          await getBrandById(brandId);

        dispatch(
          brandActions.getBrandByIdSuccess(
            data.data
          )
        );

        return data;
      } catch (error) {
        console.log(
          "Fetch Brand Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to fetch brand";

        dispatch(
          brandActions.setError(message)
        );

        return null;
      }
    },
    [dispatch]
  );

  const handleCreateBrand = useCallback(
    async (brandData) => {
      try {
        dispatch(brandActions.setLoading());

        const data =
          await createBrand(brandData);

        dispatch(
          brandActions.createBrandSuccess(
            data.data
          )
        );

        return data;
      } catch (error) {
        console.log(
          "Create Brand Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to create brand";

        dispatch(
          brandActions.setError(message)
        );

        throw error;
      }
    },
    [dispatch]
  );

  const handleUpdateBrand = useCallback(
    async (brandId, brandData) => {
      try {
        dispatch(brandActions.setLoading());

        const data =
          await updateBrand(
            brandId,
            brandData
          );

        dispatch(
          brandActions.updateBrandSuccess(
            data.data
          )
        );

        return data;
      } catch (error) {
        console.log(
          "Update Brand Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to update brand";

        dispatch(
          brandActions.setError(message)
        );

        throw error;
      }
    },
    [dispatch]
  );

  const handleDeleteBrand = useCallback(
    async (brandId) => {
      try {
        dispatch(brandActions.setLoading());

        await deleteBrand(brandId);

        dispatch(
          brandActions.deleteBrandSuccess(
            brandId
          )
        );
      } catch (error) {
        console.log(
          "Delete Brand Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to delete brand";

        dispatch(
          brandActions.setError(message)
        );

        throw error;
      }
    },
    [dispatch]
  );

  return {
    fetchBrands,
    fetchBrandById,
    handleCreateBrand,
    handleUpdateBrand,
    handleDeleteBrand,
  };
}

export default useBrands;