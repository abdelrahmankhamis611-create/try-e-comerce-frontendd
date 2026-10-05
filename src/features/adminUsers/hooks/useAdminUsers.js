import { useCallback } from "react";
import { useDispatch } from "react-redux";

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  changeUserPassword,
  deleteUser,
} from "../api/userAdminApi";

import { userAdminActions } from "../userAdminSlice";

function useAdminUsers() {
  const dispatch = useDispatch();

  const fetchUsers = useCallback(
    async (params = {}) => {
      try {
        dispatch(userAdminActions.setLoading());

        const data = await getUsers(params);

        dispatch(
          userAdminActions.getUsersSuccess(data.data)
        );

        return data;
      } catch (error) {
        console.log(
          "Fetch Users Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to fetch users";

        dispatch(
          userAdminActions.setError(message)
        );

        return null;
      }
    },
    [dispatch]
  );

  const fetchUserById = useCallback(
    async (userId) => {
      try {
        dispatch(userAdminActions.setLoading());

        const data = await getUserById(userId);

        dispatch(
          userAdminActions.getUserByIdSuccess(
            data.data
          )
        );

        return data;
      } catch (error) {
        console.log(
          "Fetch User Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to fetch user";

        dispatch(
          userAdminActions.setError(message)
        );

        return null;
      }
    },
    [dispatch]
  );

  const handleCreateUser = useCallback(
    async (userData) => {
      try {
        dispatch(userAdminActions.setLoading());

        const data = await createUser(userData);

        dispatch(
          userAdminActions.createUserSuccess(
            data.data
          )
        );

        return data;
      } catch (error) {
        console.log(
          "Create User Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to create user";

        dispatch(
          userAdminActions.setError(message)
        );

        throw error;
      }
    },
    [dispatch]
  );

  const handleUpdateUser = useCallback(
    async (userId, userData) => {
      try {
        dispatch(userAdminActions.setLoading());

        const data = await updateUser(
          userId,
          userData
        );

        dispatch(
          userAdminActions.updateUserSuccess(
            data.data
          )
        );

        return data;
      } catch (error) {
        console.log(
          "Update User Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to update user";

        dispatch(
          userAdminActions.setError(message)
        );

        throw error;
      }
    },
    [dispatch]
  );

  const handleChangeUserPassword =
    useCallback(
      async (userId, passwordData) => {
        try {
          dispatch(
            userAdminActions.setLoading()
          );

          const data =
            await changeUserPassword(
              userId,
              passwordData
            );

          dispatch(
            userAdminActions.changeUserPasswordSuccess(
              data.data
            )
          );

          return data;
        } catch (error) {
          console.log(
            "Change User Password Error:",
            error
          );

          const message =
            error.response?.data?.message ||
            "Failed to change user password";

          dispatch(
            userAdminActions.setError(message)
          );

          throw error;
        }
      },
      [dispatch]
    );

  const handleDeleteUser = useCallback(
    async (userId) => {
      try {
        dispatch(userAdminActions.setLoading());

        await deleteUser(userId);

        dispatch(
          userAdminActions.deleteUserSuccess(
            userId
          )
        );
      } catch (error) {
        console.log(
          "Delete User Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to delete user";

        dispatch(
          userAdminActions.setError(message)
        );

        throw error;
      }
    },
    [dispatch]
  );

  return {
    fetchUsers,
    fetchUserById,
    handleCreateUser,
    handleUpdateUser,
    handleChangeUserPassword,
    handleDeleteUser,
  };
}

export default useAdminUsers;