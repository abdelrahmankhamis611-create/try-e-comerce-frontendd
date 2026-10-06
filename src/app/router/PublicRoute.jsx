import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function PublicRoute() {
  const {
    user,
    isAuthenticated,
    initialized,
  } = useSelector((state) => state.auth);

  if (!initialized) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    if (
      user?.role === "admin" ||
      user?.role === "manager"
    ) {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }
  }

  return <Outlet />;
}

export default PublicRoute;