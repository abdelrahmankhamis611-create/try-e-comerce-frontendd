import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { loginUser } from "../api/authApi";
import { authActions } from "../authSlice";

import "./LoginForm.css";

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

      const data = await loginUser(formData);

      dispatch(
        authActions.loginSuccess({
          user: data.data,
          token: data.token,
        })
      );

      toast.success(
        data.message || "Login successful."
      );

      if (
        data.data.role === "admin" ||
        data.data.role === "manager"
      ) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      const message =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        "Login failed";

      dispatch(
        authActions.setError(message)
      );

      toast.error(message);
    }
  };

  return (
    <form
      className="login-form"
      onSubmit={handleSubmit}
    >
      <div className="login-header">
        <h1>Welcome Back</h1>

        <p>
          Login to continue shopping with us.
        </p>
      </div>

      <div className="login-form-group">
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

      <div className="login-form-group">
        <div className="login-password-label">
          <label htmlFor="password">
            Password
          </label>

          <Link to="/forgot-password">
            Forgot Password?
          </Link>
        </div>

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

      <button
        className="login-submit-button"
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Logging in..."
          : "Login"}
      </button>

      <div className="login-divider">
        <span>OR</span>
      </div>

      <p className="login-signup-text">
        Don't have an account?{" "}

        <Link to="/signup">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;