import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: null,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    getCartSuccess: (state, action) => {
      state.loading = false;
      state.cart = action.payload;
      state.error = null;
    },

    addToCartSuccess: (state, action) => {
      state.loading = false;
      state.cart = action.payload;
      state.error = null;
    },

    updateQuantitySuccess: (state, action) => {
      state.loading = false;
      state.cart = action.payload;
      state.error = null;
    },

    removeItemSuccess: (state, action) => {
      state.loading = false;
      state.cart = action.payload;
      state.error = null;
    },

    clearCartSuccess: (state) => {
      state.loading = false;
      state.cart = null;
      state.error = null;
    },

    applyCouponSuccess: (state, action) => {
      state.loading = false;
      state.cart = action.payload;
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

export const cartActions = cartSlice.actions;

export default cartSlice.reducer;