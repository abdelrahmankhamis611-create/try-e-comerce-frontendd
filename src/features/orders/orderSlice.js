import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",

  initialState,

  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    // =========================
    // OLD STORE ACTIONS
    // =========================

    createOrderSuccess: (state, action) => {
      state.loading = false;

      state.orders.push(action.payload);
      state.order = action.payload;
      state.error = null;
    },

    getOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
      state.error = null;
    },

    getOrderSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.error = null;
    },

    // =========================
    // ADMIN / SHARED ACTIONS
    // =========================

    getOrderByIdSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.error = null;
    },

    updateOrderSuccess: (state, action) => {
      state.loading = false;

      state.orders = state.orders.map((order) =>
        order._id === action.payload._id
          ? action.payload
          : order
      );

      state.order = action.payload;
      state.error = null;
    },

    deleteOrderSuccess: (state, action) => {
      state.loading = false;

      state.orders = state.orders.filter(
        (order) => order._id !== action.payload
      );

      if (state.order?._id === action.payload) {
        state.order = null;
      }

      state.error = null;
    },

    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearOrder: (state) => {
      state.order = null;
    },
  },
});

export const orderActions = orderSlice.actions;

export default orderSlice.reducer;