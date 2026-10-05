import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppRouter from "./app/router/AppRouter";

import { getToken } from "./services/tokenService";
import { getLoggedUser } from "./features/auth/api/authApi";
import { authActions } from "./features/auth/authSlice";

import useCart from "./features/cart/hooks/useCart";
import useWishlist from "./features/wishlist/hooks/useWishlist";

function App() {
  const dispatch = useDispatch();

  const {
    user,
    isAuthenticated,
    initialized,
  } = useSelector((state) => state.auth);

  const { fetchCart } = useCart();
  const { fetchWishlist } = useWishlist();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();

      if (!token) {
        dispatch(authActions.initializeFailed());
        return;
      }

      try {
        dispatch(authActions.setLoading());

        const data = await getLoggedUser();

        dispatch(
          authActions.initializeSuccess({
            user: data.data,
            token,
          })
        );
      } catch (error) {
        console.log(
          "Auth Initialization Error:",
          error
        );

        dispatch(authActions.initializeFailed());
      }
    };

    initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    if (
      initialized &&
      isAuthenticated &&
      user?.role === "user"
    ) {
      fetchCart();
    }
  }, [
    initialized,
    isAuthenticated,
    user,
    fetchCart,
  ]);

  useEffect(() => {
    if (
      initialized &&
      isAuthenticated &&
      user?.role === "user"
    ) {
      fetchWishlist();
    }
  }, [
    initialized,
    isAuthenticated,
    user,
    fetchWishlist,
  ]);

  return (
    <>
      <AppRouter />

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}

export default App;