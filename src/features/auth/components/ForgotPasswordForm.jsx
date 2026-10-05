import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { forgotPassword } from "../api/authApi";

import "./ForgotPasswordForm.css";

function ForgotPasswordForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await forgotPassword(email);

      toast.success(
        data.message ||
          "Reset code sent to your email."
      );

      navigate("/verify-reset-password", {
        state: {
          email,
        },
      });
    } catch (error) {
      const message =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        "Failed to send reset code.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="forgot-password-form"
      onSubmit={handleSubmit}
    >
      <div className="forgot-password-header">
        <h1>Forgot Password?</h1>

        <p>
          Enter your email address and we will
          send you a reset code.
        </p>
      </div>

      <div className="forgot-password-form-group">
        <label htmlFor="forgot-email">
          Email Address
        </label>

        <input
          id="forgot-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />
      </div>

      <button
        className="forgot-password-submit-button"
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Sending..."
          : "Send Reset Code"}
      </button>

      <p className="forgot-password-login-text">
        Remember your password?{" "}

        <Link to="/login">
          Login
        </Link>
      </p>
    </form>
  );
}

export default ForgotPasswordForm;