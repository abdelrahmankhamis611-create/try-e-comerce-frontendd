import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  user: null,
  loading: false,
  error: null,
};

const userAdminSlice = createSlice({
  name: "adminUsers",

  initialState,

  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    getUsersSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload;
      state.error = null;
    },

    getUserByIdSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },

    createUserSuccess: (state, action) => {
      state.loading = false;
      state.users.unshift(action.payload);
      state.error = null;
    },

    updateUserSuccess: (state, action) => {
      state.loading = false;

      state.users = state.users.map((user) =>
        user._id === action.payload._id
          ? action.payload
          : user
      );

      state.user = action.payload;
      state.error = null;
    },

    changeUserPasswordSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },

    deleteUserSuccess: (state, action) => {
      state.loading = false;

      state.users = state.users.filter(
        (user) => user._id !== action.payload
      );

      if (state.user?._id === action.payload) {
        state.user = null;
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

    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const userAdminActions =
  userAdminSlice.actions;

export default userAdminSlice.reducer;