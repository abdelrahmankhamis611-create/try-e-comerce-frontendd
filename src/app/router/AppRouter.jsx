
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AdminRoute from "./AdminRoute";

import StoreLayout from "../../layouts/StoreLayout/StoreLayout";
import AuthLayout from "../../layouts/AuthLayout/AuthLayout";
import AdminLayout from "../../layouts/AdminLayout/AdminLayout";

import LoginForm from "../../features/auth/components/LoginForm";
import SignupForm from "../../features/auth/components/SignupForm";
import ForgotPasswordForm from "../../features/auth/components/ForgotPasswordForm";
import VerifyResetPasswordForm from "../../features/auth/components/VerifyResetPasswordForm";
import ResetPasswordForm from "../../features/auth/components/ResetPasswordForm";

import Home from "../../pages/store/Home/Home";
import Products from "../../pages/store/Products/Products";
import ProductDetails from "../../pages/store/ProductDetails/ProductDetails";
import Cart from "../../pages/store/Cart/Cart";
import Wishlist from "../../pages/store/Wishlist/Wishlist";
import Checkout from "../../pages/store/Checkout/Checkout";
import Orders from "../../pages/store/Orders/Orders";
import OrderDetails from "../../pages/store/OrderDetails/OrderDetails";
import Account from "../../pages/store/Account/Account";

import Dashboard from "../../pages/admin/Dashboard/Dashboard";
import AdminProducts from "../../pages/admin/Products/Products";
import AddProduct from "../../pages/admin/Products/AddProduct/AddProduct";
import EditProduct from "../../pages/admin/Products/EditProduct";
import AdminCategories from "../../pages/admin/Categories/Categories";
import AdminSubCategories from "../../pages/admin/Subcategories/Subcategories";
import AdminBrands from "../../pages/admin/Brands/Brands";
import AdminUsers from "../../pages/admin/Users/Users";
import AdminOrders from "../../pages/admin/Orders/Orders";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ========================= */}
        {/* STORE */}
        {/* ========================= */}

        <Route element={<StoreLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/products/:productId"
            element={<ProductDetails />}
          />

          <Route element={<ProtectedRoute />}>

            <Route
              path="/cart"
              element={<Cart />}
            />

            <Route
              path="/wishlist"
              element={<Wishlist />}
            />

            <Route
              path="/checkout"
              element={<Checkout />}
            />

            <Route
              path="/orders"
              element={<Orders />}
            />

            <Route
              path="/orders/:orderId"
              element={<OrderDetails />}
            />

            <Route
              path="/account"
              element={<Account />}
            />

          </Route>

        </Route>

        {/* ========================= */}
        {/* AUTHENTICATION */}
        {/* ========================= */}

        <Route element={<PublicRoute />}>

          <Route element={<AuthLayout />}>

            <Route
              path="/login"
              element={<LoginForm />}
            />

            <Route
              path="/signup"
              element={<SignupForm />}
            />

            <Route
              path="/forgot-password"
              element={<ForgotPasswordForm />}
            />

            <Route
              path="/verify-reset-password"
              element={<VerifyResetPasswordForm />}
            />

            <Route
              path="/reset-password"
              element={<ResetPasswordForm />}
            />

          </Route>

        </Route>

        {/* ========================= */}
        {/* ADMIN */}
        {/* ========================= */}

        <Route element={<AdminRoute />}>

          <Route element={<AdminLayout />}>

            <Route
              path="/admin"
              element={<Dashboard />}
            />

            {/* ========================= */}
            {/* ADMIN PRODUCTS */}
            {/* ========================= */}

            <Route
              path="/admin/products"
              element={<AdminProducts />}
            />

            <Route
              path="/admin/products/add"
              element={<AddProduct />}
            />

            <Route
              path="/admin/products/edit/:productId"
              element={<EditProduct />}
            />

            {/* ========================= */}
            {/* ADMIN CATEGORIES */}
            {/* ========================= */}

            <Route
              path="/admin/categories"
              element={<AdminCategories />}
            />

            <Route
              path="/admin/subcategories"
              element={<AdminSubCategories />}
            />

            <Route
              path="/admin/brands"
              element={<AdminBrands />}
            />

            <Route
              path="/admin/users"
              element={<AdminUsers />}
            />

            <Route
              path="/admin/orders"
              element={<AdminOrders />}
            />

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;

