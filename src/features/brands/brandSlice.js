import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  brands: [],
  brand: null,
  loading: false,
  error: null,
};

const brandSlice = createSlice({
  name: "brands",

  initialState,

  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    getBrandsSuccess: (state, action) => {
      state.loading = false;
      state.brands = action.payload;
      state.error = null;
    },

    getBrandByIdSuccess: (state, action) => {
      state.loading = false;
      state.brand = action.payload;
      state.error = null;
    },

    createBrandSuccess: (state, action) => {
      state.loading = false;
      state.brands.unshift(action.payload);
      state.error = null;
    },

    updateBrandSuccess: (state, action) => {
      state.loading = false;

      state.brands = state.brands.map((brand) =>
        brand._id === action.payload._id
          ? action.payload
          : brand
      );

      state.error = null;
    },

    deleteBrandSuccess: (state, action) => {
      state.loading = false;

      state.brands = state.brands.filter(
        (brand) => brand._id !== action.payload
      );

      state.error = null;
    },

    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const brandActions = brandSlice.actions;

export default brandSlice.reducer;