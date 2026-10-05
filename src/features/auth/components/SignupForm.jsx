import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { signupUser } from "../api/authApi";
import { authActions } from "../authSlice";

import "./SignupForm.css";

function SignupForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(authActions.setLoading());

      const data = await signupUser(formData);

      dispatch(authActions.initializeFailed());

      toast.success(
        data.message ||
          "Account created successfully. Please login."
      );

      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        "Signup failed";

      dispatch(
        authActions.setError(message)
      );

      toast.error(message);
    }
  };

  return (
    <form
      className="signup-form"
      onSubmit={handleSubmit}
    >
      <div className="signup-header">
        <h1>Create Account</h1>

        <p>
          Create your account and start shopping.
        </p>
      </div>

      <div className="signup-form-group">
        <label htmlFor="name">
          Full Name
        </label>

        <input
          id="name"
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          minLength={3}
          required
        />
      </div>

      <div className="signup-form-group">
        <label htmlFor="email">
          Email Address
        </label>

        <input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="signup-form-group">
        <label htmlFor="password">
          Password
        </label>

        <input
          id="password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          minLength={6}
          required
        />
      </div>

      <div className="signup-form-group">
        <label htmlFor="passwordConfirm">
          Confirm Password
        </label>

        <input
          id="passwordConfirm"
          type="password"
          name="passwordConfirm"
          placeholder="Confirm your password"
          value={formData.passwordConfirm}
          onChange={handleChange}
          minLength={6}
          required
        />
      </div>

      <button
        className="signup-submit-button"
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Creating Account..."
          : "Create Account"}
      </button>

      <div className="signup-divider">
        <span>OR</span>
      </div>

      <p className="signup-login-text">
        Already have an account?{" "}

        <Link to="/login">
          Login
        </Link>
      </p>
    </form>
  );
}

export default SignupForm;