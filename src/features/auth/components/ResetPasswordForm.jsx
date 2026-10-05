import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { resetPassword } from "../api/authApi";

import "./ResetPasswordForm.css";

function ResetPasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const resetToken = location.state?.resetToken || "";

  const [formData, setFormData] = useState({
    newPassword: "",
    passwordConfirm: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resetToken) {
      toast.error(
        "Reset session expired. Please start again."
      );

      navigate("/forgot-password");
      return;
    }

    if (
      formData.newPassword !==
      formData.passwordConfirm
    ) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const data = await resetPassword(
        resetToken,
        formData.newPassword
      );

      toast.success(
        data.message ||
          "Password reset successfully. Please login."
      );

      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        "Failed to reset password.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="reset-password-form"
      onSubmit={handleSubmit}
    >
      <div className="reset-password-header">
        <h1>Reset Password</h1>

        <p>
          Enter your new password below.
        </p>
      </div>

      <div className="reset-password-form-group">
        <label htmlFor="newPassword">
          New Password
        </label>

        <input
          id="newPassword"
          type="password"
          name="newPassword"
          placeholder="Enter your new password"
          value={formData.newPassword}
          onChange={handleChange}
          minLength={6}
          required
        />
      </div>

      <div className="reset-password-form-group">
        <label htmlFor="passwordConfirm">
          Confirm Password
        </label>

        <input
          id="passwordConfirm"
          type="password"
          name="passwordConfirm"
          placeholder="Confirm your new password"
          value={formData.passwordConfirm}
          onChange={handleChange}
          minLength={6}
          required
        />
      </div>

      <button
        className="reset-password-submit-button"
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Resetting..."
          : "Reset Password"}
      </button>

      <p className="reset-password-login-text">
        Remember your password?{" "}

        <Link to="/login">
          Login
        </Link>
      </p>
    </form>
  );
}

export default ResetPasswordForm;