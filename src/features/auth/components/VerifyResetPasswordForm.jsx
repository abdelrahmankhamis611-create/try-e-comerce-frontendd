import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { verifyResetPassword } from "../api/authApi";

import "./VerifyResetPasswordForm.css";

function VerifyResetPasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [resetCode, setResetCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await verifyResetPassword(resetCode);

      toast.success(
        data.message ||
          "Reset code verified successfully."
      );

      navigate("/reset-password", {
        state: {
          resetToken: data.resetToken,
          email,
        },
      });
    } catch (error) {
      const message =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        "Invalid reset code.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="verify-reset-form"
      onSubmit={handleSubmit}
    >
      <div className="verify-reset-header">
        <h1>Verify Reset Code</h1>

        <p>
          Enter the reset code sent to your email.
        </p>

        {email && (
          <span className="verify-reset-email">
            {email}
          </span>
        )}
      </div>

      <div className="verify-reset-form-group">
        <label htmlFor="resetCode">
          Reset Code
        </label>

        <input
          id="resetCode"
          type="text"
          placeholder="Enter reset code"
          value={resetCode}
          onChange={(e) =>
            setResetCode(e.target.value)
          }
          required
        />
      </div>

      <button
        className="verify-reset-submit-button"
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Verifying..."
          : "Verify Code"}
      </button>

      <p className="verify-reset-back-text">
        Remember your password?{" "}

        <button
          type="button"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>
      </p>
    </form>
  );
}

export default VerifyResetPasswordForm;