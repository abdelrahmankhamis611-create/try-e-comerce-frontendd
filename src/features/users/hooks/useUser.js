import { useCallback } from "react";
import { useDispatch } from "react-redux";

import {
  getLoggedUser,
  updateLoggedUserData,
  updateUserPassword,
  deleteLoggedUser,
} from "../api/userApi";

import { userActions } from "../userSlice";

function useUser() {
  const dispatch = useDispatch();

  const fetchUser = useCallback(async () => {
    try {
      dispatch(userActions.setLoading());

      const data = await getLoggedUser();

      dispatch(
        userActions.getUserSuccess(data.data)
      );

      return data;
    } catch (error) {
      console.log("Fetch User Error:", error);

      const message =
        error.response?.data?.message ||
        "Failed to fetch user";

      dispatch(
        userActions.setError(message)
      );

      return null;
    }
  }, [dispatch]);

  const updateUser = useCallback(
    async (userData) => {
      try {
        dispatch(userActions.setLoading());

        const data = await updateLoggedUserData(
          userData
        );

        dispatch(
          userActions.updateUserSuccess(data.data)
        );

        return data;
      } catch (error) {
        console.log("Update User Error:", error);

        const message =
          error.response?.data?.message ||
          "Failed to update user";

        dispatch(
          userActions.setError(message)
        );

        throw error;
      }
    },
    [dispatch]
  );

  const updatePassword = useCallback(
    async (passwordData) => {
      try {
        dispatch(userActions.setLoading());

        const data = await updateUserPassword(
          passwordData
        );

        dispatch(
          userActions.updatePasswordSuccess(data.data)
        );

        return data;
      } catch (error) {
        console.log(
          "Update Password Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to update password";

        dispatch(
          userActions.setError(message)
        );

        throw error;
      }
    },
    [dispatch]
  );

  const deleteUser = useCallback(async () => {
    try {
      dispatch(userActions.setLoading());

      const data = await deleteLoggedUser();

      dispatch(userActions.clearUser());

      return data;
    } catch (error) {
      console.log("Delete User Error:", error);

      const message =
        error.response?.data?.message ||
        "Failed to delete user";

      dispatch(
        userActions.setError(message)
      );

      throw error;
    }
  }, [dispatch]);

  return {
    fetchUser,
    updateUser,
    updatePassword,
    deleteUser,
  };
}

export default useUser;