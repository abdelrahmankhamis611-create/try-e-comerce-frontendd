import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlist: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    getWishlistSuccess: (state, action) => {
      state.loading = false;
      state.wishlist = action.payload;
      state.error = null;
    },

    addToWishlistSuccess: (state, action) => {
      state.loading = false;
      state.wishlist = action.payload;
      state.error = null;
    },

    removeFromWishlistSuccess: (state, action) => {
      state.loading = false;
      state.wishlist = action.payload;
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

export const wishlistActions = wishlistSlice.actions;

export default wishlistSlice.reducer;