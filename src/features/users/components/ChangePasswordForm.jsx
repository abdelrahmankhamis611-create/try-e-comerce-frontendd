import { useState } from "react";

function ChangePasswordForm({ onCancel, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(formData);
  };

  return (
    <form
      className="account-edit-form"
      onSubmit={handleSubmit}
    >
      <div className="account-form-group">
        <label htmlFor="currentPassword">
          Current Password
        </label>

        <input
          id="currentPassword"
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          required
        />
      </div>

      <div className="account-form-group">
        <label htmlFor="password">
          New Password
        </label>

        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
        />
      </div>

      <div className="account-form-group">
        <label htmlFor="passwordConfirm">
          Confirm New Password
        </label>

        <input
          id="passwordConfirm"
          type="password"
          name="passwordConfirm"
          value={formData.passwordConfirm}
          onChange={handleChange}
          required
          minLength={6}
        />
      </div>

      <div className="account-actions">
        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Changing Password..." : "Change Password"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;