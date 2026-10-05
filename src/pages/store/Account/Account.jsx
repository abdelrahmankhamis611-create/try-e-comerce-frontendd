import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import useUser from "../../../features/users/hooks/useUser";
import { authActions } from "../../../features/auth/authSlice";
import { cartActions } from "../../../features/cart/cartSlice";
import { wishlistActions } from "../../../features/wishlist/wishlistSlice";

import ChangePasswordForm from "../../../features/users/components/ChangePasswordForm";

import "./Account.css";

function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const {
    updateUser,
    updatePassword,
    deleteUser,
  } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  if (!user) {
    return (
      <main className="account-page">
        <div className="account-container">
          <p className="account-loading">
            Loading account...
          </p>
        </div>
      </main>
    );
  }

  const handleEditClick = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    });

    setIsEditing(true);
    setIsChangingPassword(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await updateUser(formData);

      dispatch(
        authActions.updateUserSuccess(data.data)
      );

      setIsEditing(false);

      toast.success(
        "Personal information updated successfully"
      );
    } catch (error) {
      const message =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      toast.error(message);
    }
  };

  const handleChangePasswordClick = () => {
    setIsChangingPassword(true);
    setIsEditing(false);
  };

  const handlePasswordSubmit = async (passwordData) => {
    try {
      setPasswordLoading(true);

      const data = await updatePassword(passwordData);

      dispatch(
        authActions.updatePasswordSuccess({
          user: data.data,
          token: data.token,
        })
      );

      toast.success(
        "Password changed successfully."
      );

      setIsChangingPassword(false);
    } catch (error) {
      const message =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      toast.error(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePasswordCancel = () => {
    setIsChangingPassword(false);
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Delete Account?",
      text: "Are you sure you want to deactivate your account?",
      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Yes, delete my account",
      cancelButtonText: "Cancel",

      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",

      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setDeleteLoading(true);

      await deleteUser();

      dispatch(authActions.logout());
      dispatch(cartActions.clearCartSuccess());
      dispatch(wishlistActions.getWishlistSuccess([]));

      await Swal.fire({
        title: "Account Deleted",
        text: "Your account has been deactivated successfully.",
        icon: "success",
        confirmButtonColor: "#f97316",
      });

      navigate("/login", { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <main className="account-page">
      <div className="account-container">

        <div className="account-header">
          <h1>My Account</h1>

          <p>
            Manage your personal information
            and account settings.
          </p>
        </div>

        <div className="account-card">

          <div className="account-card-header">

            <div className="account-avatar">
              {user.name
                ?.charAt(0)
                .toUpperCase() || "U"}
            </div>

            <div>
              <h2>{user.name}</h2>

              <p>{user.email}</p>
            </div>

          </div>

          {!isEditing && !isChangingPassword && (
            <>
              <div className="account-info">

                <div className="account-info-item">
                  <span>Name</span>

                  <strong>
                    {user.name}
                  </strong>
                </div>

                <div className="account-info-item">
                  <span>Email</span>

                  <strong>
                    {user.email}
                  </strong>
                </div>

                <div className="account-info-item">
                  <span>Phone</span>

                  <strong>
                    {user.phone || "Not added"}
                  </strong>
                </div>

                <div className="account-info-item">
                  <span>Account Type</span>

                  <strong>
                    {user.role}
                  </strong>
                </div>

              </div>

              <div className="account-actions">

                <button
                  type="button"
                  onClick={handleEditClick}
                >
                  Edit Personal Information
                </button>

                <button
                  type="button"
                  onClick={handleChangePasswordClick}
                >
                  Change Password
                </button>

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                >
                  {deleteLoading
                    ? "Deactivating..."
                    : "Delete Account"}
                </button>

              </div>
            </>
          )}

          {isEditing && (
            <form
              className="account-edit-form"
              onSubmit={handleSubmit}
            >

              <div className="account-form-group">

                <label htmlFor="name">
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="account-form-group">

                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="account-form-group">

                <label htmlFor="phone">
                  Phone
                </label>

                <input
                  id="phone"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />

              </div>

              <div className="account-actions">

                <button type="submit">
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

              </div>

            </form>
          )}

          {isChangingPassword && (
            <ChangePasswordForm
              onSubmit={handlePasswordSubmit}
              onCancel={handlePasswordCancel}
              loading={passwordLoading}
            />
          )}

        </div>

      </div>
    </main>
  );
}

export default Account;